
module.exports = {

	appid: 'wxb8513f90eb982d36',
	secret: '22b86676f8b95037f0c85a496dc18222',
	host: 'https://snack.bugdeer.com',

	request: function(url, method, data, success, fail) {
		wx.request({
	        url: this.host + url, 
	        method: method,
	        data: data,
	        header: {
	        	'content-type': 'application/x-www-form-urlencoded',
	        	'X-Requested-Page': 'json'
	        },
	        success: success,
	        fail: fail
	    })
	},

	getOpenId: function(code, shopId, success, fail) {
		this.request('/wx/assistant/openid', 'post', {
			appid: this.appid,
			secret: this.secret,
			code: code,
			shopId: shopId
		}, success, fail);
	},

	getShopSales: function(shopId, success, fail) {
		this.request('/wx/assistant/statistics', 'post', {
			shopId: shopId
		}, success, fail);
	},

	getHistoryOrder: function(shopId, openId, payStatus, status, page, size, success, fail) {
		this.request('/wx/order/entire', 'post', {
			shopId: shopId,
			// openId: openId,  // 海滨同学留下的坑
			payStatus: payStatus,
			status: status,
			page: page,
			size: size
		}, success, fail);
	},

	postOrderAccept: function(shopId, openId, orderId, success, fail) {
		this.request('/wx/order/accept', 'post', {
			shopId: shopId,
			openId: openId,
			orderId: orderId
		}, success, fail);
	},

	postOrderReject: function(shopId, openId, orderId, success, fail) {
		this.request('/wx/order/reject', 'post', {
			shopId: shopId,
			openId: openId,
			orderId: orderId
		}, success, fail);
	}

	// getAllOrder: function(shopId, openId, payStatus, status, page, size, success, fail) {
	// 	this.request('/wx/order/entire', 'post', {
	// 		shopId: shopId,
	// 		// openId: openId,  // 海滨同学留下的坑
	// 		payStatus: payStatus,
	// 		status: status,
	// 		page: page,
	// 		size: size
	// 	}, success, fail);
	// },

	// getUserAddress: function(openId, success, fail) {
	// 	this.request('/wx/address/entire', 'post', {
	// 		openId: openId
	// 	}, success, fail);
	// },

	// getShopInfo: function(shopId, success, fail) {
	// 	this.request('/wx/shop/infor', 'post', {
	// 		shopId: shopId
	// 	}, success, fail);
	// },

	// getPromotion: function(shopId, success, fail) {
	// 	this.request('/wx/shop/promotion', 'post', {
	// 		shopId: shopId
	// 	}, success, fail);
	// },

	// getClassify: function(shopId, success, fail) {
	// 	this.request('/wx/category/products', 'post', {
	// 		shopId: shopId
	// 	}, success, fail);
	// },

	// getProduct: function(shopId, success, fail) {
	// 	this.request('/wx/product/entire', 'post', {
	// 		shopId: shopId
	// 	}, success, fail);
	// },

	// getComments: function(shopId, page, size, success, fail) {
	// 	this.request('/wx/comments/byshopid', 'post', {
	// 		shopId: shopId,
	// 		page: page,
	// 		size: size
	// 	}, success, fail);
	// },

	// postUserInfo: function(openId, shopId, nickname, headimage, success, fail) {
	// 	this.request('/wx/wechat/register', 'post', {
	// 		openId: openId,
	// 		shopId: shopId,
	// 		nickname: nickname,
	// 		headimage: headimage
	// 	}, success, fail);
	// },

	// postUserAddress: function(openId, shopId, id, contact, mobile, area, address, lat, lng, success, fail) {
	// 	var app = getApp();
	// 	if(id) {
	// 		this.request('/wx/address/merged', 'post', {
	// 			openId: openId,
	// 			shopId: shopId,
	// 			id: id,
	// 			contact: contact,
	// 			mobile:　mobile,
	// 			area: area,
	// 			address: address,
	// 			lat: lat,
	// 			lng: lng
	// 		}, success, fail);
	// 	}
	// 	else {
	// 		this.request('/wx/address/merged', 'post', {
	// 			openId: openId,
	// 			shopId: shopId,
	// 			contact: contact,
	// 			mobile:　mobile,
	// 			area: area,
	// 			address: address,
	// 			lat: lat,
	// 			lng: lng
	// 		}, success, fail);
	// 	}
	// },

	// postDefaultAddress: function(addressId, success, fail) {
	// 	this.request('/wx/address/default', 'post', {
	// 		addressId: addressId
	// 	}, success, fail);
	// },

	// postComments: function(shopId, openId, orderId, nickname, headimage, score, content, success, fail) {
	// 	this.request('/wx/comments/create', 'post', {
	// 		shopId: shopId,
	// 		openId: openId,
	// 		orderId: orderId,
	// 		nickname: nickname,
	// 		headimage: headimage,
	// 		score: score,
	// 		content: content
	// 	}, success, fail);
	// },

	// postOrder: function(shopId, openId, productIds, quantitys, addressId, success, fail) {
	// 	this.request('/wx/order/create', 'post', {
	// 		shopId: shopId,
	// 		openId: openId,
	// 		productIds: productIds,
	// 		quantitys: quantitys,
	// 		addressId: addressId
	// 	}, success, fail);
	// },

	// postPayment: function(shopId, openId, orderId, success, fail) {
	// 	this.request('/wx/order/payment', 'post', {
	// 		shopId: shopId,
	// 		openId: openId,
	// 		orderId: orderId
	// 	}, success, fail);
	// }
}
