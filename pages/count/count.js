

const deepClone = require('../../utils/deepClone');
// const server = require('../../utils/server');

var app = getApp();
Page({

    // data: {

    //     swiper: {
    //         current: '0',
    //         show: false
    //     },

    //     income: [
    //         {
    //             id: 123458562535,
    //             name: '山久',
    //             phone: '13905920007',
    //             amount: '38.00',
    //             status: '已完成'
    //         },
    //         {
    //             id: 251436954125,
    //             name: '猫空空',
    //             phone: '13505120157',
    //             amount: '12.00',
    //             status: '已完成'
    //         },
    //         {
    //             id: 251436954125,
    //             name: '小冷',
    //             phone: '135036541258',
    //             amount: '24.00',
    //             status: '已完成'
    //         },
    //         {
    //             id: 251436954125,
    //             name: '野菜',
    //             phone: '13505121589',
    //             amount: '43.00',
    //             status: '已完成'
    //         },
    //         {
    //             id: 251436954125,
    //             name: '我的国',
    //             phone: '13505121236',
    //             amount: '45.00',
    //             status: '已完成'
    //         }
    //     ],

    //     withdraw: [
    //         {
    //             date: '2017-09-12',
    //             record: [
    //                 {
    //                     id: 123458562539,
    //                     amount: '1280.00',
    //                     time: '23:45',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562538,
    //                     amount: '680.00',
    //                     time: '22:35',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562537,
    //                     amount: '2380.00',
    //                     time: '22:15',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562536,
    //                     amount: '465.00',
    //                     time: '20:45',
    //                     status: '已完成'
    //                 }
    //             ]
    //         },
    //         {
    //             date: '2017-09-11',
    //             record: [
    //                 {
    //                     id: 123458562535,
    //                     amount: '854.00',
    //                     time: '22:45',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562534,
    //                     amount: '9564.00',
    //                     time: '20:14',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562533,
    //                     amount: '2150.00',
    //                     time: '15:15',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562532,
    //                     amount: '364.00',
    //                     time: '14:03',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562531,
    //                     amount: '641.00',
    //                     time: '13:45',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562530,
    //                     amount: '1144.00',
    //                     time: '12:44',
    //                     status: '已完成'
    //                 },
    //                 {
    //                     id: 123458562529,
    //                     amount: '987.00',
    //                     time: '11:38',
    //                     status: '已完成'
    //                 }
    //             ]
    //         }
    //     ]
    // },

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
