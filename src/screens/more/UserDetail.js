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
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';

import Animated from 'react-native-reanimated';
import * as ImageManipulator from 'expo-image-manipulator';
import { TOAST_INITIAL_OPTIONS, IS_IOS, UPLOAD_IMAGE_WIDTH, UPLOAD_IMAGE_COMPRESS } from '@/constant/env';
import { connect } from 'react-redux';
import { getUserInfo, updateUserInfo } from '@/redux/actions';
import { getLocationName } from '@/utils/util';
import Toast from 'react-native-root-toast';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.6;

const UserDetail = (props) => {
	const navigation = useNavigation();
	const route = useRoute();

	const [locationName, setLocationName] = useState('');
	const [selectImages, setSelectImages] = useState([]);
	const [uploadedImages, setUploadedImages] = useState(true);

	const [{ data: uploadFileData, loading: uploadFileLoading, error: uploadFileError }, postUploadFile] = useAxios(
		{
			url: requestApi.postUploadFile,
			method: 'POST',
			headers: { 'Content-Type': 'multipart/form-data' },
		},
		{ manual: true }
	);

	useEffect(() => {
		navigation.dangerouslyGetParent().setOptions({
			tabBarVisible: false,
		});
	}, []);

	// 从选择文件页面回传参数
	useEffect(() => {
		if (route.params?.selectFiles) {
			setSelectImages(route.params.selectFiles);
			setUploadedImages(false);
		}
	}, [route.params?.selectFiles]);

	const {
		userInfo: { userInfo, userData },
		income,
		industry,
		marriage,
		updateUserInfo,
	} = props;

	useEffect(() => {
		getLocationName(userInfo.province, userInfo.city, userInfo.area).then((res) => {
			setLocationName(res);
		});
	}, []);

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'aboutMe', title: '我的资料', icon: 'user' },
		{ key: 'myJournal', title: '推荐图片', icon: 'image' },
	]);

	const UserInfoRoute = (props) => {
		const [locationName, setLocationName] = useState('');
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
						<Text style={[styles.userInfoTex]}>{userInfo.introduce}</Text>
					</View>
				</View>
			</View>
		);
	};

	const SecondRoute = () => {
		return (
			<View style={[styles.scene, { margin: 0, padding: 0 }]}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{selectImages.length > 0 &&
						selectImages.map((item, index) => {
							return (
								<Image
									key={index}
									style={{ width: width / 4, height: width / 4, margin: 5, resizeMode: 'cover' }}
									source={{ uri: item.uri }}
								></Image>
							);
						})}
				</View>
				<TouchableOpacity
					style={{
						marginTop: 20,
						marginBottom: 20,
						height: 50,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#56b2fa',
						borderRadius: 20,
					}}
					onPress={() => navigation.push('SelectImageAndVideo')}
				>
					<Text style={{ color: 'white' }}>选择图片</Text>
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{!selectImages.length &&
						userInfo.pictures &&
						userInfo.pictures.length > 0 &&
						userInfo.pictures.split(',').map((item, index) => {
							return (
								<Image
									key={index}
									style={{ width: width / 4, height: width / 4, margin: 5, resizeMode: 'cover' }}
									source={{ uri: item }}
								></Image>
							);
						})}
				</View>

				{!uploadedImages && (
					<TouchableOpacity
						style={{
							marginTop: 20,
							marginBottom: 20,
							height: 50,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#e74c3c',
							borderRadius: 20,
						}}
						onPress={onUploadImages}
					>
						<Text style={{ color: 'white' }}>确认上传</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const resizeImages = async () => {
		const formData = await new FormData();

		await Promise.all(
			selectImages.map(async (item, index) => {
				// 循环做图片缩放
				let resizedPhoto = await ImageManipulator.manipulateAsync(
					item.uri,
					[{ resize: { width: UPLOAD_IMAGE_WIDTH } }],
					{
						compress: UPLOAD_IMAGE_COMPRESS,
						format: 'jpeg',
					}
				);

				// 组装上传文件数据
				await formData.append('file', {
					uri: resizedPhoto.uri,
					type: 'application/octet-stream',
					name: `selectImages_${index}.jpg`,
				});
			})
		);

		return formData;
	};

	const onUploadImages = async () => {
		let formData = await resizeImages();
		try {
			const { code, data, message, ok } = await postUploadFile({ data: formData });
			if (code === 200) {
				try {
					await updateUserInfo({ pictures: data.toString() });
					setUploadedImages(true);
					setSelectImages([]);
				} catch (error) {
					Toast.show(error, TOAST_INITIAL_OPTIONS);
				}
			}
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	const renderScene = SceneMap({
		aboutMe: UserInfoRoute,
		myJournal: SecondRoute,
	});

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

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Spinner animation='fade' visible={uploadFileLoading} size='small' />

			<View style={{ height: ITEM_HEIGHT, overflow: 'hidden' }}>
				<Image
					source={{ uri: userInfo.avatar }}
					style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, resizeMode: 'cover' }}
				/>

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
					<TouchableOpacity
						style={{
							marginRight: 20,
							marginTop: 10,
							backgroundColor: 'white',
							paddingTop: 10,
							paddingBottom: 10,
							paddingRight: 15,
							paddingLeft: 15,
							borderRadius: 15,
						}}
						onPress={() => navigation.navigate('EditUserInfo')}
					>
						<Text>编辑</Text>
					</TouchableOpacity>
				</View>
			</View>

			<BottomSheet initialSnapIndex={0} snapPoints={[height - ITEM_HEIGHT, height]}>
				<View style={{ margin: 20, marginTop: 10 }}>
					<Text style={{ fontSize: 24, fontWeight: 'bold' }}>{userInfo.nickName}</Text>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.sex, { backgroundColor: userInfo.sex === 'MAN' ? '#58a1f5' : '#E18CB6' }]}>
							<FontAwesome name={userInfo.sex === 'MAN' ? 'male' : 'female'} size={14} color='white' />
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
		</SafeAreaView>
	);
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
		userInfo: state.user.userInfo,
		income: state.dict.income,
		marriage: state.dict.marriage,
		industry: state.dict.industry,
	};
};

const mapDispatchToProps = { getUserInfo, updateUserInfo };

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
