import React, { useEffect, useReducer, useMemo} from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 选择摄像头还是照片操作的ActionSheet底部弹出内容的支持
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { axios } from '@/api/request';
import requestApi from '@/api/requestApi';

// 一级页面
// 引导页
import Guide from '@/screens/bootstrap/Guide';
// 过渡页
import SplashScreen from '@/screens/bootstrap/SplashScreen';
// 图片轮播查看
import SwiperViewModal from '@/screens/shared/SwiperViewModal';
// 查看用户详情
import ViewUserDetail from '@/screens/shared/ViewUserDetail';

// 注册登录
import SignIn from '@/screens/login/SignIn';
// 手机验证码
import MobileVerificationCode from '@/screens/login/MobileVerificationCode';
// 完善用户信息(注册后)
import UserInfo from '@/screens/login/UserInfo';
// 上传照片
import UploadPhoto from '@/screens/login/UploadPhoto';

// 附近
import Near from '@/screens/near/Near';
import Journal from '@/screens/near/journal/Journal';
import JournalDetail from '@/screens/near/journal/JournalDetail';

// 首页
import Home from '@/screens/home/Home';
// 喜欢我和我喜欢的人列表
import LikeList from '@/screens/home/LikeList' 

// 信息
import Conversations from '@/screens/message/Conversations';
// 聊天
import Chat from '@/screens/message/Chat';
// 系统消息
import SysMessages from '@/screens/message/SysMessages';

// 动态
import Post from '@/screens/post/Post';
// 更多
import More from '@/screens/more/More';
// 选择图片或者视频
import SelectImageAndVideo from '@/screens/shared/SelectImageAndVideo';

// 更多中的设置
import Setting from '@/screens/more/Setting';
import UserDetail from '@/screens/more/UserDetail';
import EditUserInfo from '@/screens/more/EditUserInfo';
import FriendFollowFan from '@/screens/more/FriendFollowFan';

// 会员中心
import MemberCenter from '@/screens/more/MemberCenter';
import Payment from "@/screens/payment/Payment";
import Pay from "@/screens/more/Pay";
import PayResult from "@/screens/more/PayResult";

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, persistor } from '@/redux/store';

import AuthContext from './AuthContext'
import {connectRC, disConnectRC} from '@/rongcloud'
import {connect} from 'react-redux'
import {receiveMessage} from '@/redux/actions'

// 开启产品调试模式将不会显示黄色警告信息
LogBox.ignoreAllLogs(true);

const Tab = createBottomTabNavigator();

function HomeTabs() {
	// const { home, near, message, post, more } = useSelector((state) => {
	// 	return state.badge.tabBadge;
	// });

	const {unReadCount} = useSelector((state) => {
		return state.chat
	});

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let iconColor;

					if (route.name === 'near') {
						iconName = focused ? 'near' : 'near';
					} else if (route.name === 'Home') {
						iconName = focused ? 'home' : 'home';
					} else if (route.name === 'Conversations') {
						iconName = focused ? 'message-square' : 'message-square';
					} else if (route.name === 'Post') {
						iconName = focused ? 'eye' : 'eye';
					} else {
						iconName = focused ? 'user' : 'user';
					}

					iconColor = focused ? 'tomato' : 'gray';

					return <Feather name={iconName} size={24} color={iconColor} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'tomato',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen
				name='Home'
				component={Home}
				options={{ title: '首页' }}
			/>

			<Tab.Screen
				name='Near'
				component={NearStackScreen}
				options={{ title: '附近' }}
			/>
			
			<Tab.Screen
				name='Conversations'
				component={MessageStackScreen}
				options={{ title: '信息', tabBarBadge: unReadCount !== 0 ? unReadCount : null }}
			/>
			<Tab.Screen
				name='Post'
				component={Post}
				options={{ title: '动态' }}
			/>
			<Tab.Screen
				name='More'
				component={MoreStackScreen}
				options={{ title: '更多' }}
			/>
		</Tab.Navigator>
	);
}

// 更多路由
const MoreStack = createStackNavigator();
function MoreStackScreen() {
	return (
		<MoreStack.Navigator>
			<MoreStack.Screen name='More' component={More} options={{ headerShown: false, title: '更多' }} />
			<MoreStack.Screen name='Setting' component={Setting} options={{ headerShown: true, title: '设置' }} />
			<MoreStack.Screen
				name='UserDetail'
				component={UserDetail}
				options={{ headerShown: false, title: '用户资料' }}
			/>
			<MoreStack.Screen
				name='EditUserInfo'
				component={EditUserInfo}
				options={{ headerShown: true, title: '编辑资料' }}
			/>

			<MoreStack.Screen
				name='SelectImageAndVideo'
				component={SelectImageAndVideo}
				options={{
					title: '选择图片或视频',
					tabBarVisible: false,
					headerShown: false,
				}}
			/>

			<MoreStack.Screen
				name='Payment'
				component={Payment}
				options={{
					title: '支付',
					tabBarVisible: false,
				}}
			/>

			<MoreStack.Screen
				name='FriendFollowFan'
				component={FriendFollowFan}
				options={{
					title: '朋友&关注&粉丝',
					tabBarVisible: false,
				}}
			/>

			<MoreStack.Screen
				name='MemberCenter'
				component={MemberCenter}
				options={{
					title: '会员中心',
					tabBarVisible: false,
				}}
			/>

			<MoreStack.Screen
        name="Pay"
        component={Pay}
        options={{
          title: "支付宝支付",
          tabBarVisible: false,
        }}
      />

      <MoreStack.Screen
        name="PayResult"
        component={PayResult}
        options={{
          title: "支付结果",
          tabBarVisible: false,
        }}
      />

		</MoreStack.Navigator>
	);
}

// 根级附近路由
const NearStack = createStackNavigator();
function NearStackScreen() {
	return (
		<NearStack.Navigator>
			<NearStack.Screen name='Near' component={Near} options={{ headerShown: false }} />
		</NearStack.Navigator>
	);
}

// 信息路由
const MessageStack = createStackNavigator();
function MessageStackScreen() {
	return (
		<MessageStack.Navigator>
			<MessageStack.Screen 
				name='Conversations' 
				component={Conversations} 
				options={{ 
					headerShown: false, 
					title: '信息' 
				}} 
			/>
			<MessageStack.Screen 
				name='Chat' 
				component={Chat} 
				options={{ title: '聊天' }} 
			/>
			<MessageStack.Screen 
				name='SysMessages' 
				component={SysMessages} 
				options={{
					title: '全部通知',
				}}
			/>
			<MoreStack.Screen
				name='FriendFollowFan'
				component={FriendFollowFan}
				options={{
				}}
			/>
		</MessageStack.Navigator>
	);
}
// 根级与首页路由
const RootStack = createStackNavigator();
function RootStackScreen({receiveMessage}) {

	useEffect(() => {
		const receiveMsgCallback = ({message, left}) => {
			console.log('--receiveMsgCallback', message, left)
			receiveMessage(message)
		}
	
		const connectRY = async () => {
			const ryToken = await AsyncStorage.getItem('RY_TOKEN')
			if (!ryToken) {
				let {data:{imToken}} = await axios({ url: requestApi.getLoginUserInfo });
				AsyncStorage.setItem('RY_TOKEN', imToken)
				console.log('--- App connect', imToken)
				connectRC(imToken, receiveMsgCallback)
			} else {
				console.log('--- App connect', ryToken)
				connectRC(ryToken, receiveMsgCallback)
			}
		}
		connectRY()
	}, [])

	return (
		<RootStack.Navigator sceneContainerStyle={{ backgroundColor: 'white' }}>
			
			<RootStack.Screen name='Home' component={HomeTabs} options={{ headerShown: false }} />
			
			<MessageStack.Screen name='Chat' component={Chat} options={{ title: '聊天' }} />
			
			<RootStack.Screen
				name='SwiperViewModal'
				component={SwiperViewModal}
				options={{
					tabBarVisible: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
				}}
				mode='modal'
			/>

			<RootStack.Screen
				name='ViewUserDetail'
				component={ViewUserDetail}
				options={{
					headerShown: false,
					tabBarVisible: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
				}}
			/>

			<RootStack.Screen
				name='LikeList'
				component={LikeList}
				options={{
					headerShown: true,
					tabBarVisible: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
				}}
			/>

			<RootStack.Screen
				name='Journal'
				component={Journal}
				options={{
					headerShown: false,
					tabBarVisible: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
				}}
			/>

			<RootStack.Screen
				name='JournalDetail'
				component={JournalDetail}
				options={{
					headerShown: false,
					tabBarVisible: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
				}}
			/>

			<RootStack.Screen
				name='SelectImageAndVideo'
				component={SelectImageAndVideo}
				options={{
					title: '选择图片或视频',
					tabBarVisible: false,
					headerShown: false,
				}}
			/>
		</RootStack.Navigator>
	);
}
RootStackScreen = connect(
	null,
	{receiveMessage}
)(RootStackScreen)


// 引导页路由
const GuideStack = createStackNavigator();
function GuideStackScreen() {
	return (
		<GuideStack.Navigator>
			<GuideStack.Screen name='Guide' component={Guide} options={{ headerShown: false }} />
		</GuideStack.Navigator>
	);
}

// 过渡页路由
const SplashScreenStack = createStackNavigator();
function SplashScreenStackScreen() {
	return (
		<SplashScreenStack.Navigator>
			<SplashScreenStack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }} />
		</SplashScreenStack.Navigator>
	);
}

// 注册登录页路由
const SignInStack = createStackNavigator();
function SignInStackScreen() {
	return (
		<SignInStack.Navigator initialRouteName='SignIn'>
			<SignInStack.Screen
				name='SignIn'
				component={SignIn}
				options={{ headerShown: false, headerBackTitleVisible: false }}
			/>
			<SignInStack.Screen
				name='MobileVerificationCode'
				component={MobileVerificationCode}
				options={{
					headerBackTitleVisible: false,
					title: null,
					headerLeft: (props) => <HeaderBackButton {...props} tintColor='gray' />,
				}}
			/>
			<SignInStack.Screen
				name='UserInfo'
				component={UserInfo}
				options={{
					headerBackTitleVisible: false,
					title: null,
					headerLeft: (props) => <HeaderBackButton {...props} tintColor='gray' />,
				}}
			/>
			<SignInStack.Screen
				name='UploadPhoto'
				component={UploadPhoto}
				options={{
					headerBackTitleVisible: false,
					title: null,
					headerLeft: (props) => <HeaderBackButton {...props} tintColor='gray' />,
				}}
			/>
		</SignInStack.Navigator>
	);
}


function App() {

	const disConnect = async () => {
		console.log('+++App disConnect')
		await AsyncStorage.removeItem('RY_TOKEN')
		disConnectRC()
	}

	const [state, dispatch] = useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'RESTORE_TOKEN':
					return {
						...prevState,
						userToken: action.token,
					};
				case 'SIGN_IN':
					// connectRY()
					return {
						...prevState,
						userToken: action.token,
					};
				case 'SIGN_OUT':
					disConnect()
					return {
						...prevState,
						userToken: null,
					};
				case 'TOGGLE_SPLASH_SCREEN':
					return {
						...prevState,
						showSplashScreen: action.showSplashScreen,
					};
				case 'TOGGLE_GUIDE':
					return {
						...prevState,
						showGuide: action.showGuide,
					};
			}
		},
		{
			showGuide: true,
			showSplashScreen: true,
			isSignout: false,
			userToken: null,
		}
	);

	const authContext = useMemo(
		() => ({
			// 登录
			signIn: async (payload) => {
				dispatch({ type: 'SIGN_IN', token: payload.token });
			},
			// 退出
			signOut: async () => {
				await AsyncStorage.removeItem('token');
				dispatch({ type: 'SIGN_OUT' });
			},
			// 注册
			signUp: async (payload) => {
				dispatch({ type: 'SIGN_IN', token: payload.token });
			},
			// 切换引导磁
			toggleGuide: (payload) => {
				dispatch({ type: 'TOGGLE_GUIDE', showGuide: payload.showGuide });
			},
			// 切换过渡屏
			toggleSplashScreen: (payload) => {
				dispatch({ type: 'TOGGLE_SPLASH_SCREEN', showSplashScreen: payload.showSplashScreen });
			},
		}),
		[]
	);

	useEffect(() => {
		const bootstrapAsync = async () => {
			try {
				const showGuide = await AsyncStorage.getItem('showGuide');
				const blShowGuide = showGuide ? false : true;
				dispatch({ type: 'TOGGLE_GUIDE', showGuide: blShowGuide });
				const token = await AsyncStorage.getItem('token');
				console.log('App token', token)

				dispatch({ type: 'SIGN_IN', token });
			} catch (e) {
				console.log(e);
			}
		};
		bootstrapAsync();
	}, []);

	const renderScreen = () => {
		const { showSplashScreen, showGuide, userToken } = state;
		let renderComponent = <RootStackScreen />;
		if (showGuide) {
			renderComponent = <GuideStackScreen />;
		} else if (showSplashScreen) {
			renderComponent = <SplashScreenStackScreen />;
		} else if (!userToken) {
			renderComponent = <SignInStackScreen />;
		} else {
			renderComponent = <RootStackScreen />;
		}
		return renderComponent;
	};

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ActionSheetProvider>
					<AuthContext.Provider value={authContext}>
						<NavigationContainer>{renderScreen()}</NavigationContainer>
					</AuthContext.Provider>
				</ActionSheetProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
