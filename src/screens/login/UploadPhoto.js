import React, { useState, useEffect, useContext } from 'react';
import { Image, View, Text, Button, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActionSheetProvider, connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet';
import { FontAwesome, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-root-toast';
import Spinner from 'react-native-loading-spinner-overlay';

import { TOAST_INITIAL_OPTIONS, IS_IOS, UPLOAD_IMAGE_WIDTH, UPLOAD_IMAGE_COMPRESS } from '@/constant/env';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
import * as ImageManipulator from 'expo-image-manipulator';

import AuthContext from '~/AuthContext'

const UploadPhoto = (props) => {
	const { signIn, signUp } = useContext(AuthContext);

	const navigation = useNavigation();
	const route = useRoute();

	const [avatar, setAvatar] = useState(null);
	const [avatarUrl, setAvatarUrl] = useState(null);

	const { showActionSheetWithOptions } = useActionSheet();
	const [disableFinishedBtn, setDisableFinishedBtn] = useState(true);

	const [userMobile] = useState(route.params?.userMobile);
	const [token] = useState(route.params?.token);
	const [sex] = useState(route.params?.sex);
	const [nickName] = useState(route.params?.nickName);
	const [birthday] = useState(route.params?.birthday);

	const [
		{ data: registerUserInfoData, loading: registerUserInfoLoading, error: registerUserInfoError },
		postRegisterUserInfo,
	] = useAxios(
		{
			url: requestApi.postRegisterUserInfo,
			method: 'POST',
		},
		{ manual: true }
	);

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

	const onFinishedSubmit = async () => {
		// 图片缩放
		let resizedPhoto = await ImageManipulator.manipulateAsync(
			avatar.uri,
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
		// 文件上传成功以后，设置token值，并进行用户信息的注册与保存操作
		try {
			const {
				code,
				data: { fileURL, isPortrait },
				message,
				ok,
			} = await postUploadAvatar({ data: formData });

			if (code === 200) {
				await AsyncStorage.setItem('token', token);

				try {
					const saveData = {
						avatar: fileURL,
						birthday: dayjs(birthday).format(),
						nickName,
						sex,
					};

					console.log('---', saveData)

					const res = await postRegisterUserInfo({
						data: saveData,
					});

					if (res.code === 200) {
						signIn({ token });
					}
				} catch (error) {
					Toast.show(error, TOAST_INITIAL_OPTIONS);
				}
			}
		} catch (error) {
			Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	useEffect(() => {
		if (avatar !== null) {
			setDisableFinishedBtn(false);
		} else {
			setDisableFinishedBtn(true);
		}
	}, [avatar]);

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
				}

				// 授权认证方式 2
				// const { granted } = await Permissions.askAsync(Permissions.CAMERA);
				// if (!granted) {
				// 	console.log('未授权');
				// }
			}
		})();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			setAvatar(result);
		}
	};

	const pickFromCamera = async () => {
		let result = await ImagePicker.launchCameraAsync({
			base64: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});
		if (!result.cancelled) {
			setAvatar(result);
		}
	};

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

	return (
		<SafeAreaView style={styles.container}>
			{/* 判断 loading，显示 Spinner */}
			<Spinner animation='fade' visible={registerUserInfoLoading || uploadAvatarLoading} size='small' />

			<View style={styles.loginContainer}>
				<Text style={styles.loginTitleText}>上传本人真实照片</Text>
				<Text style={styles.loginContentText}>五官清晰的照片，获得匹配的概念更高</Text>

				<TouchableOpacity onPress={openActionSheet} style={styles.pickAndImagePreviewContainer}>
					{avatar ? (
						<View>
							<Image source={{ uri: avatar.uri }} style={styles.imagePreview} />
							<View style={styles.imagePreviewIconContainer}>
								<Feather name='camera' style={styles.imagePreviewIcon} />
							</View>
						</View>
					) : (
						<View style={styles.imagePreview}>
							<Feather name='camera' style={styles.camera} />
						</View>
					)}
				</TouchableOpacity>

				<View style={styles.tipContainer}>
					<Ionicons name='ios-alert' size={24} color='red' />
					<Text style={styles.tipText}>
						尊敬的用户，您上传的头像须遵守相关法律法规和社区规则，请严格遵守相关规定，以免违规。
					</Text>
				</View>

				<TouchableOpacity
					style={[styles.loginBtnContainer, { backgroundColor: !disableFinishedBtn ? '#55d8f1' : '#d6d7d8' }]}
					onPress={onFinishedSubmit}
					disabled={disableFinishedBtn}
				>
					<Text style={styles.loginBtn}>完成进入</Text>
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
		alignItems: 'center',
	},
	// 登录标题
	loginTitleText: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#3a3b3c',
		marginTop: 10,
	},
	loginContentText: {
		marginTop: 10,
		color: 'gray',
	},
	// 登录按钮容器
	loginBtnContainer: {
		marginTop: 30,
		backgroundColor: '#d6d7d8',
		padding: 20,
		borderRadius: 30,
		justifyContent: 'center',
		flexDirection: 'row',
		width: '100%',
	},
	// 登录按钮
	loginBtn: {
		color: '#fbfcfc',
	},
	pickAndImagePreviewContainer: {
		marginTop: 30,
		marginBottom: 30,
	},
	imagePreview: {
		width: 150,
		height: 150,
		borderRadius: 75,
		backgroundColor: 'gray',
		justifyContent: 'center',
		alignItems: 'center',
	},
	imagePreviewIconContainer: {
		width: 30,
		height: 30,
		borderRadius: 30,
		position: 'absolute',
		right: 10,
		top: 0,
		backgroundColor: '#76daf6',
		justifyContent: 'center',
		alignItems: 'center',
	},
	imagePreviewIcon: {
		fontSize: 18,
		color: 'white',
	},
	camera: {
		color: '#76daf6',
		fontSize: 50,
	},
	tipContainer: {
		flexDirection: 'row',
		margin: 30,
	},
	tipText: {
		lineHeight: 22,
		fontSize: 18,
		marginLeft: 5,
	},
});

const connectUploadPhoto = connectActionSheet(UploadPhoto);
export default connectUploadPhoto;
