var app = getApp();

Page({

	onLoad: function (options) {
    },

    onShow: function (options) {
    },

    jump: function(e) {
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${data}/${data}`});
    }
});
