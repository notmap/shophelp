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
            history: 12536.00
        },
        order: {},
        dataCount: {}
    },

	onLoad: function (options) {
        this.voicePrompt.createAudioContext(this);
        this.getFixed(this.data.income.today);



        var a = {
            name: 'shanjiu',
            getName: function() {
                console.log(this)
            },

            b: {
                name: 'xiaobu'
            }
        }

        var b = {
            name: 'xiaobu'
        }

        a.getName.call(b);







    },

    onShow: function (options) {
        setTimeout(() => {
            this.voicePrompt.audioPlay(this);
        }, 3000);
    },

    voicePrompt: {
        createAudioContext: function(page) {
            page.audioCtx = wx.createAudioContext('myAudio');
        },
        audioPlay: function (page) {
            page.audioCtx.play();
        }
    },

    getFixed: function(num) {
        num = num.toFixed(2);
        console.log(num)
        // console.log(this.audioPlay)
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
