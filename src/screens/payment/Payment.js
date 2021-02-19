import React from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const Payment = (props) => {
	const openAlipay = () => {
		Linking.openURL(
			`alipays://platformapi/startapp?appId=20000067&url=http://shejiao.free.idcfengye.com/api/payment/alipay/submit/1`
		).catch((er) => {});
	};

	const closeAlipay = () => {};

	return (
		<SafeAreaView style={styles.container}>
			<WebView
				source={{
					uri: 'http://192.168.155.3:5000/payment.html',
				}}
				onMessage={(event) => {
					if (event.nativeEvent.data === 'openAlipay') {
						openAlipay();
					}
				}}
			/>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1 },
});
export default Payment;
