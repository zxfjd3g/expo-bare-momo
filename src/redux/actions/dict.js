import { axios } from '@/api/request';
import requestApi from '@/api/requestApi';

export const _showLoading = (payload) => {
	return {
		type: 'SHOW_LOADING',
		payload,
	};
};

// 收入
export const _getDictIncomeData = (payload) => {
	return {
		type: 'GET_DICT_INCOME_DATA',
		payload,
	};
};

export function getDictIncome() {
	return async (dispatch) => {
		try {
			let { code, data, message, ok } = await axios({ url: requestApi.getDictIncome });
			dispatch(_getDictIncomeData(data));
		} catch (error) {
			console.log(error);
		}
	};
}

// 婚姻

export const _getDictMarriageData = (payload) => {
	return {
		type: 'GET_DICT_MARRIAGE_DATA',
		payload,
	};
};

export function getDictMarriage() {
	return async (dispatch) => {
		try {
			let { code, data, message, ok } = await axios({ url: requestApi.getDictMarriage });
			dispatch(_getDictMarriageData(data));
		} catch (error) {
			console.log(error);
		}
	};
}

// 行业
export const _getDictIndustryData = (payload) => {
	return {
		type: 'GET_DICT_INDUSTRY_DATA',
		payload,
	};
};

export function getDictIndustry() {
	return async (dispatch) => {
		try {
			let { code, data, message, ok } = await axios({ url: requestApi.getDictIndustry });
			dispatch(_getDictIndustryData(data));
		} catch (error) {
			console.log(error);
		}
	};
}
