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
import { connect } from "react-redux";

const PayResult = ({ isPaySuccess }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{isPaySuccess ? "支付成功~~~~~" : "支付失败~~~~~"}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
  return {
    isPaySuccess: state.pay.isPaySuccess,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PayResult);
