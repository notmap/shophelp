
const deepClone = require('../../utils/deepClone');
var app = getApp();

Page({
	onLoad: function (option) {
        app.getIngOrder().then((ingOrder) => {
            console.log(this.orderDataHandle(ingOrder))
            this.setData({
                income: this.orderDataHandle(ingOrder)
            });
        });
	},

    onShow: function(option) {
    },

	onEvent: function(e) {
        if(!e.currentTarget.dataset.fun) return;
		var obj = e.currentTarget.dataset.fun.split('.')[0];
		var fun = e.currentTarget.dataset.fun.split('.')[1];
		this[obj][fun](this, e);
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
	}
});
