var app = getApp()
Page({
	onLoad: function (options) {
 
    },

    onShow: function (options) {
 
    },

    getAddress: function(addressArr) {
        return addressArr.map((val, index, arr) => {
            return {
                user: `${val.user} ${val.phone}`,
                address: `${val.area}${val.address}`,
                id: val.id,
                raw: val
            };
        });
    },

    setActive: function(e) {
        app.globalData.active = e.currentTarget.id;
        wx.navigateBack();
    },

    jump: function(e) {
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${data}/${data}`});
    }
});
