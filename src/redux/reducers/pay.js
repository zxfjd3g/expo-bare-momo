const initialState = {
  priceList: {}, // 支付价格列表
};

const pay = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRICE_LIST_SUCCESS":
      return { ...state, priceList: action.payload };
    default:
      return state;
  }
};

export default pay;
