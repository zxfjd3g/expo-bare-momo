var initialState = { income: [], industry: [], marriage: [], loading: false };

const dict = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOW_LOADING':
			return { ...state, loading: action.payload };
		case 'GET_DICT_INCOME_DATA':
			return { ...state, income: action.payload };
		case 'GET_DICT_MARRIAGE_DATA':
			return { ...state, marriage: action.payload };
		case 'GET_DICT_INDUSTRY_DATA':
			return { ...state, industry: action.payload };
		default:
			return state;
	}
};

export default dict;
