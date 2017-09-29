var pageModel;
var app = getApp()
Page({

    data: {
        voicePrompt: {
            src: 'http://www.legaoshuo.com/asset/prompt.mp3'
        },
        income: {
            today: 3648,
            remain: 2536,
            withdraw: 10000,
            history: 12536
        },
        order: {
            count: 3,
            today: 28,
            history: 256
        }
    },

	onLoad: function (options) {
        pageModel = this; 
        this.voicePrompt.createAudioContext(); 
        this.orderSocket.startUp();
        this.setNewData(['income', 'today'], this.dataHandler.toFixed);
    },

    onShow: function (options) {
        setTimeout(() => {
            pageModel.voicePrompt.audioPlay();
        }, 1000);
    },

    orderSocket: {

        socketOpen: false,
        socketMsgQueue: ['newOrder', 'newOrder', 'newOrder'],

        startUp: function() {
            // this.connect();
            // this.onOpen();
            this.onMessage();
            // this.onError();
            // this.onClose();
        },

        connect: function() {
            wx.connectSocket({
            url: 'https://snack.bugdeer.com',
            data: {
                x: '',
                y: ''
            },
            header: {
                'content-type': 'application/json'
            },
            protocols: ['protocol1'],
            method: "POST"
            });
        },

        sendMessage: function(msg) {
            if (this.socketOpen) {
                wx.sendSocketMessage({
                    data: msg
                })
            } 
            else this.socketMsgQueue.push(msg);
        },

        close: function() {
            wx.closeSocket(); // need promise
        },

        checkQueue: function() {
            console.log(this.socketMsgQueue.length);
            if(this.socketMsgQueue.length > 0) {
                this.socketMsgQueue.shift();
                return true;
            }
            else return false;
        },

        onOpen: function() {
            wx.onSocketOpen(function(res) {
                console.log('OK: WebSocket is connected');
                // this.socketOpen = true;
                // this.socketMsgQueue.forEach((value, index, arr) => {
                //     this.sendSocketMessage(value);
                // });
                // this.socketMsgQueue = [];
            });
        },

        onMessage: function() {

            wx.onSocketMessage((res) => {
                // console.log('message from server: ' + res.data)

                if(!pageModel.voicePrompt.voiceFlag) {
                    pageModel.voicePrompt.audioPlay();
                }
                else {
                    this.socketMsgQueue.push(res.data);
                }
            })
        },

        onError: function() {
            wx.onSocketError(function(res){
                console.log('ERR: WebSocket connection is failed')
            });
        },

        onClose: function() {
            wx.onSocketClose(function(res) {
                console.log('WebSocket is shutdown')
            })
        }
    },

    voicePrompt: {

        voiceFlag: false,

        createAudioContext: function() {
            pageModel.audioCtx = wx.createAudioContext('myAudio');
        },

        audioPlay: function () {
            this.voiceFlag = true;
            console.log('this is audioPlay');
            pageModel.audioCtx.play();
            setTimeout(() => {
                pageModel.orderSocket.checkQueue() ? this.audioPlay() : (this.voiceFlag = false);
            }, 5000);
        }
    },

    getData: {

        getSomeData: function() { 
            this.globalData.pShopId || (this.globalData.pShopId = new Promise((resolve, reject) => {
                // var self = this;
                // if (wx.getExtConfig) {  
                //     wx.getExtConfig({
                //         success: function(res) {
                //             console.log(`shopId: ${res.extConfig.attr.shopId}`);
                //             return resolve(res.extConfig.attr.shopId);
                //         }
                //     });
                // }
            }));
            return this.globalData.pShopId;
        },

        getSomeData: function(cb) {  
            this.globalData.pProduct || (this.globalData.pProduct = Promise.all([this.getShopId()]).then((arr) => {
                return new Promise((resolve, reject) => {
                    // var shopId  = arr[0];
                    // server.getProduct(shopId, (res) => {
                    //     var product = res.data.data;
                    //     arrtModify(product, {
                    //         fullImage: 'img',
                    //         boxcost: 'boxFee'
                    //     });
                    //     return resolve(product);
                    // });
                });
            }));
            // setTimeout(() => {
            //     console.log(this.globalData.pProduct)
            // }, 3000)
            return this.globalData.pProduct;
        }
    },

    dataHandler: {
        toFixed: function(data) {
            return data.toFixed(2);
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

    jump: function(e) {
        var data = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${data}/${data}`});
    }
});
