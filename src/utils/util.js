import React, { useState, useEffect } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';

import areaData from '@/components/AreaPicker/areaHelper.json';

export const getAstro = (month, day) => {
	var s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
	return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
};

// 经纬度坐标转换操作

//定义一些常量
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 */
export const bd09togcj02 = (bd_lon, bd_lat) => {
	var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return [gg_lng, gg_lat];
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 */
export const gcj02tobd09 = (lng, lat) => {
	var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
	var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	var bd_lng = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lng, bd_lat];
};

/**
 * WGS84转GCj02
 */
export const wgs84togcj02 = (lng, lat) => {
	if (out_of_china(lng, lat)) {
		return [lng, lat];
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = (lat / 180.0) * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
		dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return [mglng, mglat];
	}
};

/**
 * GCJ02 转换为 WGS84
 */
export const gcj02towgs84 = (lng, lat) => {
	if (out_of_china(lng, lat)) {
		return [lng, lat];
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = (lat / 180.0) * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
		dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
		mglat = lat + dlat;
		mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat];
	}
};

export const transformlat = (lng, lat) => {
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
	return ret;
};

export const transformlng = (lng, lat) => {
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
	return ret;
};

/**
 * 判断是否在国内，不在国内则不做偏移
 */
export const out_of_china = (lng, lat) => {
	return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
};

export const wgs84tobd09 = (lng, lat) => {
	return gcj02tobd09(...wgs84togcj02(lng, lat));
};

export const getMapAddressUrl = (longitude, latitude) => {
	return `http://api.map.baidu.com/geocoder?location=${latitude},${longitude}&output=json&key=1FRohQ2W2TH9XGvEHmuckB6G`;
};

export const getMapNearbyAddressUrl = (longitude, latitude) => {
	return `https://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&pois=1&ak=1FRohQ2W2TH9XGvEHmuckB6G`;
};

export const dyamicFormData = (formData) => {
	let data = {};
	Object.keys(formData).forEach((key) => {
		data = {
			...data,
			[key]: formData[key],
		};
	});

	return data;
};

export const getLocationName = async (province, city, area) => {
	if (province && city && area) {
		const provinceData = await areaData.find((item) => item.id === province);
		const provinceName = await provinceData.name;
		const cityData = await provinceData.city.find((item) => item.id === city);
		const cityName = await cityData.name;
		const areaName = await cityData.area.find((item) => item.id === area).name;
		return provinceName + ' ' + cityName + ' ' + areaName;
	} else {
		return '';
	}
};

const STATUSBAR_DEFAULT_HEIGHT = 20;
const STATUSBAR_X_HEIGHT = 44;
const STATUSBAR_IP12_HEIGHT = 47;
const STATUSBAR_IP12MAX_HEIGHT = 47;

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const IP12_WIDTH = 390;
const IP12_HEIGHT = 844;

const IP12MAX_WIDTH = 428;
const IP12MAX_HEIGHT = 926;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let statusBarHeight = STATUSBAR_DEFAULT_HEIGHT;
let isIPhoneX_v = false;
let isIPhoneXMax_v = false;
let isIPhone12_v = false;
let isIPhone12Max_v = false;
let isIPhoneWithMonobrow_v = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
	if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
		isIPhoneWithMonobrow_v = true;
		isIPhoneX_v = true;
		statusBarHeight = STATUSBAR_X_HEIGHT;
	} else if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
		isIPhoneWithMonobrow_v = true;
		isIPhoneXMax_v = true;
		statusBarHeight = STATUSBAR_X_HEIGHT;
	} else if (W_WIDTH === IP12_WIDTH && W_HEIGHT === IP12_HEIGHT) {
		isIPhoneWithMonobrow_v = true;
		isIPhone12_v = true;
		statusBarHeight = STATUSBAR_IP12_HEIGHT;
	} else if (W_WIDTH === IP12MAX_WIDTH && W_HEIGHT === IP12MAX_HEIGHT) {
		isIPhoneWithMonobrow_v = true;
		isIPhone12Max_v = true;
		statusBarHeight = STATUSBAR_IP12MAX_HEIGHT;
	}
}

export const isIPhoneX = () => isIPhoneX_v;
export const isIPhoneXMax = () => isIPhoneXMax_v;
export const isIPhone12 = () => isIPhone12_v;
export const isIPhone12Max = () => isIPhone12Max_v;
export const isIPhoneWithMonobrow = () => isIPhoneWithMonobrow_v;

const getExpoRoot = () => global.Expo || global.__expo || global.__exponent;

export const isExpo = () => getExpoRoot() !== undefined;

export function getStatusBarHeight(skipAndroid) {
	return Platform.select({
		ios: statusBarHeight,
		android: skipAndroid ? 0 : StatusBar.currentHeight,
		default: 0,
	});
}
