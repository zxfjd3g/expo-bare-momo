import _ from 'lodash';

var initialState = { userInfo: {}, loading: false };


const user = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_LOADING':
			return { ...state, loading: action.payload };
		case 'GET_USER_INFO':
			return { ...state, userInfo: action.payload, loading: false };
		case 'UPDATE_USERINFO':
			let newData = _.cloneDeep(state);
			Object.keys(action.payload).forEach((key) => {
				newData.userInfo.userInfo[key] = action.payload[key];
			});
			return { ...state, ...newData, loading: false };
		default:
			return state;
	}
};

export default user;
