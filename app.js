
const server = require('./model/server');

App({
    onLaunch: function() {
        this.getOpenId();  
        this.getShopSales();
        this.getNewOrder(1);
        this.getIngOrder(1);
        this.getOverOrder(1);
        this.getRejectOrder(1);
    },

    getShopId: function() { 
        this.globalData.pShopId || (this.globalData.pShopId = new Promise((resolve, reject) => {
            var timer = setInterval(() => {
                if(this.globalData.indexShopId) {
                    clearInterval(timer);
                    console.log(this.globalData.indexShopId)
                    return resolve(this.globalData.indexShopId);
                }
            }, 50);
        }));
        return this.globalData.pShopId;
    },

    getOpenId: function() {
        this.globalData.pOpenId || (this.globalData.pOpenId = Promise.all([this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                wx.login({
                    success: (res) => {  
                        console.log(`loginCode: ${res.code}`)
                        server.getOpenId(res.code, arr[0], (res) => {
                            console.log(`openId: ${res.data.openid}`);
                            return resolve(res.data.openid);
                        });
                    }
                });
            });
        }));
        return this.globalData.pOpenId;        
    },

    getShopSales: function() {
        this.globalData.pShopSales || (this.globalData.pShopSales = Promise.all([this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                server.getShopSales(arr[0], (res) => {
                    var shopSales = res.data;
                    return resolve(shopSales);
                });
            });
        }));
        return this.globalData.pShopSales;
    },

    getNewOrder: function(page) {
        this.globalData.pNewOrder || (this.globalData.pNewOrder = Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                var openId = arr[0],
                    shopId = arr[1],
                    payStatus = 2,
                    status = 10,
                    size = 10;
                this.getHistoryOrder(shopId, openId, payStatus, status, page, size, function(newOrder) {
                    console.log('newOrder', newOrder);
                    return resolve(newOrder);
                })
            });
        }));
        return this.globalData.pNewOrder;
    },

    getIngOrder: function(page) {
        this.globalData.pIngOrder || (this.globalData.pIngOrder = Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                var openId = arr[0],
                    shopId = arr[1],
                    payStatus = 2,
                    status = 20,
                    size = 10;
                this.getHistoryOrder(shopId, openId, payStatus, status, page, size, function(ingOrder) {
                    console.log('ingOrder', ingOrder);
                    return resolve(ingOrder);
                })
            });
        }));
        return this.globalData.pIngOrder;
    },

    getOverOrder: function(page) {
        this.globalData.pOverOrder || (this.globalData.pOverOrder = Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                var openId = arr[0],
                    shopId = arr[1],
                    payStatus = 2,
                    status = 40,
                    size = 10;
                this.getHistoryOrder(shopId, openId, payStatus, status, page, size, function(overOrder) {
                    console.log('overOrder', overOrder);
                    return resolve(overOrder);
                })
            });
        }));
        return this.globalData.pOverOrder;
    },

    getRejectOrder: function(page) {
        this.globalData.pRejectOrder || (this.globalData.pRejectOrder = Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            return new Promise((resolve, reject) => {
                var openId = arr[0],
                    shopId = arr[1],
                    payStatus = 2,
                    status = 42,
                    size = 10;
                this.getHistoryOrder(shopId, openId, payStatus, status, page, size, function(rejectOrder) {
                    console.log('rejectOrder', rejectOrder);
                    return resolve(rejectOrder);
                })
            });
        }));
        return this.globalData.pRejectOrder;
    },

    getHistoryOrder: function(shopId, openId, payStatus, status, page, size, cb) {
        server.getHistoryOrder(shopId, openId, payStatus, status, page, size, (res) => {
            var historyOrder = res.data.data;
            historyOrder.map((item, index, arr) => {
                item.order = {
                    goods: item.orderProductList,
                    checkout: {
                        totalBoxcost: item.totalBoxcost,
                        totalDiscount: item.totalDiscount,
                        totalQuantity: item.totalQuantity,
                        totalAmount: item.realityAmount,
                        orderNumber: item.id
                    }
                };
            });
            cb(historyOrder);
        });
    },

    postOrderAccept: function(orderId, cb) {                     
        Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            var openId = arr[0],
                shopId = arr[1];
            server.postOrderAccept(shopId, openId, orderId, (res) => {
                cb && cb(res);
            });
        });
    },

    postOrderReject: function(orderId, cb) {                
        Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            var openId = arr[0],
                shopId = arr[1];
            server.postOrderReject(shopId, openId, orderId, (res) => {
                console.log(res)
                cb && cb(res);
            });
        });
    },

    dataHandle: {
        productSection: {  // 商品区的高度 单位是rpx
            classify: 74,
            unit: 152,
            padding: 16,
            border: 2
        },

        orderStatus: [
            {status: '等待接单', code: 10, button: '查看订单', data: 'order.goScore'},
            {status: '已接单', code: 20, button: '查看订单', data: 'order.goExpress'},
            {status: '配送中', code: 30, button: '查看订单', data: 'order.goExpress'},
            {status: '订单已完成', code: 40, button: '评价一下', data: 'order.goScore'},
            {status: '用户已取消', code: 41, button: false, data: false},
            {status: '已退款', code: 42, button: '查看退款', data: 'order.goRefund'},
            {status: '商家拒单', code: 43, button: false, data: false}
        ],

        commentDataHandle: function(commentData) {
            return commentData.map((value, index, arr) => {
                value.score = scoreShow.calcScore(value.score);
                return value;
            });
        },

        historyDataHandle: function(historyData) {
            var self = this;
            function converOrderStatus(order) {
                order.map((item, index, arr) => {
                    self.orderStatus.map((item2, index, arr) => {
                        item.status == item2.code && (item.status = index); 
                    });
                });
            }
            converOrderStatus(historyData);
            return historyData.map((item, index, arr) => {
                item.order.goods.length > 3 ? item.fold = true : item.fold = false;
                item.button = this.orderStatus[item.status].button;
                item.data = this.orderStatus[item.status].data;
                item.status = this.orderStatus[item.status].status;
                return item;
            });
        },

        classifyDataHandle: function(classifyData) {
            var height = this.productSection,
                heightArr = [];
            classifyData.reduce(function(returnVal, val, index, arr) {
                heightArr.push({
                    id: val.id,
                    sectionTop: returnVal
                });
                var sectionHeight = val.product.length * height.unit + height.classify + height.padding + height.border; 
                return returnVal + sectionHeight;
            }, 0);
            return heightArr;
        }
    },

    globalData: {}
})

//  0 生成订单
//  1 生成支付
//  2 完成支付
//  3 完成退款

// 10 未接订单
// 20 已接订单
// 30 配送订单
// 40 完成订单
// 41 用户撤单
// 42 商家撤单
// 43 完成退款