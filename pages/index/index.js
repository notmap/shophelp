var app = getApp();

Page({

	onLoad: function (options) {
    },

    onShow: function (options) {
    },

    jump: function(e) {
<<<<<<< HEAD

        // var data = JSON.stringify(e.currentTarget.dataset.jump);
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${data}/${data}`});
        // wx.setStorage({
        //     key: 'addressArr',
        //     data: this.data.rawAddressArr
        // });
=======
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${data}/${data}`});
>>>>>>> af2e04bb191faa2783aae03fecdb0147ff2b23af
    }
});
