

const deepClone = require('../../utils/deepClone');
const dateFormat = require('../../utils/dateFormat');
// const server = require('../../utils/server');

var app = getApp();
Page({

	onLoad: function (option) {

        // console.log(JSON.parse(option.order))

        var order = JSON.parse(option.order);
        order.createTime = `${dateFormat.getDate(order.createTime)} ${dateFormat.getTime(order.createTime)}`;

        this.setData({
            order: order
        });
	},

    onShow: function(option) {
    }
});
