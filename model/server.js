
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
			// openId: openId,  // 某同学挖的坑 不知道搞定没
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
}
