import useAxios, { configure } from 'axios-hooks';
import Axios from 'axios';
import { REQUEST_BASE_URL } from '@/constant/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axios = Axios.create({
	timeout: 120 * 1000,
});

axios.interceptors.request.use(
	async function (config) {
		const token = await AsyncStorage.getItem('token');
		config.headers.token = token ? token : '';
		// 如果请求地址不以http://或者https://开头，那么则以默认设置的 REQUEST_BASE_URL 为基础路径，否则以用户设置路径为请求地址
		if (!(config.url.indexOf('http://') !== -1 || config.url.indexOf('https://') !== -1)) {
			config.baseURL = REQUEST_BASE_URL;
		}

		// config.headers['Content-Type'] = 'application/json;charset=utf-8'

		console.log('request.js ', config.baseURL, config.url);

		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		// 判断请求的是否是自己平台的接口地址，如果不是，直接返回数据
		if (response.request.responseURL.indexOf(REQUEST_BASE_URL) === -1) {
			return response.data;
		} else {
			if (response.status === 200) {
				if (!response.data.ok) {
					/*
				! TODO token为期 code 码为208，需要做单独判断处理
				*/
					return Promise.reject(response.data.message || '未知错误');
				}
				return response.data;
			} else {
				return Promise.reject(response.data.message || '未知错误');
			}
		}
	},
	function (error) {
		if (error && error.response) {
			switch (error.response.status) {
				case 400:
					error.message = '错误请求';
					break;
				case 401:
					error.message = '未授权，请重新登录';
					break;
				case 403:
					error.message = '拒绝访问';
					break;
				case 404:
					error.message = '请求错误，未找到该资源';
					break;
				case 405:
					error.message = '请求方法未允许';
					break;
				case 408:
					error.message = '请求超时';
					break;
				case 500:
					error.message = '服务器端出错';
					break;
				case 501:
					error.message = '网络未实现';
					break;
				case 502:
					error.message = '网络错误';
					break;
				case 503:
					error.message = '服务不可用';
					break;
				case 504:
					error.message = '网络超时';
					break;
				case 505:
					error.message = 'http版本不支持该请求';
					break;
				default:
					error.message = `连接错误${error.response.status}`;
			}
		} else {
			error.message = '连接服务器失败';
		}

		return Promise.reject(error.message);
	}
);

configure({ axios, cache: false });

export { axios };
export default useAxios;
