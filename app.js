var server = require('./model/server');
App({
    onLaunch: function() {
        this.getShopId();
    },

    getShopId: function() { 
        this.globalData.pShopId || (this.globalData.pShopId = new Promise((resolve, reject) => {
            if (wx.getExtConfig) {  // Appid==3rdMiniProgramAppid && extEnable==true
                wx.getExtConfig({
                    success: function(res) {
                        console.log(`shopId: ${res.extConfig.attr.shopId}`);
                        return resolve(res.extConfig.attr.shopId);
                    }
                });
            }
        }));
        return this.globalData.pShopId;
    },

    // getOpenId: function() {
    //     this.globalData.pOpenId || (this.globalData.pOpenId = Promise.all([this.getShopId()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             wx.login({
    //                 success: (res) => {  
    //                     console.log(`loginCode: ${res.code}`)
    //                     server.getOpenId(res.code, arr[0], (res) => {
    //                         console.log(`openId: ${res.data.openid}`);
    //                         return resolve(res.data.openid);
    //                     });
    //                 }
    //             });
    //         });
    //     }));
    //     return this.globalData.pOpenId;
    // },

    globalData: {}
})
