const initialState = {
  priceList: {}, // 支付价格列表
  form: "", // 订单支付代码
  outTradeNo: "", // 支付订单号
  isPaySuccess: false, // 是否支付成功
};

const pay = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRICE_LIST_SUCCESS":
      return { ...state, priceList: action.payload };
    case "CREATE_ORDER_PAY_SUCCESS":
      return {
        ...state,
        form: action.payload.form,
        outTradeNo: action.payload.outTradeNo,
      };
    case "QUERY_PAY_STATUS_SUCCESS":
      return { ...state, isPaySuccess: action.payload };
    default:
      return state;
  }
};

export default pay;
