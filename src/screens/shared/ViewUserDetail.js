import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
	Image,
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	FlatList,
	Dimensions,
	StatusBar,
	TouchableOpacity,
	Button,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FontAwesome, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';

import { TOAST_INITIAL_OPTIONS } from '@/constant/env';
import { getLocationName } from '@/utils/util';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.6;


/* 
{
  "isFllow": false,   
  "userData": Object {
    "distance": 1,    
    "fansCount": 3,   
    "isVip": 0,       
    "postCount": 7,   
    "userId": 2,
  },
  "userInfo": Object {
    "area": "110102",
    "areainfo": "上海市松江区方塔北路558号",
    "avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    "birthday": "2000-12-03 00:00:00",
    "city": "110100",
    "createTime": "2020-12-09 09:22:34",
    "height": 170,
    "id": 2,
    "income": "4",
    "industry": "2",
    "introduce": "Who are you I’m chinavane Yes,I can.",
    "isDeleted": 0,
    "marriage": "2",
    "mobile": "13011111111",
    "nickName": "qq",
    "param": Object {
      "areaName": "西城区",
      "cityName": "市辖区",
      "incomeName": "",
      "industryName": "信息技术",
      "marriageName": "已婚",
      "provinceName": "北京市",
      "sexName": "男",
    },
    "pictures": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/f5176fe3-174d-4ebe-8fb2-74ef3f771235.jpg,https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/7a671b52-58cc-4621-a194-ca8f04b73c6e.jpg",
    "province": "110000",
    "sex": "MAN",
    "signature": "I’m chinavane",
    "updateTime": "2020-12-29 14:03:30",
    "userId": 2,
  },
}
	
*/
const ViewUserDetail = (props) => {

	const navigation = useNavigation();
	const route = useRoute();
	const [userDetail, setUserDetail] = useState({})
	const [locationName, setLocationName] = useState('');
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'aboutMe', title: `关于他`, icon: 'user' },
		{ key: 'myJournal', title: `他的动态`, icon: 'image' },
	]);

	const [{ loading, error }, request] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {
		const fetchData = async () => {
			const userId = route.params.userId
			const {data} = await request({
				url: `${requestApi.getUserShow}/${userId}`
			});
			console.log('ViewUserDetail data', data)
			setUserDetail(data)
		}
		fetchData()
	}, [])

	const handleFollow = async () => {
		const result = await request({
			url: requestApi.getFollow + '/' + userDetail.userInfo.userId
		})
		// console.log('handleFollow', result)
		setUserDetail({...userDetail, isFllow: true})
		Toast.show('关注成功!', TOAST_INITIAL_OPTIONS)
	}

	const toChat = () => {
		navigation.navigate('Chat', {userInfo: userDetail.userInfo})
	}

	const { income, industry, marriage } = props;

	if (userDetail && userDetail.userInfo) {
		const { userInfo, userData } = userDetail;

		getLocationName(userInfo.province, userInfo.city, userInfo.area).then((res) => {
			setLocationName(res);
		});

		const UserInfoRoute = (props) => {
			return (
				<View
					style={{
						marginTop: 10,
						borderWidth: 1,
						borderColor: '#ddd',
						borderRadius: 10,
						padding: 20,
						shadowColor: '#000',
						shadowOffset: {
							width: 1,
							height: 2,
						},
						shadowOpacity: 0.2,
						shadowRadius: 2,

						elevation: 2,
					}}
				>
					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='toolbox-outline'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>
							行业：{userInfo.industry && industry.find((item) => item.value === userInfo.industry).name}
						</Text>
					</View>
					<View style={styles.userInfoContainer}>
						<FontAwesome name='rmb' size={24} color='gray' style={{ width: 24, textAlign: 'center' }} />
						<Text style={styles.userInfoTex}>
							收入：{userInfo.income && income.find((item) => item.value === userInfo.income).name}
						</Text>
					</View>
					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='human-male-female'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>
							婚姻：
							{userInfo.marriage && marriage.find((item) => item.value === userInfo.marriage).name}
						</Text>
					</View>

					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='human-male-height'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>
							身高：
							{userInfo.height}cm
						</Text>
					</View>
					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='map-marker-outline'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>所在地区： {locationName}</Text>
					</View>
					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='map-legend'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>联系地址 {userInfo.areainfo}</Text>
					</View>
					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='signature-text'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<Text style={styles.userInfoTex}>个性签名：{userInfo.signature}</Text>
					</View>

					<View style={styles.userInfoContainer}>
						<MaterialCommunityIcons
							name='briefcase-edit-outline'
							size={24}
							color='gray'
							style={{ width: 24, textAlign: 'center' }}
						/>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.userInfoTex}>个人介绍:</Text>
							<Text style={[styles.userInfoTex, { width: width / 2 }]}>{userInfo.introduce}</Text>
						</View>
					</View>
				</View>
			);
		};

		const SecondRoute = () => {
			return (
				<View style={[styles.scene, { margin: 0, padding: 0 }]}>
					<Text>SecondRoute</Text>
				</View>
			);
		};

		const renderItem = ({ navigationState, position }) => ({ route, index }) => {
			const inputRange = navigationState.routes.map((_, i) => i);

			const activeOpacity = Animated.interpolateNode(position, {
				inputRange,
				outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
			});
			const inactiveOpacity = Animated.interpolateNode(position, {
				inputRange,
				outputRange: inputRange.map((i) => (i === index ? 0 : 1)),
			});

			return (
				<View style={styles.tab}>
					<Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<Text style={[styles.label, styles.inactive]}>{route.title}</Text>
							<Feather name={route.icon} size={24} style={[styles.icon, styles.inactive]} />
						</View>
					</Animated.View>
					<Animated.View style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}>
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<Text style={[styles.label, styles.active]}>{route.title}</Text>
							<Feather name={route.icon} size={24} style={[styles.icon, styles.active]} />
						</View>
					</Animated.View>
				</View>
			);
		};

		const renderScene = SceneMap({
			aboutMe: UserInfoRoute,
			myJournal: SecondRoute,
		});

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ height: ITEM_HEIGHT, overflow: 'hidden' }}>
					<Image
						source={{ uri: userInfo.avatar }}
						style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, resizeMode: 'cover' }} />

					<View
						style={{
							position: 'absolute',
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<TouchableOpacity
							style={{ marginLeft: 20, marginTop: 10 }}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<FontAwesome name='angle-left' size={30} color='white' />
						</TouchableOpacity>
					</View>
				</View>

				<BottomSheet initialSnapIndex={0} snapPoints={[height - ITEM_HEIGHT, height]}>
					<View style={{ margin: 20, marginTop: 10 }}>
						<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{userInfo.nickName}</Text>
						<View style={{ flexDirection: 'row' }}>
							<View
								style={[
									styles.sex,
									{ backgroundColor: userInfo.sex === 'MAN' ? '#58a1f5' : '#E18CB6' },
								]}
							>
								<FontAwesome
									name={userInfo.sex === 'MAN' ? 'male' : 'female'}
									size={14}
									color='white'
								/>
								<Text style={styles.sexAge}>{dayjs(dayjs()).diff(userInfo.birthday, 'year')}</Text>
							</View>
							<Text> {userData.distance}km</Text>
						</View>
						<Text style={{ marginTop: 10 }}>
							发贴{userData.postCount} ‧ 粉丝{userData.fansCount} ‧VIP:{userData.isVip}
						</Text>
					</View>
					<View style={{ margin: 20, marginTop: 0, flex: 1 }}>
						<TabView
							navigationState={{ index, routes }}
							renderScene={renderScene}
							onIndexChange={setIndex}
							renderTabBar={(props) => (
								<View style={{ flexDirection: 'row' }}>
									{props.navigationState.routes.map((route, index) => {
										return (
											<TouchableOpacity key={route.key} onPress={() => props.jumpTo(route.key)}>
												{renderItem(props)({ route, index })}
											</TouchableOpacity>
										);
									})}
								</View>
							)}
						/>
					</View>
				</BottomSheet>

				<View>
					{userDetail.isFllow ? null : <Button title="关注" onPress={handleFollow}></Button>}
					<Button title="聊一聊" onPress={toChat}></Button>
				</View>
			</SafeAreaView>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Spinner animation='fade' visible={true} size='small' />
				<Text>数据加载中...</Text>
			</SafeAreaView>
		);
	}
};

const styles = StyleSheet.create({
	sex: {
		borderRadius: 8,
		paddingRight: 10,
		paddingLeft: 10,
		paddingTop: 2,
		paddingBottom: 2,
		flexDirection: 'row',
	},
	sexAge: {
		marginLeft: 5,
		marginRight: 2,
		color: 'white',
		fontSize: 12,
	},
	scene: {
		flex: 1,
	},
	item: {
		paddingTop: 4.5,
	},
	activeItem: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	active: {
		color: '#0084ff',
		fontWeight: 'bold',
	},
	inactive: {
		color: '#939393',
	},
	icon: {
		height: 26,
		width: 26,
	},
	label: {
		marginBottom: 2,
		marginRight: 10,
		backgroundColor: 'transparent',
		fontSize: 16,
	},
	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	userInfoTex: {
		marginTop: 10,
		marginLeft: 10,
		marginBottom: 10,
		color: 'gray',
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {
		income: state.dict.income,
		marriage: state.dict.marriage,
		industry: state.dict.industry,
	};
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ViewUserDetail);