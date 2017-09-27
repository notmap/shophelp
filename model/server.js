
module.exports = {

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
		this.request('/wx/wechat/openid', 'post', {
			code: code,
			shopId: shopId
		}, success, fail);
	},

	getUserAddress: function(openId, success, fail) {
		this.request('/wx/address/entire', 'post', {
			openId: openId
		}, success, fail);
	},

	getShopInfo: function(shopId, success, fail) {
		this.request('/wx/shop/infor', 'post', {
			shopId: shopId
		}, success, fail);
	},
	
	getHistoryOrder: function(shopId, openId, page, size, success, fail) {
		this.request('/wx/order/entire', 'post', {
			shopId: shopId,
			openId: openId,
			page: page,
			size: size
		}, success, fail);
	},

	getComments: function(shopId, page, size, success, fail) {
		this.request('/wx/comments/byshopid', 'post', {
			shopId: shopId,
			page: page,
			size: size
		}, success, fail);
	},

	postUserInfo: function(openId, shopId, nickname, headimage, success, fail) {
		this.request('/wx/wechat/register', 'post', {
			openId: openId,
			shopId: shopId,
			nickname: nickname,
			headimage: headimage
		}, success, fail);
	}
}
