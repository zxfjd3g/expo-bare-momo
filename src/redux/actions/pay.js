import { axios } from "@/api/request";
import requestApi from "@/api/requestApi";

// 获取价格列表
export function getPriceList() {
  return async (dispatch) => {
    try {
      let { code, data, message, ok } = await axios({
        url: requestApi.getPriceList,
      });
      dispatch(getPriceListSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };
}

const getPriceListSuccess = (payload) => {
  return {
    type: "GET_PRICE_LIST_SUCCESS",
    payload,
  };
};

// 创建支付宝订单支付
export function createOrderPay(buyType) {
  return async (dispatch) => {
    try {
      let { code, data, message, ok } = await axios({
        url: `${requestApi.createOrderPay}/${buyType}`,
      });
      dispatch(createOrderPaySuccess(data));
    } catch (error) {
      console.log(error);
    }
  };
}

const createOrderPaySuccess = (payload) => {
  return {
    type: "CREATE_ORDER_PAY_SUCCESS",
    payload,
  };
};

// 查询支付宝订单支付状态
export function queryPayStatus(outTradeNo) {
  return async (dispatch) => {
    try {
      let { code, data, message, ok } = await axios({
        url: `${requestApi.queryPayStatus}/${outTradeNo}`,
      });
      dispatch(queryPayStatusSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };
}

const queryPayStatusSuccess = (payload) => {
  return {
    type: "QUERY_PAY_STATUS_SUCCESS",
    payload,
  };
};
