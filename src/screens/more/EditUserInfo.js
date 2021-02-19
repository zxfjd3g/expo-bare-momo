import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { AntDesign, Ionicons, FontAwesome, FontAwesome5, Foundation, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { getUserInfo, updateUserInfo } from '@/redux/actions';
import { useActionSheet } from '@expo/react-native-action-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

import { getAstro, wgs84tobd09, getMapAddressUrl, getLocationName } from '@/utils/util';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
import { TOAST_INITIAL_OPTIONS, IS_IOS, UPLOAD_IMAGE_WIDTH, UPLOAD_IMAGE_COMPRESS } from '@/constant/env';
import Divider from '@/components/Divider';
import AreaPicker from '@/components/AreaPicker';
import areaData from '@/components/AreaPicker/areaHelper.json';

const Button = (props) => {
	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#56b2fa',
				padding: 20,
				justifyContent: 'center',
				flexDirection: 'row',
				alignItems: 'center',
				borderRadius: 20,
				margin: 20,
				marginBottom: 40,
			}}
			onPress={props.onPress}
		>
			<Text style={{ color: 'white', fontWeight: 'bold' }}>保存</Text>
		</TouchableOpacity>
	);
};

const ListItem = ({ title, titleColor, tip, onPress }) => {
	return (
		<TouchableOpacity style={styles.ListItemContainer} onPress={onPress}>
			<Text style={[styles.ListItemTitle, { color: titleColor }]}>{title}</Text>
			<View style={styles.ListItemTipAndArrow}>
				<Text style={styles.ListItemTip}>{tip}</Text>
				<FontAwesome name='angle-right' size={24} color='#adaeaf' />
			</View>
		</TouchableOpacity>
	);
};

const EditUserInfo = (props) => {
	const { loading, updateUserInfo } = props;
	const navigation = useNavigation();
	const {
		userInfo: { userInfo, userData },
		income,
		marriage,
		industry,
	} = props;
	const [isModalVisible, setModalVisible] = useState(false);
	const [userInfoNickName, setUserInfoNickName] = useState(userInfo.nickName);
	const [userInfoBirthday, setUserInfoBirthday] = useState(new Date(1598051730000));
	const [userInfoAvatar, setUserInfoAvatar] = useState(userInfo.avatar);

	// 地理位置
	const [locationLoading, setLocationLoading] = useState(false);
	const [location, setLocation] = useState(userInfo.areainfo);
	const [errorMsg, setErrorMsg] = useState(null);
	const [selectProvince, setSelectProvince] = useState(userInfo.province);
	const [selectCity, setSelectCity] = useState(userInfo.city);
	const [selectArea, setSelectArea] = useState(userInfo.area);
	const [userInfoAddress, setUserInfoAddress] = useState(userInfo.address);
	const [locationName, setLocationName] = useState('');

	// 个人信息
	const [userInfoIncome, setUserInfoIncome] = useState(userInfo.income);
	const [userInfoIndustry, setUserInfoIndustry] = useState(userInfo.industry);
	const [userInfoMarriage, setUserInfoMarriage] = useState(userInfo.marriage);
	const [userInfoHeight, setUserInfoHeight] = useState(userInfo.height);
	const [userInfoSignature, setUserInfoSignature] = useState(userInfo.signature);
	const [userInfoIntroduce, setUserInfoIntroduce] = useState(userInfo.introduce);

	// 选择的模态窗口
	const [switchRenderModalType, setSwitchRenderModalType] = useState('nickName');

	const [modalTitle, setModalTitle] = useState('');
	const { showActionSheetWithOptions } = useActionSheet();
	const [
		{ data: uploadAvatarData, loading: uploadAvatarLoading, error: uploadAvatarError },
		postUploadAvatar,
	] = useAxios(
		{
			url: requestApi.postUploadAvatar,
			method: 'POST',
			headers: { 'Content-Type': 'multipart/form-data' },
		},
		{ manual: true }
	);

	const [{ data: mapAddressData, loading: mapAddressLoading, error: mapAddressError }, getMapAddressData] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				// 授权认证方式 1
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					let toast = Toast.show('未授权媒体功能操作', {
						duration: Toast.durations.LONG,
						position: Toast.positions.CENTER,
						shadow: true,
						animation: true,
						hideOnPress: true,
						delay: 1000,
					});
					return;
				}
			}
		})();
	}, []);

	const closeModal = () => {
		setModalVisible(false);
	};
	//------------------------------------------------------------
	// 修改用户昵称
	//------------------------------------------------------------
	const onEditUserNickModal = async () => {
		await setSwitchRenderModalType('nickName');
		await setModalTitle('修改用户昵称');
		await setModalVisible(true);
	};

	const onChangeNickName = async (text) => {
		await setUserInfoNickName(text);
	};

	const renderChangeNickName = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的昵称是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>独特的昵称更容易让对方记住你</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						value={userInfoNickName}
						style={{ flex: 1, marginTop: 20, height: 50, color: '#111' }}
						placeholder='请输入你的昵称'
						clearButtonMode='while-editing'
						placeholderTextColor='gray'
						onChangeText={onChangeNickName}
					/>
				</View>
			</View>
		);
	};

	const _submitOnChangeNickName = async () => {
		await updateUserInfo({ nickName: userInfoNickName });
		closeModal();
	};
	//------------------------------------------------------------
	// 修改出生日期
	//------------------------------------------------------------
	const onEditUserBirthdayModal = async () => {
		await setSwitchRenderModalType('birthday');
		await setModalTitle('修改出生日期');
		await setModalVisible(true);
	};

	const renderChangeBirthday = () => {
		return (
			<View>
				<DateTimePicker
					locale='zh_CN'
					value={userInfoBirthday}
					mode='date'
					is24Hour={true}
					display='spinner'
					onChange={_onChangeBirthday}
				/>
			</View>
		);
	};

	const _onChangeBirthday = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setUserInfoBirthday(currentDate);
	};

	const _submitOnChangeBirthday = async () => {
		await updateUserInfo({ birthday: dayjs(userInfoBirthday).format('YYYY-MM-DD HH:mm:ss') });
		setModalVisible(false);
	};

	//------------------------------------------------------------
	// 修改用户头像
	//------------------------------------------------------------

	const openActionSheet = () => {
		const options = ['相册', '拍照', '取消'];
		const destructiveButtonIndex = 2;
		const cancelButtonIndex = 2;
		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
				title: '选择或者拍摄照片',
				message: '五官清晰的照片，获得匹配的概念更高',
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					pickImage();
				} else if (buttonIndex === 1) {
					pickFromCamera();
				}
			}
		);
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			await _submitOnChangeAvatar(result.uri);
		}
	};

	const pickFromCamera = async () => {
		const { granted } = await Permissions.askAsync(Permissions.CAMERA);
		if (!granted) {
			console.log('EditUserInfo 未授权');
			return;
		}
		try {
			console.log('++++')
			let result = await ImagePicker.launchCameraAsync({
				base64: true,
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5,
			});
			console.log('++++22', result)
			if (!result.cancelled) {
				await _submitOnChangeAvatar(result.uri);
			}
		} catch (e) {
			console.log('++++33', e)
		}
	};

	const _submitOnChangeAvatar = async (uploadAvatarUri) => {
		
		// 图片缩放
		let resizedPhoto = await ImageManipulator.manipulateAsync(
			uploadAvatarUri,
			[{ resize: { width: UPLOAD_IMAGE_WIDTH } }],
			{
				compress: UPLOAD_IMAGE_COMPRESS,
				format: 'jpeg',
			}
		);

		// 组装上传文件数据
		const formData = new FormData();

		formData.append('file', {
			uri: resizedPhoto.uri,
			type: 'application/octet-stream',
			name: 'avatar.jpg',
		});

		// 先进行文件上传
		// 文件上传成功以后，再利用redux更新头像信息
		try {
			const {
				code,
				data: { fileURL, isPortrait },
				message,
				ok,
			} = await postUploadAvatar({ data: formData });

			console.log('EditUserInfo', code, fileURL, isPortrait, message, ok);
			if (code === 200) {
				await updateUserInfo({ avatar: fileURL });
				setUserInfoAvatar(uploadAvatarUri);
			}
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	//------------------------------------------------------------
	// 修改用户区域
	//------------------------------------------------------------

	const onEditUserLocationModal = async () => {
		await setSwitchRenderModalType('location');
		await setModalTitle('修改用户地址');
		await setModalVisible(true);
		await setLocationLoading(false);
	};

	const renderChangeLocation = () => {
		return (
			<AreaPicker
				province={userInfo.province}
				city={userInfo.city}
				area={userInfo.area}
				getData={async (data) => {
					setSelectProvince(data.province);
					setSelectCity(data.city);
					setSelectArea(data.area);
				}}
			/>
		);
	};

	const _submitOnChangeLocation = async () => {
		console.log('EditUserInfo', selectProvince, selectCity, selectArea);
		await updateUserInfo({ province: selectProvince, city: selectCity, area: selectArea });
		setModalVisible(false);
	};

	//------------------------------------------------------------
	// 修改用户地址
	//------------------------------------------------------------

	const onEditUserAddressModal = async () => {
		let { status } = await Location.requestPermissionsAsync();
		if (status !== 'granted') {
			console.log('EditUserInfo', '地址位置未授权');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			async (location) => {
				const locationTranlated = wgs84tobd09(location.coords.longitude, location.coords.latitude);

				location.coords.longitude = locationTranlated[0];
				location.coords.latitude = locationTranlated[1];

				let res = await getMapAddressData({
					url: getMapAddressUrl(location.coords.longitude, location.coords.latitude),
				});

				console.log('EditUserInfo', res);
				await setSwitchRenderModalType('address');
				await setUserInfoAddress(res.result.formatted_address);
				await setModalTitle('修改用户地址');
				await setModalVisible(true);
				await setLocationLoading(false);
			},
			(error) => alert(error.message),
			{ enableHighAccuracy: false, timeout: 1000, maximumAge: 1000 }
		);
	};

	const onChangeAddress = (text) => {
		setUserInfoAddress(text);
	};

	const renderChangeAddress = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的详情地址是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>完善具体地址并不会暴露你的私人信息</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						value={userInfoAddress}
						style={{ flex: 1, marginTop: 20, height: 50, color: '#111' }}
						placeholder='请修改你的地址'
						clearButtonMode='while-editing'
						placeholderTextColor='gray'
						onChangeText={onChangeAddress}
					/>
				</View>
			</View>
		);
	};

	const _submitOnChangeAddress = async () => {
		await updateUserInfo({ areainfo: userInfoAddress });
		setModalVisible(false);
	};

	//------------------------------------------------------------
	// 修改收入
	//------------------------------------------------------------
	const onEditUserIncomeModal = async () => {
		await setSwitchRenderModalType('income');
		await setModalTitle('修改月收入');
		await setModalVisible(true);
	};

	const changeSelectIncome = async (itemValue, itemIndex) => {
		await setUserInfoIncome(itemValue);
	};

	const renderChangeIncome = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的月收入是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>请选择你的月收范围，让对方更了解你</Text>
				<View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
					<Picker
						selectedValue={userInfoIncome}
						onValueChange={(itemValue, itemIndex) => changeSelectIncome(itemValue, itemIndex)}
					>
						{income.map((item, index) => {
							return <Picker.Item label={item.name} value={item.value} key={index} />;
						})}
					</Picker>
				</View>
			</View>
		);
	};

	const _submitOnChangeIncome = async () => {
		await updateUserInfo({ income: userInfoIncome });
		closeModal();
	};

	//------------------------------------------------------------
	// 修改职业
	//------------------------------------------------------------

	const onEditUserIndustryModal = async () => {
		await setSwitchRenderModalType('industry');
		await setModalTitle('修改所属行业');
		await setModalVisible(true);
	};

	const changeSelectIndustry = async (itemValue, itemIndex) => {
		await setUserInfoIndustry(itemValue);
	};

	const renderChangeIndustry = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的所属行业是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>请选择你的所属行业，让对方更了解你</Text>
				<View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
					<Picker
						selectedValue={userInfoIndustry}
						onValueChange={(itemValue, itemIndex) => changeSelectIndustry(itemValue, itemIndex)}
					>
						{industry.map((item, index) => {
							return <Picker.Item label={item.name} value={item.value} key={index} />;
						})}
					</Picker>
				</View>
			</View>
		);
	};

	const _submitOnChangeIndustry = async () => {
		await updateUserInfo({ industry: userInfoIndustry });
		closeModal();
	};

	//------------------------------------------------------------
	// 修改婚姻
	//------------------------------------------------------------

	const onEditUserMarriageModal = async () => {
		await setSwitchRenderModalType('marriage');
		await setModalTitle('修改婚姻状况');
		await setModalVisible(true);
	};

	const changeSelectMarriage = async (itemValue, itemIndex) => {
		await setUserInfoMarriage(itemValue);
	};

	const renderChangeMarriage = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的婚姻状态是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>请选择你的婚姻状态，让对方更了解你</Text>
				<View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
					<Picker
						selectedValue={userInfoMarriage}
						onValueChange={(itemValue, itemIndex) => changeSelectMarriage(itemValue, itemIndex)}
					>
						{marriage.map((item, index) => {
							return <Picker.Item label={item.name} value={item.value} key={index} />;
						})}
					</Picker>
				</View>
			</View>
		);
	};

	const _submitOnChangeMarriage = async () => {
		await updateUserInfo({ marriage: userInfoMarriage });
		closeModal();
	};

	//------------------------------------------------------------
	// 修改身高
	//------------------------------------------------------------

	const onEditUserHeightModal = async () => {
		await setSwitchRenderModalType('height');
		await setModalTitle('修改个人身高');
		await setModalVisible(true);
	};

	const changeSelectHeight = async (itemValue, itemIndex) => {
		await setUserInfoHeight(itemValue);
	};

	const renderChangeHeight = () => {
		let heightList = [];
		for (let i = 140; i < 220; i++) {
			heightList.push(i);
		}

		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的身高是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>请选择你的身高，让对方更了解你</Text>
				<View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
					<Picker
						selectedValue={userInfoHeight}
						onValueChange={(itemValue, itemIndex) => changeSelectHeight(itemValue, itemIndex)}
					>
						{heightList.map((item, index) => {
							return <Picker.Item label={item + 'cm'} value={item} key={index} />;
						})}
					</Picker>
				</View>
			</View>
		);
	};

	const _submitOnChangeHeight = async () => {
		await updateUserInfo({ height: userInfoHeight });
		closeModal();
	};

	//------------------------------------------------------------
	// 修改签名
	//------------------------------------------------------------
	const onEditUserSignatureModal = async () => {
		await setSwitchRenderModalType('signature');
		await setModalTitle('修改个性签名');
		await setModalVisible(true);
	};

	const onChangeSignature = async (text) => {
		await setUserInfoSignature(text);
	};

	const renderChangeSignature = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的个性签名是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>独特的个性签名更容易让对方记住你</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						value={userInfoSignature}
						style={{ flex: 1, marginTop: 20, height: 50, color: '#111' }}
						placeholder='请输入你的个性签名'
						clearButtonMode='while-editing'
						placeholderTextColor='gray'
						onChangeText={onChangeSignature}
					/>
				</View>
			</View>
		);
	};

	const _submitOnChangeSignature = async () => {
		await updateUserInfo({ signature: userInfoSignature });
		closeModal();
	};

	//------------------------------------------------------------
	// 修改简介
	//------------------------------------------------------------

	const onEditUserIntroduceModal = async () => {
		await setSwitchRenderModalType('introduce');
		await setModalTitle('修改个人介绍');
		await setModalVisible(true);
	};

	const onChangeIntroduce = async (text) => {
		await setUserInfoIntroduce(text);
	};

	const renderChangeIntroduce = () => {
		return (
			<View style={{ margin: 20, flexDirection: 'column' }}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>你的个人介绍是？</Text>
				<Text style={{ color: 'gray', marginTop: 10 }}>详细的个人介绍更容易让对方记住你</Text>

				<View style={[styles.textInputContainer, { height: 120 }]}>
					<TextInput
						multiline
						value={userInfoIntroduce}
						style={{ flex: 1, marginTop: 20, height: 120, color: '#111' }}
						placeholder='请输入你的个人介绍'
						clearButtonMode='while-editing'
						placeholderTextColor='gray'
						onChangeText={onChangeIntroduce}
					/>
				</View>
			</View>
		);
	};

	const _submitOnChangeIntroduce = async () => {
		await updateUserInfo({ introduce: userInfoIntroduce });
		closeModal();
	};

	const switchRenderModal = () => {
		switch (switchRenderModalType) {
			case 'nickName':
				return renderChangeNickName();
			case 'birthday':
				return renderChangeBirthday();
			case 'location':
				return renderChangeLocation();
			case 'address':
				return renderChangeAddress();
			case 'income':
				return renderChangeIncome();
			case 'industry':
				return renderChangeIndustry();
			case 'marriage':
				return renderChangeMarriage();
			case 'height':
				return renderChangeHeight();
			case 'signature':
				return renderChangeSignature();
			case 'introduce':
				return renderChangeIntroduce();
			default:
				return renderChangeNickName();
		}
	};

	const switchRenderModalButton = () => {
		switch (switchRenderModalType) {
			case 'nickName':
				return <Button onPress={_submitOnChangeNickName} />;
			case 'birthday':
				return <Button onPress={_submitOnChangeBirthday} />;
			case 'location':
				return <Button onPress={_submitOnChangeLocation} />;
			case 'address':
				return <Button onPress={_submitOnChangeAddress} />;
			case 'income':
				return <Button onPress={_submitOnChangeIncome} />;
			case 'industry':
				return <Button onPress={_submitOnChangeIndustry} />;
			case 'marriage':
				return <Button onPress={_submitOnChangeMarriage} />;
			case 'height':
				return <Button onPress={_submitOnChangeHeight} />;
			case 'signature':
				return <Button onPress={_submitOnChangeSignature} />;
			case 'introduce':
				return <Button onPress={_submitOnChangeIntroduce} />;
			default:
				return <Button onPress={_submitOnChangeNickName} />;
		}
	};

	useEffect(() => {
		const getLocationName = async (province, city, area) => {
			if (province && city && area) {
				const provinceData = await areaData.find((item) => item.id === province);
				const provinceName = await provinceData.name;
				const cityData = await provinceData.city.find((item) => item.id === city);
				const cityName = await cityData.name;
				const areaName = await cityData.area.find((item) => item.id === area).name;
				setLocationName(provinceName + ' ' + cityName + ' ' + areaName);
			}
		};

		getLocationName(selectProvince, selectCity, selectArea);
	}, [selectProvince, selectCity, selectArea]);

	return (
		<SafeAreaView style={styles.container}>
			<Spinner animation='fade' visible={uploadAvatarLoading || locationLoading} size='small' />

			<ScrollView style={styles.svContainer}>
				<TouchableOpacity style={styles.ListItemContainer} onPress={openActionSheet}>
					<Image
						source={{ uri: userInfoAvatar }}
						style={{ width: 80, height: 80, borderRadius: 10, resizeMode: 'cover' }}
					/>
					<View style={styles.ListItemTipAndArrow}>
						<FontAwesome name='angle-right' size={24} color='#adaeaf' />
					</View>
				</TouchableOpacity>

				<View style={styles.tipContainer}>
					<Ionicons name='ios-alert' size={24} color='red' />
					<Text style={styles.tipText}>
						尊敬的用户，您上传的头像须遵守相关法律法规和社区规则，请严格遵守相关规定，以免违规。
					</Text>
				</View>
				<View style={styles.titleHeader}>
					<Text style={styles.titleHeaderText}>基本资料</Text>
				</View>

				<ListItem title='昵称' tip={userInfo.nickName} onPress={onEditUserNickModal} />
				<Divider />

				<ListItem
					title='出生日期'
					tip={
						dayjs(userInfo.birthday).format('YYYY-MM-DD') +
						`(${getAstro(dayjs(userInfoBirthday).format('MM'), dayjs(userInfoBirthday).format('DD'))})`
					}
					onPress={onEditUserBirthdayModal}
				/>
				<Divider />
				<ListItem title='用户区域' tip={locationName} onPress={onEditUserLocationModal} />
				<Divider />
				<ListItem
					title='用户地址'
					tip={userInfo.areainfo && userInfo.areainfo}
					onPress={onEditUserAddressModal}
				/>
				<Divider />

				<View style={styles.titleHeader}>
					<Text style={styles.titleHeaderText}>个人信息</Text>
				</View>

				<ListItem
					title='月收'
					tip={userInfo.income && income.find((item) => item.value === userInfo.income).name}
					onPress={onEditUserIncomeModal}
				/>
				<Divider />

				<ListItem
					title='所属行业'
					tip={userInfo.industry && industry.find((item) => item.value === userInfo.industry).name}
					onPress={onEditUserIndustryModal}
				/>
				<Divider />

				<ListItem
					title='婚姻状况'
					tip={userInfo.marriage && marriage.find((item) => item.value === userInfo.marriage).name}
					onPress={onEditUserMarriageModal}
				/>
				<Divider />

				<ListItem
					title='身高'
					tip={userInfo.height && userInfo.height + 'cm'}
					onPress={onEditUserHeightModal}
				/>
				<Divider />

				<ListItem
					title='个性签名'
					tip={userInfo.signature && userInfo.signature}
					onPress={onEditUserSignatureModal}
				/>
				<Divider />

				<ListItem title='个人介绍' tip='点击查看详情' onPress={onEditUserIntroduceModal} />
				<Divider />
			</ScrollView>

			<Modal
				onSwipeComplete={closeModal}
				style={{ justifyContent: 'flex-end', margin: 0 }}
				isVisible={isModalVisible}
				onBackdropPress={closeModal}
			>
				<View
					style={{
						height: 400,
						backgroundColor: 'white',
						borderTopLeftRadius: 10,
						borderTopRightRadius: 10,
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TouchableOpacity onPress={closeModal}>
								<AntDesign
									name='close'
									size={24}
									color='#ccc'
									style={{ margin: 10, paddingBottom: 0 }}
								/>
							</TouchableOpacity>
							<View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1, marginRight: 34 }}>
								<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{modalTitle}</Text>
							</View>
						</View>
						<Divider marginTop={0} />
						{switchRenderModal()}
					</View>
					{switchRenderModalButton()}
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'white' },
	svContainer: { padding: 15 },
	ListItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 5 },
	ListItemTipAndArrow: { flexDirection: 'row', alignItems: 'center' },
	ListItemTitle: { fontSize: 16 },
	ListItemTip: { fontSize: 14, color: 'gray', marginRight: 10 },
	titleHeader: {
		backgroundColor: '#bbb',
		padding: 10,
		marginBottom: 10,
	},
	titleHeaderText: {
		color: '#555',
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
	tipContainer: {
		flexDirection: 'row',
		padding: 20,
		marginBottom: 10,
		backgroundColor: '#eee',
	},
	tipText: {
		lineHeight: 22,
		marginLeft: 5,
		color: '#999',
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {
		userInfo: state.user.userInfo,
		loading: state.user.loading,
		income: state.dict.income,
		marriage: state.dict.marriage,
		industry: state.dict.industry,
	};
};

const mapDispatchToProps = { getUserInfo, updateUserInfo };

export default connect(mapStateToProps, mapDispatchToProps)(EditUserInfo);
