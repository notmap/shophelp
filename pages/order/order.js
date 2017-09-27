
const orderData = require('../../order_data.js');
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
		this.setData({
			newOrder: this.orderDataHandle(orderData.newOrder),
			ingOrder: this.orderDataHandle(orderData.ingOrder),
			overOrder: this.orderDataHandle(orderData.overOrder)
		});
	},

    onShow: function(option) {
    },

    orderDataHandle: function(rawData) {
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
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../order_detail/order_detail`});
    },

    orderEvent: function(e) {
        this.orderControl[e.currentTarget.dataset.event]();
    },

    orderControl: {
        refuse: function() {
            console.log('refuse the order');
        },
        confirm: function() {
            console.log('confirm the order');
        },
        cancel: function() {
            console.log('cancel the order');
        },
        refund: function() {
            console.log('refund the order money');
        }
    },

	onEvent: function(e) {
        if(!e.currentTarget.dataset.fun) return;
		var self = this;
		var obj = e.currentTarget.dataset.fun.split('.')[0];
		var fun = e.currentTarget.dataset.fun.split('.')[1];
		this[obj][fun](self, e);
	},

	tab: {
		switchTab: function(self, e) {
			var active = e.target.dataset.tab || e.detail.current.toString(); // 注意数据类型
			if(active !== self.data.swiper.current) {
				self.setData({
                    swiper: {
                        current: active,
                        show: true
                    }
                });
			}
		}
	}
});
