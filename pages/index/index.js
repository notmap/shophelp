var pageModel;
var app = getApp()
Page({

    data: {
        voicePrompt: {
            src: 'http://www.legaoshuo.com/asset/prompt.mp3'
        },
        income: {
            day: 0,
            month: 0,
            year: 0
        },
        order: {
            new: 0,
            day: 0,
            month: 0,
            year: 0
        }
    },

	onLoad: function (options) {

        pageModel = this; 

        pageModel.voicePrompt.createAudioContext(); 
        pageModel.orderSocket.startUp();

        pageModel.getData.getShopSales();
        pageModel.getData.getNewOrder();

        this.setNewData(['income', 'day'], this.dataHandler.toFixed);
        this.setNewData(['income', 'month'], this.dataHandler.toFixed);
        this.setNewData(['income', 'year'], this.dataHandler.toFixed);
    },

    onShow: function (options) {
        // setTimeout(() => {
        //     pageModel.voicePrompt.audioPlay();
        // }, 1000);
    },

    orderSocket: {
        socketOpen: false,
        socketMsgQueue: [],

        startUp: function() {
            this.connect();
            this.onOpen();
            this.onMessage();
            this.onError();
            this.onClose();
        },

        connect: function() {
            wx.connectSocket({
                url: 'wss://snack.bugdeer.com/channel/notify/100011',
                header: {
                    'content-type': 'application/json'
                },
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
            // console.log(this.socketMsgQueue.length);
            if(this.socketMsgQueue.length > 0) {
                this.socketMsgQueue.shift();
                return true;
            }
            else return false;
        },

        onOpen: function() {
            wx.onSocketOpen((res) => {
                console.log('WebSocket: connect');
            });
        },

        onMessage: function() {
            wx.onSocketMessage((res) => {

                delete app.globalData.pNewOrder;
                pageModel.getData.getNewOrder();

                console.log('message from server: ' + res.data)
                if(!pageModel.voicePrompt.voiceFlag) {
                    pageModel.voicePrompt.audioPlay();
                }
                else {
                    this.socketMsgQueue.push(res.data);
                }
            })
        },

        onError: function() {
            wx.onSocketError((res) => {
                console.log('ERR: WebSocket connection is failed')
            });
        },

        onClose: function() {
            wx.onSocketClose((res) => {
                console.log('WebSocket: shutdown');
                this.startUp();
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
            pageModel.audioCtx.play();
            setTimeout(() => {
                pageModel.orderSocket.checkQueue() ? this.audioPlay() : (this.voiceFlag = false);
            }, 5000);
        }
    },

    getData: {

        getShopSales: function() { 
            app.getShopSales().then((shopSales) => {
                pageModel.setData({
                    income: shopSales
                });
            });
        },

        getNewOrder: function() {  
            app.getNewOrder(1).then((newOrder) => {
                pageModel.data.order.new = newOrder.length;
                pageModel.setData({
                    order: pageModel.data.order
                });
            });
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
