
const dateFormat = require('../../utils/dateFormat');

var app = getApp();
Page({

	onLoad: function (option) {
        var order = JSON.parse(option.order);
        order.createTime = `${dateFormat.getDate(order.createTime)} ${dateFormat.getTime(order.createTime)}`;

        this.setData({
            order: order
        });
	},

    onShow: function(option) {
    }
});
