import { axios } from '@/api/request';
import requestApi from '@/api/requestApi';
import { dyamicFormData } from '@/utils/util';

export const _showLoading = (payload) => {
	return {
		type: 'SHOW_LOADING',
		payload,
	};
};

export const _getUserInfoData = (payload) => {
	return {
		type: 'GET_USER_INFO',
		payload,
	};
};

export const _updateUserInfo = (payload) => {
	return {
		type: 'UPDATE_USERINFO',
		payload,
	};
};


export function getUserInfo() {
	return async (dispatch) => {
		try {
			let { code, data, message, ok } = await axios({ url: requestApi.getUserShow });
			console.log('---user action getUserInfo', data)
			dispatch(_getUserInfoData(data));

		} catch (error) {
			console.log(error);
		}
	};
}

export function updateUserInfo(userInfoData) {
	return async (dispatch) => {
		try {
			const data = await dyamicFormData(userInfoData);
			await dispatch(_showLoading(true));
			let { code, message, ok } = await axios({
				url: requestApi.postUpdateUserInfo,
				method: 'POST',
				data,
			});
			await dispatch(_updateUserInfo(data));
			await dispatch(_showLoading(false));
		} catch (error) {
			console.log(error);
		}
	};
}
