import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { queryPayStatus } from "@/redux/actions";
import { WebView } from "react-native-webview";

const Pay = ({ form, isPaySuccess, outTradeNo }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setInterval(async () => {
      console.log(isPaySuccess);
      await queryPayStatus(outTradeNo);
      if (isPaySuccess) {
        clearInterval(timer);
        alert("支付成功");
        // navigation.push("PayResult", { index: 5 });
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ html: form }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
  return {
    form: state.pay.form,
    isPaySuccess: state.pay.isPaySuccess,
    outTradeNo: state.pay.outTradeNo,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
