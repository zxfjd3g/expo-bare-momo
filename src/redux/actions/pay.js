import { axios } from "@/api/request";
import requestApi from "@/api/requestApi";

const getPriceListSuccess = (payload) => {
  return {
    type: "GET_PRICE_LIST_SUCCESS",
    payload,
  };
};

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
