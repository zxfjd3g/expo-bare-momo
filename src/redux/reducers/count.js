var initialState = { count: 0 };

const cart = (state = initialState, action) => {
	switch (action.type) {
		case 'INCREASE_COUNT':
			return { ...state, count: state.count + 1 };
		default:
			return state;
	}
};

export default cart;
