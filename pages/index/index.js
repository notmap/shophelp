var app = getApp()
Page({

    data: {
        voicePrompt: {
            src: 'http://www.legaoshuo.com/asset/prompt.mp3'
        },
        income: {
            today: 3648.002,
            remain: 2536.00,
            withdraw: 10000.00,
            history: 12536.00,
            test: {
                name: 562.3655
            }
        },
        test: 354.125,
        order: {},
        dataCount: {}
    },

	onLoad: function (options) {
        this.voicePrompt.createAudioContext(this);
        this.setNewData(['income', 'today'], this.dataHandler.toFixed);
    },

    onShow: function (options) {
        // setTimeout(() => {
        //     this.voicePrompt.audioPlay(this);
        // }, 3000);
    },

    voicePrompt: {
        createAudioContext: function(page) {
            page.audioCtx = wx.createAudioContext('myAudio');
        },
        audioPlay: function (page) {
            page.audioCtx.play();
        }
    },

    setNewData: function(attrs, dataHandler) {
        attrs.reduce((pipeData, value, index) => {
            if(index == attrs.length - 1) pipeData[value] = dataHandler(pipeData[value]);
            else return pipeData[value];
        }, this.data);
        this.setData({
            [attrs[0]]: this.data[attrs[0]]
        });
    },

    dataHandler: {
        toFixed: function(data) {
            return data.toFixed(2);
        }
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
