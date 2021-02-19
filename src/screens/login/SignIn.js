import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import validator from 'validator';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { getUserInfo } from '@/redux/actions';
import Divider from '@/components/Divider';

import { TOAST_INITIAL_OPTIONS } from '@/constant/env';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

import AuthContext from '~/AuthContext'

const SignIn = (props) => {
	const { signIn } = useContext(AuthContext);
	/*
	------------------------------------------------------------
	 * 变量方法初始化
	------------------------------------------------------------
	 */
	const navigation = useNavigation();

	// 国家区号
	const [callingCode, setCallingCode] = useState('+86');
	// 登录模式，用户名密码登录或者手机号注册登录
	const [loginMode, setLoginMode] = useState('userNameAndPassword');
	// 用户名称
	const [userName, setUserName] = useState('13819971001');
	// 用户密码
	const [password, setPassword] = useState('111111');
	// 国家编号
	const [countryCode, setCountryCode] = useState('CN');
	// 是否显示用户名密码登录模式的国家选择
	const [showCountry, setShowCountry] = useState(false);
	// 设置密码显示模式
	const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
	// 禁用用户名密码登录按钮
	const [disableLoginBtn, setDisableLoginBtn] = useState(true);
	// 是否显示手机号注册登录模式的国家选择
	const [showMobileCountry, setShowMobileCountry] = useState(false);
	// 用户手机号码
	const [userMobile, setUserMobile] = useState('13819971001');
	// 禁用手机号注册登录按钮
	const [disableLoginMobileBtn, setDisableLoginMobileBtn] = useState(false);

	// redux数据与方法的获取
	const { getUserInfo } = props;

	/*
	------------------------------------------------------------
	 * 数据请求初始化
	------------------------------------------------------------
	 */
	// 检测用户登录
	const [
		{ loading: checkUserLoginLoading },
		postLogin,
	] = useAxios({ url: requestApi.postLogin, method: 'POST' }, { manual: true });

	// 获取注册登录验证码
	const [
		{ data: mobileVerificationCodeData, loading: mobileVerificationLoading, error: mobileVerificationError },
		getMobileVerificationCode,
	] = useAxios({ url: requestApi.getMobileVerificationCode + '/' + userMobile, method: 'GET' }, { manual: true });

	/*
	------------------------------------------------------------
	 * 用户名密码登录模式
	------------------------------------------------------------
	 */

	// 检查区号的合法性
	const _checkCallingCode = (country) => {
		let callingCode = '';
		if (country.callingCode[0]) {
			callingCode = '+' + country.callingCode[0];
		} else {
			callingCode = '';
		}
		return callingCode;
	};

	// 切换密码是否显示
	const togglePasswordSecureTextEntry = () => {
		setPasswordSecureTextEntry(!passwordSecureTextEntry);
	};

	// 密码登录时的国家区号选择
	const onCountrySelect = (country) => {
		const callingCode = _checkCallingCode(country);
		setUserName(callingCode);
	};

	// 修改用户名称
	const onChangeUserName = (text) => {
		setUserName(text);
	};

	// 修改密码
	const onChangePassword = (text) => {
		setPassword(text);
	};

	// 提交登录
	const onLoginSubmit = async () => {
		try {
			const {
				code,
				data: { isNewUser, token },
				message,
				ok,
			} = await postLogin({
				data: {
					mobile: userName,
					password,
				},
			});
			console.log('login', code, token)
			if (code === 200) {
				// 登录成功以后设置Token，利用redux存储用户信息，再进行SignIn处理
				await AsyncStorage.setItem('token', token);
				signIn({ token });
				await getUserInfo();
				
			}
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	// 确认登录按钮是否可用
	useEffect(() => {
		// 验证用户名以及密码
		// 用户名可以是邮箱，可以是数字（6-11）位，可以是手机号
		const checkUserName = validator.isNumeric(userName)
			? validator.isLength(userName, { min: 6, max: 11 }) &&
			  (validator.isMobilePhone(userName, 'zh-CN') || validator.isNumeric(userName))
			: validator.isEmail(userName);

		// 密码为数字与字符，6-12位
		const checkPassword = validator.matches(password, /^[\w]{6,12}$/i);

		if (checkUserName && checkPassword) {
			setDisableLoginBtn(false);
		} else {
			setDisableLoginBtn(true);
		}
	}, [userName, password]);

	/*
	------------------------------------------------------------
	 * 手机号登录注册模式
	------------------------------------------------------------
	 */

	// 切换登录模式
	const switchLoginMode = (type) => {
		setLoginMode(type);
	};

	// 获取验证码
	const onGetMobileVerificationCode = async () => {
		try {
			const { code, data, message, ok } = await getMobileVerificationCode();
			if (code === 200) {
				navigation.navigate('MobileVerificationCode', { userMobile });
			}
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	// 修改用户手机号码
	const onChangeUserMobile = (text) => {
		setUserMobile(text);
	};

	// 手机登录时的国家区号选择
	const onMobileCountrySelect = (country) => {
		const callingCode = _checkCallingCode(country);
		setCallingCode(callingCode);
	};

	// 确认获取验证码按钮是否可用
	useEffect(() => {
		if (validator.isMobilePhone(userMobile, 'zh-CN')) {
			setDisableLoginMobileBtn(false);
		} else {
			setDisableLoginMobileBtn(true);
		}
	}, [userMobile]);

	return (
		<SafeAreaView style={styles.container}>
			{/* 判断 loading，显示 Spinner */}
			<Spinner animation='fade' visible={mobileVerificationLoading || checkUserLoginLoading} size='small' />
			{/* 头部*/}
			<View style={styles.header}>
				<View style={styles.btnClose}>
					<TouchableOpacity>
						<Feather name='x' size={24} color='gray' />
					</TouchableOpacity>
				</View>
				<TouchableOpacity>
					<View>
						<Text style={styles.loginQuestion}>登录遇到困难？</Text>
					</View>
				</TouchableOpacity>
			</View>
			{/*登录 */}
			{loginMode === 'userNameAndPassword' ? (
				<>
					<View style={styles.loginContainer}>
						<Image source={require('@/static/avatar-person.png')} style={styles.avatarPerson} />
						<Text style={styles.loginTitleText}>帐号登录</Text>

						<View style={styles.textInputContainer}>
							<TextInput
								style={styles.userName}
								placeholder='陌陌号/邮箱/手机'
								value={userName}
								onChangeText={onChangeUserName}
								clearButtonMode='while-editing'
								placeholderTextColor='gray'
							/>
							<View style={styles.inputTextIconContainer} />
						</View>
						<View style={styles.textInputContainer}>
							<TextInput
								style={styles.password}
								placeholder='输入登录密码'
								value={password}
								onChangeText={onChangePassword}
								secureTextEntry={passwordSecureTextEntry}
								clearButtonMode='while-editing'
								placeholderTextColor='gray'
							/>
							<TouchableOpacity onPress={togglePasswordSecureTextEntry}>
								<FontAwesome name='eye' size={14} color='gray' style={styles.inputTextIconContainer} />
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={[
								styles.loginBtnContainer,
								{ backgroundColor: !disableLoginBtn ? '#55d8f1' : '#d6d7d8' },
							]}
							onPress={onLoginSubmit}
							disabled={disableLoginBtn}
						>
							<Text style={styles.loginBtn}>登录</Text>
						</TouchableOpacity>

						<View style={styles.switchModeAndArea}>
							<TouchableOpacity onPress={() => switchLoginMode('mobile')}>
								<Text style={styles.switchMode}>手机号码证码登录</Text>
							</TouchableOpacity>
							<CountryPicker
								withFlag={true}
								withFilter={true}
								withCountryNameButton={true}
								withAlphaFilter={true}
								withCallingCode={true}
								withEmoji={true}
								renderFlagButton={() => null}
								{...{
									countryCode,
									onSelect: onCountrySelect,
									onClose: () => setShowCountry(false),
								}}
								visible={showCountry}
								preferredCountries={['CH']}
							/>
							<TouchableOpacity onPress={() => setShowCountry(true)}>
								<Text style={styles.switchArea}>选择区号</Text>
							</TouchableOpacity>
						</View>
					</View>
				</>
			) : (
				<>
					<View style={styles.loginContainer}>
						<Text style={[styles.loginTitleText, { marginBottom: 20 }]}>手机号登录注册</Text>

						<View style={styles.textInputContainer}>
							<CountryPicker
								withFlag={true}
								withFilter={true}
								withCountryNameButton={true}
								withAlphaFilter={true}
								withCallingCode={true}
								withEmoji={true}
								renderFlagButton={() => null}
								{...{
									countryCode,
									onSelect: onMobileCountrySelect,
									onClose: () => setShowMobileCountry(false),
								}}
								visible={showMobileCountry}
								preferredCountries={['CH']}
							/>
							<TouchableOpacity onPress={() => setShowMobileCountry(true)}>
								<View style={styles.callingCodeAndChevronDown}>
									<Text style={styles.callingCode}>{callingCode}</Text>
									<Feather name='chevron-down' size={24} color='gray' />
								</View>
							</TouchableOpacity>
							<TextInput
								style={styles.userName}
								placeholder='请输入手机号码'
								value={userMobile}
								onChangeText={onChangeUserMobile}
								clearButtonMode='while-editing'
							/>
						</View>
						<TouchableOpacity
							style={[
								styles.loginBtnContainer,
								{ backgroundColor: !disableLoginMobileBtn ? '#55d8f1' : '#d6d7d8' },
							]}
							onPress={onGetMobileVerificationCode}
							disabled={disableLoginMobileBtn}
						>
							<Text style={styles.loginBtn}>获取验证码</Text>
						</TouchableOpacity>

						<View style={styles.switchModeAndArea}>
							<TouchableOpacity onPress={() => switchLoginMode('userNameAndPassword')}>
								<Text style={styles.switchMode}>帐号密码登录</Text>
							</TouchableOpacity>
						</View>
					</View>
				</>
			)}

			{/* 快速登录 */}
			<View style={styles.quickLoginContainer}>
				<Divider text='快速登录' />
				<View style={styles.quickLoginMode}>
					<TouchableOpacity style={styles.quickLoginWeixin}>
						<FontAwesome name='weixin' size={24} color='white' />
					</TouchableOpacity>

					<TouchableOpacity style={styles.quickLoginQQ}>
						<FontAwesome name='qq' size={24} color='white' />
					</TouchableOpacity>

					<TouchableOpacity style={styles.quickLoginApple}>
						<FontAwesome name='apple' size={24} color='black' />
						<Text style={{ marginLeft: 10 }}>通过Apple登录</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	// 头部
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	btnClose: { flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 10 },
	loginQuestion: {
		color: 'gray',
	},
	// 登录
	loginContainer: {
		margin: 30,
		flexDirection: 'column',
	},
	// 头像
	avatarPerson: {
		width: 100,
		height: 100,
	},
	// 登录标题
	loginTitleText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#3a3b3c',
		marginTop: 10,
	},
	// 输入框容器
	textInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomColor: '#bdd6d8',
		borderBottomWidth: 0.5,
		height: 65,
	},
	// 输入框后面功能图标容器
	inputTextIconContainer: {
		marginLeft: 5,
		marginTop: 10,
		width: 20,
	},
	// 用户名
	userName: {
		flex: 1,
		marginTop: 20,
		height: 50,
		fontSize: 18,
		color: '#111',
	},
	// 密码
	password: {
		flex: 1,
		marginTop: 10,
		fontSize: 18,
		color: '#111',
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
	// 切换登录模式
	switchModeAndArea: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	switchMode: {
		color: '#78c8d1',
	},
	// 切换区域
	switchArea: {
		color: 'gray',
	},
	// 快速登录
	quickLoginContainer: {
		margin: 30,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	quickLoginMode: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	// 微信
	quickLoginWeixin: {
		padding: 12,
		backgroundColor: '#4ac632',
		borderRadius: 30,
	},
	// QQ
	quickLoginQQ: {
		marginRight: 20,
		marginLeft: 20,
		padding: 12,
		backgroundColor: '#54b4fe',
		borderRadius: 30,
	},
	// Apple
	quickLoginApple: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#7b7c7d',
		borderWidth: 1,
		borderRadius: 30,
		padding: 12,
	},
	// 用户手机号码注册登录下箭头
	callingCodeAndChevronDown: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: 40,
	},
	// 区号
	callingCode: {
		fontSize: 24,
		color: 'gray',
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = { getUserInfo };
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
