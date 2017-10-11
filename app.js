

const server = require('./model/server');
const dateFormat = require('./utils/dateFormat');
const arrtModify = require('./utils/arrtModify');

App({
    onLaunch: function() {

        // this.getShopId();
        this.getOpenId();  
        this.getShopSales();

        this.getNewOrder(1);
        this.getIngOrder(1);
        this.getOverOrder(1);
        this.getRejectOrder(1);

        // this.getShopInfo();
        // this.getProduct();
        // this.getClassify();
        // this.getUserInfo();
        // this.getUserAddress();
    },

    getShopId: function() { 
        this.globalData.pShopId || (this.globalData.pShopId = new Promise((resolve, reject) => {

            var timer = setInterval(() => {
                if(this.globalData.indexShopId) {
                    clearInterval(timer);
                    // console.log(this.globalData.indexShopId)
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
        // console.log(shopId, openId, payStatus, status, page, size);
        server.getHistoryOrder(shopId, openId, payStatus, status, page, size, (res) => {
            var historyOrder = res.data.data;
            // console.log(historyOrder);
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

    postOrderAccept: function(orderId, cb) {                       // 接受订单
        Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            var openId = arr[0],
                shopId = arr[1];
            server.postOrderAccept(shopId, openId, orderId, (res) => {
                cb && cb(res);
            });
        });
    },

    postOrderReject: function(orderId, cb) {                       // 接受订单
        Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            var openId = arr[0],
                shopId = arr[1];
            server.postOrderReject(shopId, openId, orderId, (res) => {
                cb && cb(res);
            });
        });
    },

    // postOrderAlloca: function(shopId, openId, orderId, success, fail) {       // 配送订单
    //     this.request('/wx/order/alloca', 'post', {
    //         shopId: shopId,
    //         openId: openId,
    //         orderId: orderId
    //     }, success, fail);
    // },

    // postOrderReject: function(shopId, openId, orderId, success, fail) {       // 商家拒单
    //     this.request('/wx/order/reject', 'post', {
    //         shopId: shopId,
    //         openId: openId,
    //         orderId: orderId
    //     }, success, fail);
    // },





    



    // getHistoryOrder: function(payStatus, status, page) {
    //     this.globalData.pHistoryOrder || (this.globalData.pHistoryOrder = Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             var openId = arr[0],
    //                 shopId = arr[1],
    //                 size = 10;

    //             server.getHistoryOrder(shopId, openId, payStatus, status, page, size, (res) => {
    //                 var historyOrder = res.data.data;
    //                 // console.log('historyOrder', historyOrder);
    //                 historyOrder.map((item, index, arr) => {
    //                     item.order = {
    //                         goods: item.orderProductList,
    //                         checkout: {
    //                             totalBoxcost: item.totalBoxcost,
    //                             totalDiscount: item.totalDiscount,
    //                             totalQuantity: item.totalQuantity,
    //                             totalAmount: item.realityAmount,
    //                             orderNumber: item.id
    //                         }
    //                     };
    //                 });
    //                 // console.log(historyOrder)
    //                 return resolve(historyOrder);
    //             });
    //         });
    //     }));
    //     return this.globalData.pHistoryOrder;
    // },

    // getUserInfo: function() {
    //     this.globalData.pUserInfo || (this.globalData.pUserInfo = new Promise((resolve, reject) => {
    //         wx.getUserInfo({
    //             success: (res) => {
    //                 // console.log(`userInfo: ${res.userInfo.nickName}`)
    //                 this.postUserInfo(res.userInfo);
    //                 return resolve(res.userInfo);
    //             }
    //         });
    //     }));
    //     return this.globalData.pUserInfo;
    // },

    // getUserAddress: function(cb) {
    //     this.globalData.pUserAddress || (this.globalData.pUserAddress = Promise.all([this.getOpenId()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             server.getUserAddress(arr[0], (res) => {
    //                 // console.log(`userAddress: ${res.data.items[0]}`)
    //                 var addressInfo = dataHandle(res.data.items);
    //                 return resolve(addressInfo);
    //             });
    //         });

    //         function dataHandle(data) {
    //             arrtModify(data, {contact: 'user', mobile: 'phone'});
    //             var active;
    //             data.map((item, index, arr) => {
    //                 if(item.defaults) active = item.id;
    //             });
    //             return {
    //                 addressArr: data, 
    //                 active: active
    //             };
    //         }
    //     }));
    //     return this.globalData.pUserAddress;
    // },

    // getShopInfo: function(cb) {   
    //     this.globalData.pShopInfo || (this.globalData.pShopInfo = Promise.all([this.getShopId()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             var shopId = arr[0];
    //             server.getShopInfo(shopId, (res) => {
    //                 var shopInfo = res.data.data;
    //                 // console.log('shopInfo', shopInfo);
    //                 arrtModify(shopInfo, {
    //                     fullCover: 'logo',
    //                     serviceTel: 'phone',
    //                     deliverType: 'express',
    //                     notice: 'welcome',
    //                     deliverFee: 'expressFee',
    //                     minAmount: 'minimum'
    //                 });
    //                 shopInfo.loaded = false;
    //                 shopInfo.express = shopInfo.express ? '蜂鸟配送' : '商家配送';
    //                 shopInfo.photo = [  
    //                     'http://www.legaoshuo.com/hexie/shop_photo/1.jpg',
    //                     'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
    //                     'http://www.legaoshuo.com/hexie/shop_photo/3.jpg',
    //                     'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
    //                     'http://www.legaoshuo.com/hexie/shop_photo/1.jpg'
    //                 ];

    //                 server.getPromotion(shopId, (res) => {
    //                     var promotion = res.data.data;
    //                     shopInfo.promotion = res.data.data;
    //                     return resolve(shopInfo);
    //                 });
    //             });
    //         });
    //     }));
    //     return this.globalData.pShopInfo;
    // },

    // getProduct: function(cb) {  
    //     this.globalData.pProduct || (this.globalData.pProduct = Promise.all([this.getShopId()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             var shopId  = arr[0];
    //             server.getProduct(shopId, (res) => {
    //                 var product = res.data.data;
    //                 arrtModify(product, {
    //                     fullImage: 'img',
    //                     boxcost: 'boxFee'
    //                 });
    //                 return resolve(product);
    //             });
    //         });
    //     }));
    //     return this.globalData.pProduct;
    // },

    // getClassify: function(cb) {   
    //     this.globalData.pClassify || (this.globalData.pClassify = Promise.all([this.getShopId(), this.getProduct()]).then((arr) => {
    //         return new Promise((resolve, reject) => {
    //             var shopId = arr[0],
    //                 allProduct = arr[1];
    //             server.getClassify(shopId, (res) => {
    //                 var classify = res.data.data;

    //                 arrtModify(classify, {
    //                     products: 'product'
    //                 });
    //                 classify.map((item, index, arr) => {
    //                     item.product = item.product.map((item, index, arr) => {
    //                         return item.id
    //                     });
    //                     item.id = 'c' + item.id;
    //                 });
    //                 converProductId(classify, allProduct);

    //                 // classify.map((item, index, arr) => {   // 临时的数据处理
    //                 //     item.product = item.product.slice(0,5);
    //                 // });

    //                 return resolve(classify);
    //             });

    //             function converProductId(classify, allProduct) {   // 转换产品ID到产品所在的组下标
    //                 classify.map((item, index, arr) => {
    //                     item.product = item.product.map((item2, index, arr) => {
    //                         allProduct.map((item3, index, arr) => {
    //                             if(item3.id == item2) item2 = index;
    //                         });
    //                         return item2;
    //                     });
    //                 });
    //             }
    //         });
    //     }));    
    //     return this.globalData.pClassify;
    // },

    // postUserInfo: function(userInfo) {
    //     Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
    //         var openId = arr[0],
    //             shopId = arr[1],
    //             nickname = userInfo.nickName,
    //             headimage = userInfo.avatarUrl;
    //         server.postUserInfo(openId, shopId, nickname, headimage, function(res){
    //             console.log(`postUserInfo: ${res.statusCode}`);
    //         });
    //     }); 
    // },

    // postComments: function(orderId, score, content, cb) { 
    //     Promise.all([this.getShopId(), this.getOpenId(), this.getUserInfo()]).then((arr) => {
    //         var shopId = arr[0],
    //             openId = arr[1],
    //             nickname = arr[2].nickName,
    //             headimage = arr[2].avatarUrl;
    //         server.postComments(shopId, openId, orderId, nickname, headimage, score, content, function(res){
    //             console.log('postComments', res);
    //             cb && cb(res);
    //         });  
    //     });  
    // },

    // postOrder: function(productIds, quantitys, addressId, cb) { // productIds=>'29,30' quantitys=>'2,5'
    //     Promise.all([this.getShopId(), this.getOpenId()]).then((arr) => {
    //         var shopId = arr[0],
    //             openId = arr[1];
    //         server.postOrder(shopId, openId, productIds, quantitys, addressId, function(res){
    //             cb && cb(res);
    //         });
    //     }); 
    // },

    // postPayment: function(orderId, cb) {  
    //     Promise.all([this.getShopId(), this.getOpenId()]).then((arr) => {
    //         var shopId = arr[0],
    //             openId = arr[1];
    //         server.postPayment(shopId, openId, orderId, function(res){
    //             cb && cb(res);
    //         });
    //     }); 
    // },

    dataHandle: {
        productSection: {  // 商品区的高度  单位是rpx
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