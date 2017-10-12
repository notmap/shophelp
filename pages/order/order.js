
var pageModel;
const deepClone = require('../../utils/deepClone');
var app = getApp();

Page({
	data: {
		swiper: {
            current: '0',
            show: true
        }
	},

	onLoad: function (option) {
        pageModel = this;
        pageModel.getData.getNewOrder();
        pageModel.getData.getIngOrder();
        pageModel.getData.getRejectOrder();
	},

    onShow: function(option) {},

    tab: {
        switchTab: function(self, e) {
            var active = e.target.dataset.tab || e.detail.current.toString();
            if(active !== self.data.swiper.current) {
                self.setData({
                    swiper: {
                        current: active,
                        show: true
                    }
                });
            }
        }
    },

    orderControl: {

        refuse: function(e) {
            var orderId = e.currentTarget.dataset.orderid;
            app.postOrderReject(orderId, (res) => {
                delete app.globalData.pNewOrder
                pageModel.getData.getNewOrder();
                delete app.globalData.pRejectOrder
                pageModel.getData.getRejectOrder();
            });
        },

        confirm: function(e) {
            var orderId = e.currentTarget.dataset.orderid;
            app.postOrderAccept(orderId, (res) => {
                delete app.globalData.pNewOrder
                pageModel.getData.getNewOrder();
                delete app.globalData.pIngOrder
                pageModel.getData.getIngOrder();
            });
        },

        cancel: function(e) {
            console.log('cancel the order');
        },

        refund: function(e) {
            console.log('refund the order money');
        }
    },

    getData: {
        getNewOrder: function() {
            app.getNewOrder(1).then((newOrder) => {
                pageModel.setData({
                    newOrder: pageModel.orderDataHandle(newOrder)
                });
            });
        },

        getIngOrder: function() {
            app.getIngOrder(1).then((ingOrder) => {
                pageModel.setData({
                    ingOrder: pageModel.orderDataHandle(ingOrder)
                });
            });
        },

        getOverOrder: function() {
            app.getOverOrder(1).then((overOrder) => {
                pageModel.setData({
                    overOrder: pageModel.orderDataHandle(overOrder)
                });
            });
        },

        getRejectOrder: function() {
            app.getRejectOrder(1).then((rejectOrder) => {
                pageModel.setData({
                    rejectOrder: pageModel.orderDataHandle(rejectOrder)
                });
            });
        }
    },

	onEvent: function(e) {
        if(!e.currentTarget.dataset.fun) return;
		var self = this;
		var obj = e.currentTarget.dataset.fun.split('.')[0];
		var fun = e.currentTarget.dataset.fun.split('.')[1];
		this[obj][fun](self, e);
	},

    orderEvent: function(e) {
        this.orderControl[e.currentTarget.dataset.event](e);
    },

    orderDataHandle: function(rawData) {
        var data = deepClone.deepClone(rawData);
        var orderStatus = {
            10: {status: '待接单', button: true, data: false},
            20: {status: '已接单', button: false, data: false},
            30: {status: '配送中', button: true, data: 'order.goExpress'},
            40: {status: '已完成', button: true, data: 'order.goScore'},
            41: {status: '用户撤单', button: false, data: false},
            42: {status: '已退款', button: false, data: false},
            43: {status: '商家撤单', button: false, data: false}
        };

        return data.map((item, index, arr) => {
            item.orderProductList.length > 3 ? item.fold = true : item.fold = false;
            item.button = orderStatus[item.status].button;
            item.data = orderStatus[item.status].data;
            item.statusInfo = orderStatus[item.status].status;
            return item;
        });
    },

    newOrderDataHandle: function(rawData) {
        var data = deepClone.deepClone(rawData);
        var orderStatus = [
            {status: '待接单', button: true, data: false},
            {status: '已超时', button: false, data: false},
            {status: '已接单', button: true, data: 'order.goExpress'},
            {status: '已取消', button: false, data: 'order.goScore'},
            {status: '已完成', button: true, data: false},
            {status: '已退款', button: false, data: false}
        ];

        return data.map((item, index, arr) => {
            item.detail.goods.length > 3 ? item.fold = true : item.fold = false;
            item.button = orderStatus[item.status].button;
            item.data = orderStatus[item.status].data;
            item.statusInfo = orderStatus[item.status].status;
            return item;
        });
    },

    jump: function(e) {
        var data = JSON.stringify(e.currentTarget.dataset.jump);
        wx.navigateTo({url: `../order_detail/order_detail?order=${data}`});
    }
});
