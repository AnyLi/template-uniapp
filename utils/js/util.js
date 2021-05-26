const formatTime = (date, hasNoS) => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	//123456
	var time = [hour, minute]
	// 是否包含秒
	if (!hasNoS) {
		time.push(second)
	}
	return [year, month, day].map(formatNumber).join('-') + ' ' + time.map(formatNumber).join(':')
}
const formatDate = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	//123456
	return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
const GetDateStr = function(AddDayCount, date, hasTime) {
	var dd = date ? new Date(date.replace(/\.|\-/g, '/')) : new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
	if (hasTime) {
		return formatTime(dd, true)
	} else {
		return formatDate(dd)
	}
}
const copy = function(obj) {
	var newobj = obj.constructor === Array ? [] : {};
	if (typeof obj !== 'object') {
		return;
	}
	for (var i in obj) {
		newobj[i] = typeof obj[i] === 'object' ? copy(obj[i]) : obj[i];
	}
	return newobj
}
// 函数节流
const throttle = function(fn, gapTime) {
	if (gapTime == null || gapTime == undefined) {
		gapTime = 1500
	}
	let _lastTime = null
	return function() {
		let _nowTime = +new Date()
		if (_nowTime - _lastTime > gapTime || !_lastTime) {
			// 将this和参数传给原函数
			fn.apply(this, arguments)
			_lastTime = _nowTime
		}
	}
}
// 下划线转字符串
const toHump = function(name) {
	return name.replace(/\_(\w)/g, function(all, letter) {
		return letter.toUpperCase();
	});
}
//--身份证号码验证-支持新的带x身份证
const isCardID = function(id) {
	// 1 "验证通过!", 0 //校验不通过
	var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
	//号码规则校验
	if (!format.test(id)) {
		return '身份证号码不合规'
	}
	//区位码校验
	//出生年月日校验   前正则限制起始年份为1900;
	var year = id.substr(6, 4), //身份证年
		month = id.substr(10, 2), //身份证月
		date = id.substr(12, 2), //身份证日
		time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
		now_time = Date.parse(new Date()), //当前时间戳
		dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
	if (time > now_time || date > dates) {
		return '出生日期不合规'
	}
	//校验码判断
	var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
	var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
	var id_array = id.split("");
	var sum = 0;
	for (var k = 0; k < 17; k++) {
		sum += parseInt(id_array[k]) * parseInt(c[k]);
	}
	if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
		return '身份证校验码不合规'
	}
	return true
}

const getUuid = function uuid() {

	var s = [];

	var hexDigits = "0123456789abcdef";

	for (var i = 0; i < 36; i++) {

		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);

	}

	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010

	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");

	return uuid;

}

var QQMapWX = require('./qqmap-wx-jssdk.js');
const reverseLocation = function(loc) {
	// 实例化API核心类
	var demo = new QQMapWX({
		key: '你的qqmap key' // 必填
	});
	// 调用接口
	demo.reverseGeocoder({
		location: {
			latitude: loc.latitude,
			longitude: loc.longitude
		},
		coord_type: 3, //baidu经纬度
		success: function(res) {
			var location = res.result.ad_info.location;
			console.log(location)
			var data = {
				latitude: location.lat,
				longitude: location.lng
			}
			return data
		}
	});

}
/**
 *腾讯地图转百度地图经纬度
 */
const qqMapTransBMap = function(item) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = item.longitude;
	let y = item.latitude;
	let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta) + 0.0065;
	let lats = z * Math.sin(theta) + 0.006;
	item.longitude = lngs;
	item.latitude = lats;
	return item
}

/*
 * 百度转腾讯
 */
const bMapTransqqMap = function(item) {
	let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = item.longitude - 0.0065;
	let y = item.latitude - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta);
	let lats = z * Math.sin(theta);
	item.longitude = lngs;
	item.latitude = lats;
	return item
}
module.exports = {
	formatTime,
	formatDate,
	GetDateStr,
	copy,
	throttle,
	toHump,
	isCardID,
	getUuid,
	reverseLocation,
	qqMapTransBMap,
	bMapTransqqMap,
}
