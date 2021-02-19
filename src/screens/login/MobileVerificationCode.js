import React, { useRef, useState, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CodeInput from 'react-native-confirmation-code-input';
import CountDownTimer from '@/hooks/CountDownTimer';
import Toast from 'react-native-root-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TOAST_INITIAL_OPTIONS } from '@/constant/env';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

import AuthContext from '~/AuthContext'

/* 
短信验证码输入页面
*/
const MobileVerificationCode = (props) => {
	const { signIn, signUp } = useContext(AuthContext);

	const navigation = useNavigation();
	const route = useRoute();

	const refCodeInput = useRef();
	const refTimer = useRef();

	const [timerEnd, setTimerEnd] = useState(false);
	const [disableGetVerificationCodeBtn, setDisableGetVerificationCodeBtn] = useState(true);
	const [userMobile] = useState(route.params?.userMobile);

	// 获取注册登录验证码
	const [
		{ data: mobileVerificationCodeData, loading: mobileVerificationLoading, error: mobileVerificationError },
		getMobileVerificationCode,
	] = useAxios({ url: requestApi.getMobileVerificationCode + '/' + userMobile, method: 'GET' }, { manual: true });

	// 手机号码与验证码发送注册登录
	const [
		{
			data: checkMobileVerificationCodeData,
			loading: checkMobileVerificationLoading,
			error: checkMobileVerificationError,
		},
		postCheckMobileVerificationCode,
	] = useAxios({ url: requestApi.postCheckMobileVerificationCode, method: 'POST' }, { manual: true });

	const timeOverCallback = (timerFlag) => {
		setTimerEnd(timerFlag);
		// 时间结束以后，获取验证码按钮需要允许点击
		setDisableGetVerificationCodeBtn(false);
	};

	const _onFulfill = async (verificationCode) => {
		try {
			const {
				code,
				data: { isNewUser, token },
				message,
				ok,
			} = await postCheckMobileVerificationCode({
				data: {
					code: verificationCode.toString(),
					mobile: userMobile,
				},
			});
			if (isNewUser) {
				// 新用户，需要完善资料
				navigation.navigate('UserInfo', { userMobile, token });
			} else {
				// 老用户直接登录进入主界面
				await AsyncStorage.setItem('token', token);
				signIn({ token });
			}
		} catch (error) {
			refCodeInput.current.clear();
			setDisableGetVerificationCodeBtn(false);
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	const onGetMobileVerificationCode = async () => {
		setDisableGetVerificationCodeBtn(true);
		setTimerEnd(false);
		refTimer.current.resetTimer();

		try {
			let { code, data, message, ok } = await getMobileVerificationCode();
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* 判断 loading，显示 Spinner */}
			<Spinner
				animation='fade'
				visible={mobileVerificationLoading || checkMobileVerificationLoading}
				size='small'
			/>

			<View style={styles.loginContainer}>
				<Text style={styles.loginTitleText}>请输入6位验证码</Text>
				<Text style={styles.loginContentText}>已发到：{userMobile}</Text>
				<CodeInput
					ref={refCodeInput}
					codeLength={6}
					className={'border-b'}
					space={10}
					size={50}
					keyboardType='numeric'
					cellBorderWidth={5}
					inputPosition='center'
					onFulfill={_onFulfill}
					activeColor='black'
					inactiveColor='rgba(85,216,241,1)'
					codeInputStyle={{
						backgroundColor: 'transparent',
						fontSize: 30,
					}}
				/>
			</View>

			<View style={styles.loginContainer}>
				<TouchableOpacity
					style={[
						styles.loginBtnContainer,
						{ backgroundColor: !disableGetVerificationCodeBtn ? '#55d8f1' : '#d6d7d8' },
					]}
					onPress={onGetMobileVerificationCode}
					disabled={disableGetVerificationCodeBtn}
				>
					<Text style={styles.loginBtn}>重新获取</Text>
					<CountDownTimer
						timestamp={59}
						ref={refTimer}
						timerCallback={timeOverCallback}
						textStyle={{
							color: '#FFFFFF',
							letterSpacing: 0.5,
						}}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	loginContainer: {
		margin: 30,
		flexDirection: 'column',
	},
	// 登录标题
	loginTitleText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#3a3b3c',
		marginTop: 10,
	},
	loginContentText: {
		marginTop: 10,
	},
	// 登录按钮容器
	loginBtnContainer: {
		marginTop: 30,
		backgroundColor: '#d6d7d8',
		padding: 20,
		borderRadius: 30,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	// 登录按钮
	loginBtn: {
		color: '#fbfcfc',
	},
});

export default MobileVerificationCode;
