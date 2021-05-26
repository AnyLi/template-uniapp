export function request(url, data = {}, method = 'POST') {
	const app = getApp();
	uni.showLoading({
		title: '加载中'
	});
	var promise = new Promise((resolve, reject) => {
		//init
		const that = this;
		data.token = app.globalData.token;
		var baseUrl = ''
		// 代理
		if (url.indexOf('http') == -1) {
				baseUrl = '/api/'
		}
		//网络请求
		uni.request({
			url: baseUrl + url,
			data,
			method,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			success: function(res) { //服务器返回数据
				if (res.statusCode != 200) {
					reject({
						error: '服务器忙，请稍后重试',
						code: 500
					});
					return;
				}
				resolve(res.data);
			},
			error: function(e) {
				reject('网络出错');

			},
			complete: function() {
				uni.hideLoading();
			}
		})
	});
	return promise;
}
