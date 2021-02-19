import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import {
	Image,
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	Dimensions,
	ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Feather, Ionicons, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getAstro, wgs84tobd09, getMapAddressUrl, getLocationName, getMapNearbyAddressUrl } from '@/utils/util';
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import EmojiSelector, { Categories } from '@/components/EmojiSelector';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as MediaLibrary from 'expo-media-library';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';

import { TOAST_INITIAL_OPTIONS, IS_IOS, UPLOAD_IMAGE_WIDTH, UPLOAD_IMAGE_COMPRESS } from '@/constant/env';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
import ImageList from '@/components/ImageList';

const { width, height } = Dimensions.get('window');

const Journal = (props) => {
	const navigation = useNavigation();
	const route = useRoute();

	const bottomSheetRef = useRef(null);

	const [location, setLocation] = useState({});
	const [notSeeList, setNotSeeList] = useState([]);
	const [seeList, setSeeList] = useState([]);
	const [seeType, setSeeType] = useState('ALL');
	const [type, setType] = useState('TEXT');
	const [fileUrls, setFileUrls] = useState('');
	const [forwardFileUrl, setForwardFileUrl] = useState(route.params?.forwardFileUrl);
	const [forwardPostId, setForwardPostId] = useState(route.params?.forwardPostId);
	const [forwardContent, setFordwardContent] = useState(route.params?.forwardContent);
	const [forwardNickName, setForwardNickName] = useState(route.params?.forwardNickName);

	const [ideas, setIdeas] = useState('');
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [locationName, setLocationName] = useState('');

	const [pois, setPois] = useState([]);

	const [toggleEmoji, setToggleEmoji] = useState(0);

	const [selectMultiFiles, setSelectMultiFiles] = useState([]); // 压缩后的选中文件
	const [selectMultiFilesNoComporess, setSelectMultiFilesNoComporess] = useState([]); // 未压缩的选中文件
	const [videoThumbnail, setVideoThumbnail] = useState('');
	const [videoDuration, setVideoDuration] = useState(0);

	const [viewContainerWidth, setViewContainerWidth] = useState(0);

	const [isFriendListVisible, setFriendListVisible] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalType, setModalType] = useState('location');
	const [myFriendList, setMyFriendList] = useState([]);

	const [disablePublishBtn, setDisabledPublishBtn] = useState(false);
	const [postLoading, setPostLoading] = useState(false);

	useEffect(() => {
		if (route.params?.forwardPostId) {
			setType('FORWARD');
		}
	}, [route.params?.forwardPostId]);

	// 获取内容区宽度
	const onViewLayout = ({
		nativeEvent: {
			layout: { width },
		},
	}) => {
		setViewContainerWidth(width);
	};

	const handleSheetChanges = useCallback((index) => {
		if (index === 1) {
			setToggleEmoji(true);
		} else {
			setToggleEmoji(false);
		}
	}, []);

	const [{ data: locationData, loading: locationLoading, error: locationError }, getlocation] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	const [{ data: JournalData, loading: JournalLoading, error: JournalError }, postJournal] = useAxios(
		{
			method: 'POST',
			url: requestApi.postJournal,
		},
		{ manual: true }
	);

	const [{ data: uploadFileData, loading: uploadFileLoading, error: uploadFileError }, postUploadFile] = useAxios(
		{
			url: requestApi.postUploadFile,
			method: 'POST',
			headers: { 'Content-Type': 'multipart/form-data' },
		},
		{ manual: true }
	);

	const [{ data: myFriendData, loading: myFriendLoading, error: myFriendError }, getMyFriends] = useAxios(
		{
			url: requestApi.getMyFriends,
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {
		if (ideas.trim().length > 0) {
			setDisabledPublishBtn(true);
		} else {
			setDisabledPublishBtn(false);
		}
	}, [ideas]);

	useEffect(() => {
		bottomSheetRef.current.snapTo(Number(toggleEmoji));
	}, [toggleEmoji]);

	useEffect(() => {
		const getCurrentLocation = async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				console.log('Journal 地址位置未授权');
				return;
			}

			navigator.geolocation && navigator.geolocation.getCurrentPosition(
				async (location) => {
					const locationTranlated = await wgs84tobd09(location.coords.longitude, location.coords.latitude);

					let { result } = await getlocation({
						url: getMapNearbyAddressUrl(locationTranlated[0], locationTranlated[1]),
					});

					await setLongitude(locationTranlated[0]);
					await setLatitude(locationTranlated[1]);
					await setLocation(result);
					await setLocationName(result.formatted_address);
					await setPois(result.pois);
				},
				(error) => console.log(error.message),
				{ enableHighAccuracy: false, timeout: 1000, maximumAge: 1000 }
			);
		};

		const unsubscribe = navigation.addListener('focus', () => {
			getCurrentLocation();
		});
		return unsubscribe;
	}, [navigation]);

	const onChangeTextInput = (text) => {
		setIdeas(text);
	};

	const onChangeTextInputEmoji = (text) => {
		setIdeas(ideas + text);
	};

	const generateFormData = async () => {
		const formData = await new FormData();
		await Promise.all(
			selectMultiFiles.map(async (item, index) => {
				let ext = item.split('.').pop();
				await formData.append('file', {
					uri: item,
					type: 'application/octet-stream',
					name: `selectFiles_${index}.${ext}`,
				});
			})
		);

		return formData;
	};

	const onPublishJournal = async () => {
		try {
			setPostLoading(true);

			let videoThumbnailUploadFileData = '';
			if (type === 'VIDEO') {
				console.log('step 4');

				const videoThumbnailFormData = await new FormData();
				let videoThumbnailExt = videoThumbnail.split('.').pop();
				await videoThumbnailFormData.append('file', {
					uri: videoThumbnail,
					type: 'application/octet-stream',
					name: `selectFiles_videoThumbnail.${videoThumbnailExt}`,
				});
				const videoThumbnailRes = await postUploadFile({ data: videoThumbnailFormData });
				videoThumbnailUploadFileData = await videoThumbnailRes.data.toString();
				console.log('step 5', videoThumbnailUploadFileData);
			}

			console.log('step 1');
			let formData = await generateFormData();
			let uploadFilesData = '';
			if (formData._parts.length > 0) {
				console.log('step 2', formData);

				const res = await postUploadFile({ data: formData });
				uploadFilesData = await res.data.toString();
				console.log('step 3', uploadFilesData);
			}

			let tmpNotSeeList = [];
			let tmpSeeList = [];

			if (seeType === 'SELECT_SEE') {
				tmpSeeList = seeList;
			}

			if (seeType === 'SELECT_NOT_SEE') {
				tmpNotSeeList = notSeeList;
			}

			const data = await {
				fileUrls: uploadFilesData.toString(),
				forwardFileUrl,
				forwardPostId,
				forwardContent,
				forwardNickName,
				longitude,
				latitude,
				locationName,
				ideas,
				notSeeList: tmpNotSeeList,
				seeList: tmpSeeList,
				seeType,
				type,
				thumbnails: videoThumbnailUploadFileData,
			};
			console.log('step 6', JSON.stringify(data));

			let postJournalRes = await postJournal({ data });

			console.log('step 7', postJournalRes);
			await setPostLoading(false);
			await setType('TEXT');
			await setIdeas('');
			navigation.navigate('Home');
		} catch (error) {
			await setPostLoading(false);
			await Toast.show(error, TOAST_INITIAL_OPTIONS);
		}
	};

	const onTextInputFocus = () => {
		setToggleEmoji(0);
	};

	// 处理图片的压缩列表
	const dealWithSelectedImageFiles = async () => {
		let selectedFiles = route.params?.selectFiles;
		let selectedFilesLength = selectedFiles.length;
		let compressImagesUri = await [];
		for (let i = 0; i < selectedFilesLength; i++) {
			let resizedPhoto = await ImageManipulator.manipulateAsync(
				selectedFiles[i].uri,
				[{ resize: { width: UPLOAD_IMAGE_WIDTH } }],
				{
					compress: UPLOAD_IMAGE_COMPRESS,
					format: 'jpeg',
				}
			);
			await compressImagesUri.push(resizedPhoto.uri);
		}
		await setSelectMultiFiles(compressImagesUri);
	};

	// 在压缩图片之前先处理图片展示列表数据
	const dealWithSelectedImageFilesNoCompress = async () => {
		let selectedFiles = route.params?.selectFiles;
		let selectedFilesLength = selectedFiles.length;
		let imagesUri = [];
		for (let i = 0; i < selectedFilesLength; i++) {
			await imagesUri.push(selectedFiles[i].uri);
		}
		await setSelectMultiFilesNoComporess(imagesUri);
	};

	// 生成视图缩略图，需要传递file本地路径
	const generateThumbnail = async (videoFile) => {
		try {
			const { uri } = await VideoThumbnails.getThumbnailAsync(videoFile, {
				time: 1,
			});
			setVideoThumbnail(uri);
		} catch (e) {
			console.warn(e);
		}
	};

	// 从选择文件页面回传参数
	useEffect(() => {
		let selectedFiles = route.params?.selectFiles;
		// 需要有返回的选中文件
		if (selectedFiles && selectedFiles.length > 0) {
			// type 如果为 PICTURE，需要图片压缩
			if (type === 'PICTURE') {
				dealWithSelectedImageFilesNoCompress();
				dealWithSelectedImageFiles();
			} else {
				// 视频
				MediaLibrary.getAssetInfoAsync(selectedFiles[0].id).then(async (res) => {
					await setVideoDuration(res.duration); // 时长
					await generateThumbnail(res.localUri); // 缩略图
					await setSelectMultiFiles([res.localUri]); // 视频地址
				});
			}
		}
	}, [route.params?.selectFiles]);

	const deleteSelectItem = async (index) => {
		console.log(type);
		if (type === 'PICTURE') {
			// 务必对象复制，直接更改将无法再次渲染界面
			let tmp_selectMultiFilesNoComporess = await [...selectMultiFilesNoComporess];
			await tmp_selectMultiFilesNoComporess.splice(index, 1);
			let tmp_selectMultiFiles = await [...selectMultiFiles];
			await tmp_selectMultiFiles.splice(index, 1);

			await setSelectMultiFilesNoComporess(tmp_selectMultiFilesNoComporess);
			await setSelectMultiFiles(tmp_selectMultiFiles);

			if (tmp_selectMultiFilesNoComporess.length === 0) {
				await setType('TEXT');
			}
		} else {
			await setVideoThumbnail('');
			await setSelectMultiFiles([]);
			await setType('TEXT');
		}
	};

	const renderSelectFiles = () => {
		let renderElement = null;
		if (selectMultiFilesNoComporess && selectMultiFilesNoComporess.length > 0 && type === 'PICTURE') {
			renderElement = (
				<ImageList
					cacheImage={false}
					images={selectMultiFilesNoComporess}
					viewContainerWidth={viewContainerWidth}
					deleteItem={deleteSelectItem}
				/>
			);
		} else {
			if (videoThumbnail) {
				renderElement = (
					<View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
						<Image source={{ uri: videoThumbnail }} style={{ width: 200, height: 200, marginBottom: 5 }} />
						<Text>视频时长：{Math.ceil(videoDuration)} 秒</Text>
						<TouchableOpacity
							style={{
								position: 'absolute',
								right: -5,
								top: -5,
								backgroundColor: '#999',
								borderRadius: '50%',
							}}
							onPress={() => {
								deleteSelectItem(0);
							}}
						>
							<AntDesign name='close' size={20} color='white' />
						</TouchableOpacity>
					</View>
				);
			}
		}
		return renderElement;
	};

	const onListMyFriend = async () => {
		const { code, data, message, ok } = await getMyFriends();
		setMyFriendList(data);
	};

	const toggleSeeList = async (userId) => {
		// 如果用户id不在列表中，则push新增
		// 否则，从列表中删除
		let tmpList = [...seeList];
		const pos = seeList.findIndex((item) => item === userId);
		if (pos === -1) {
			tmpList.push(userId);
		} else {
			tmpList.splice(pos, 1);
		}

		setSeeList(tmpList);
	};

	const renderRadioSeeButton = (userId) => {
		const pos = seeList.findIndex((item) => item === userId);
		let renderElement = null;
		if (pos === -1) {
			renderElement = <MaterialCommunityIcons name='radiobox-blank' size={24} color='gray' />;
		} else {
			renderElement = <MaterialCommunityIcons name='radiobox-marked' size={24} color='green' />;
		}
		return renderElement;
	};

	const toggleNotSeeList = async (userId) => {
		// 如果用户id不在列表中，则push新增
		// 否则，从列表中删除
		let tmpList = [...notSeeList];
		const pos = notSeeList.findIndex((item) => item === userId);
		if (pos === -1) {
			tmpList.push(userId);
		} else {
			tmpList.splice(pos, 1);
		}

		setNotSeeList(tmpList);
	};

	const renderRadioNotSeeButton = (userId) => {
		const pos = notSeeList.findIndex((item) => item === userId);
		let renderElement = null;
		if (pos === -1) {
			renderElement = <MaterialCommunityIcons name='radiobox-blank' size={24} color='gray' />;
		} else {
			renderElement = <MaterialCommunityIcons name='radiobox-marked' size={24} color='green' />;
		}
		return renderElement;
	};

	const renderSeeTypeTip = () => {
		let renderElement = '公开';
		switch (seeType) {
			case 'ALL':
				renderElement = '公开';
				break;
			case 'CIRCLE':
				renderElement = '仅朋友圈可见';
				break;
			case 'NEARBY':
				renderElement = '仅附近圈可见';
				break;
			case 'SELECT_SEE':
				renderElement = '选中可见';
				break;
			case 'SELECT_NOT_SEE':
				renderElement = '选中不可见';
				break;
			case 'PRIVATE':
				renderElement = '私密';
				break;
			default:
				renderElement = '公开';
		}
		return renderElement;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Spinner animation='fade' visible={postLoading} size='small' />
			{/* 模态框，处理处理位置选择，隐私权限设置 */}

			<Modal
				backdropOpacity={0.8}
				hasBackdrop={true}
				hideModalContentWhileAnimating={true}
				coverScreen={true}
				useNativeDriver={true}
				isVisible={isModalVisible}
				animationIn='fadeIn'
				animationOut='fadeOut'
			>
				<View style={{ backgroundColor: 'white', height: height / 1.4, borderRadius: 10 }}>
					{/* 地理位置 */}

					{modalType === 'location' && (
						<View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ padding: 10 }}></View>
								<Text
									style={{
										flex: 1,
										paddingTop: 10,
										paddingLeft: 10,
										textAlign: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									选择地点
								</Text>
								<TouchableOpacity
									onPress={() => {
										setModalVisible(false);
									}}
									style={{ padding: 10, justifyContent: 'center', flexDirection: 'row' }}
								>
									<AntDesign name='close' size={24} color='black' />
								</TouchableOpacity>
							</View>

							<View style={{ padding: 10, marginLeft: 20 }}>
								<Text style={{ marginBottom: 20 }}>附近地点</Text>

								<ScrollView style={{ height: height / 2 }}>
									{pois.map((item, index) => {
										return (
											<TouchableOpacity
												key={index}
												onPress={async () => {
													await setLocationName(item.name);
													await setModalVisible(false);
												}}
											>
												<Text style={{ marginTop: 15, marginBottom: 15, fontSize: 16 }}>
													{item.name}
												</Text>
											</TouchableOpacity>
										);
									})}
								</ScrollView>
							</View>
						</View>
					)}

					{/* 隐私设置 */}
					{modalType === 'privacy' && (
						<View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ padding: 10 }}></View>
								<Text
									style={{
										flex: 1,
										paddingTop: 10,
										paddingLeft: 10,
										textAlign: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									发布设置
								</Text>
								<TouchableOpacity
									onPress={() => {
										setModalVisible(false);
										setFriendListVisible(false);
									}}
									style={{ padding: 10, justifyContent: 'center', flexDirection: 'row' }}
								>
									<AntDesign name='close' size={24} color='black' />
								</TouchableOpacity>
							</View>

							<View style={{ padding: 10, marginLeft: 20, marginRight: 20 }}>
								{!isFriendListVisible ? (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}
									>
										<Text style={{ marginBottom: 20 }}>谁可以看</Text>
										<TouchableOpacity
											onPress={() => {
												setModalVisible(false);
											}}
										>
											<Text>保存</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View
										style={{
											marginBottom: 20,
											flexDirection: 'row',
											justifyContent: 'space-between',
										}}
									>
										<TouchableOpacity
											onPress={() => {
												if (seeType === 'SELECT_SEE') {
													setSeeList([]);
												}
												if (seeType === 'SELECT_NOT_SEE') {
													setNotSeeList([]);
												}
												setFriendListVisible(false);
											}}
										>
											<Text>清除</Text>
										</TouchableOpacity>

										<TouchableOpacity
											onPress={() => {
												setFriendListVisible(false);
											}}
										>
											<Text>保存</Text>
										</TouchableOpacity>
									</View>
								)}

								<ScrollView style={{ height: height / 2 }}>
									{!isFriendListVisible ? (
										<View>
											<TouchableOpacity
												style={styles.privacyContainer}
												onPress={() => {
													setSeeType('ALL');
												}}
											>
												<View>
													<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
														公开
													</Text>
													<Text style={{ color: 'gray' }}>
														所有人可见，提醒好友和粉丝，出现在附近
													</Text>
												</View>
												{seeType === 'ALL' && <Feather name='check' size={24} color='black' />}
											</TouchableOpacity>

											<TouchableOpacity
												style={styles.privacyContainer}
												onPress={() => {
													setSeeType('CIRCLE');
												}}
											>
												<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
													只给好友看
												</Text>
												{seeType === 'CIRCLE' && (
													<Feather name='check' size={24} color='black' />
												)}
											</TouchableOpacity>

											<TouchableOpacity
												style={styles.privacyContainer}
												onPress={() => {
													setSeeType('NEARBY');
												}}
											>
												<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
													只给附近的人看
												</Text>
												{seeType === 'NEARBY' && (
													<Feather name='check' size={24} color='black' />
												)}
											</TouchableOpacity>

											<View
												style={{
													flexDirection: 'column',
													padding: 10,
												}}
											>
												<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
													部分可见
												</Text>

												<View style={{ marginLeft: 20 }}>
													<TouchableOpacity
														style={styles.privacyContainer}
														onPress={async () => {
															await setSeeType('SELECT_SEE');
															await onListMyFriend();
															await setFriendListVisible(true);
														}}
													>
														<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
															指定好友
														</Text>
														{seeType === 'SELECT_SEE' && (
															<Feather name='check' size={24} color='black' />
														)}
													</TouchableOpacity>

													<TouchableOpacity
														style={styles.privacyContainer}
														onPress={async () => {
															await setSeeType('SELECT_NOT_SEE');
															await onListMyFriend();
															await setFriendListVisible(true);
														}}
													>
														<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
															不给谁看
														</Text>
														{seeType === 'SELECT_NOT_SEE' && (
															<Feather name='check' size={24} color='black' />
														)}
													</TouchableOpacity>

													<TouchableOpacity
														style={styles.privacyContainer}
														onPress={() => {
															setSeeType('PRIVATE');
														}}
													>
														<Text style={{ fontSize: 16, color: '#333', marginBottom: 5 }}>
															仅自己看
														</Text>
														{seeType === 'PRIVATE' && (
															<Feather name='check' size={24} color='black' />
														)}
													</TouchableOpacity>
												</View>
											</View>
										</View>
									) : (
										<View>
											{seeType === 'SELECT_SEE' &&
												myFriendList.map((item, index) => {
													return (
														<TouchableOpacity
															key={index}
															style={{
																flexDirection: 'row',
																justifyContent: 'space-between',
																alignItems: 'center',
															}}
															onPress={() => {
																toggleSeeList(item.userId);
															}}
														>
															<View
																style={{
																	flexDirection: 'row',
																	alignItems: 'center',
																	marginBottom: 10,
																}}
															>
																<Image
																	source={{ uri: item.avatar }}
																	style={{
																		width: 50,
																		height: 50,
																		resizeMode: 'cover',
																		borderRadius: 50,
																		marginRight: 10,
																	}}
																/>
																<Text>{item.nickName}</Text>
															</View>

															{renderRadioSeeButton(item.userId)}
														</TouchableOpacity>
													);
												})}

											{seeType === 'SELECT_NOT_SEE' &&
												myFriendList.map((item, index) => {
													return (
														<TouchableOpacity
															key={index}
															style={{
																flexDirection: 'row',
																justifyContent: 'space-between',
																alignItems: 'center',
															}}
															onPress={() => {
																toggleNotSeeList(item.userId);
															}}
														>
															<View
																style={{
																	flexDirection: 'row',
																	alignItems: 'center',
																	marginBottom: 10,
																}}
															>
																<Image
																	source={{ uri: item.avatar }}
																	style={{
																		width: 50,
																		height: 50,
																		resizeMode: 'cover',
																		borderRadius: 50,
																		marginRight: 10,
																	}}
																/>
																<Text>{item.nickName}</Text>
															</View>

															{renderRadioNotSeeButton(item.userId)}
														</TouchableOpacity>
													);
												})}
										</View>
									)}
								</ScrollView>
							</View>
						</View>
					)}
				</View>
			</Modal>

			{/* 主界面区域 */}

			<View style={styles.container}>
				{/* 头部 */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
						<Text>取消</Text>
					</TouchableOpacity>

					<View style={styles.headerTextContainer}>
						<Text style={styles.headerText}>发布动态</Text>
					</View>
					{disablePublishBtn ? (
						<TouchableOpacity
							style={[styles.publish, { backgroundColor: '#32afe9' }]}
							onPress={onPublishJournal}
						>
							<Text style={{ color: 'white' }}>发布</Text>
						</TouchableOpacity>
					) : (
						<View style={styles.publish}>
							<Text>发布</Text>
						</View>
					)}
				</View>

				{/* 个人信息 */}
				<TouchableOpacity
					style={styles.userInfoContainer}
					onPress={async () => {
						setModalType('privacy');
						setModalVisible(true);
					}}
				>
					<Image style={styles.avatar} source={require('@/static/006.jpg')}></Image>
					<View style={{ flexDirection: 'column' }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold' }}>子心</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: 5,
							}}
						>
							<Text style={{ color: 'gray' }}>{renderSeeTypeTip()}</Text>
							<Feather name='chevron-right' size={16} color='gray' />
						</View>
					</View>
				</TouchableOpacity>

				{/* 内容输入编辑区域 */}
				<TextInput
					value={ideas}
					style={styles.input}
					multiline
					placeholder='此时此地，想和大家分享什么'
					onChangeText={onChangeTextInput}
					onFocus={onTextInputFocus}
				></TextInput>

				{/* 图片、视频选中内容展示区域 */}

				<View style={styles.selectMultiFilesContainer} onLayout={onViewLayout}>
					{renderSelectFiles()}
				</View>

				{/* 转发 */}
				{type === 'FORWARD' && (
					<View style={{ flexDirection: 'row', backgroundColor: '#e5e5e5', marginBottom: 5 }}>
						<ImageCache
							{...{ IMAGE_LOADING_PLACEHOLDER, uri: forwardFileUrl }}
							style={{ width: 80, height: 80, resizeMode: 'cover' }}
						/>
						<View style={{ marginLeft: 10, marginTop: 10, flex: 1 }}>
							<Text style={{ fontSize: 16 }}>{forwardNickName}</Text>
							<Text style={{ color: 'gray', marginTop: 5, flexWrap: 'wrap' }}>{forwardContent}</Text>
						</View>
						<View style={{ margin: 5 }}>
							<FontAwesome name='share' size={24} color='#ccc' />
						</View>
					</View>
				)}

				{/* 规则说明 */}

				<View style={styles.tipContainer}>
					<Ionicons name='ios-alert' size={24} color='red' />
					<Text style={styles.tipText}>
						尊敬的用户，您发布的内容须遵守相关法律法规和社区规则，请严格遵守相关规定，以免违规。
					</Text>
				</View>

				{/* 地理位置显示区域 */}

				<View style={styles.locationContainer}>
					<View style={styles.location}>
						<Feather name='map-pin' size={18} color={locationName ? '#58ccfd' : 'gray'} />

						<TouchableOpacity
							style={{ color: 'gray', marginLeft: 10, marginRight: 10 }}
							onPress={() => {
								setModalType('location');
								setModalVisible(true);
							}}
						>
							<Text style={{ color: 'gray', flexWrap: 'wrap', marginRight: 16 }}>
								{locationName ? locationName : '你在哪里？'}
							</Text>
						</TouchableOpacity>

						{locationName ? (
							<TouchableOpacity
								onPress={() => {
									setLocationName('');
								}}
							>
								<AntDesign name='close' size={18} color='gray' />
							</TouchableOpacity>
						) : null}
					</View>
					<View style={{ flex: 1 }}></View>
				</View>
				{/* 底部高度控制区 */}
				<View style={{ height: 60 }}></View>

				{/* 图片、视频、表情弹出层区域 */}
				<BottomSheet
					ref={bottomSheetRef}
					initialSnapIndex={0}
					snapPoints={[30, 300]}
					onChange={handleSheetChanges}
				>
					<View style={styles.attachment}>
						{type !== 'FORWARD' && (
							<TouchableOpacity	
								style={styles.attachmentIcon}
								onPress={async () => {
									console.log('+++++++')
									await setSelectMultiFiles([]);
									await setType('PICTURE');
									navigation.push('SelectImageAndVideo', {
										assetsType: 'PICTURE',
										goBackRouteName: 'Journal',
									});
								}}
							>
								<Entypo name='image' size={24} color='#56dec1'/>
							</TouchableOpacity>
						)}

						{type !== 'FORWARD' && (
							<TouchableOpacity
								style={styles.attachmentIcon}
								onPress={async () => {
									await setSelectMultiFiles([]);
									await setType('VIDEO');
									await navigation.push('SelectImageAndVideo', {
										assetsType: 'VIDEO',
										goBackRouteName: 'Journal',
									});
								}}
							>
								<Entypo name='camera' size={24} color='#ff737f' />
							</TouchableOpacity>
						)}

						<TouchableOpacity
							style={styles.attachmentIcon}
							onPress={() => {
								setToggleEmoji(!toggleEmoji);
							}}
						>
							<Entypo name='emoji-happy' size={24} color='#58ccfd' />
						</TouchableOpacity>
					</View>
					{toggleEmoji === true && (
						<EmojiSelector
							showHistory={true}
							placeholder='搜索'
							columns={8}
							showSectionTitles={false}
							category={Categories.emotion}
							onEmojiSelected={(emoji) => onChangeTextInputEmoji(emoji)}
						/>
					)}
				</BottomSheet>
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1, marginLeft: 20, marginRight: 20 },
	header: {
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10,
	},
	cancel: {
		backgroundColor: '#ddd',
		padding: 5,
		paddingRight: 10,
		paddingLeft: 10,
		borderRadius: 5,
	},
	publish: {
		backgroundColor: '#ddd',
		padding: 5,
		paddingRight: 10,
		paddingLeft: 10,
		borderRadius: 5,
	},
	headerTextContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	headerText: {
		paddingTop: 5,
		fontSize: 18,
		fontWeight: 'bold',
	},

	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10,
	},
	avatar: {
		borderColor: 'gray',
		borderWidth: 0.5,
		width: 40,
		height: 40,
		borderRadius: 40,
		marginRight: 10,
	},
	input: {
		flex: 1,
		padding: 5,
	},
	tipContainer: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#ddd',
	},
	tipText: {
		lineHeight: 18,
		marginLeft: 5,
		color: '#999',
		width: '95%',
	},
	locationContainer: {
		flexDirection: 'row',
		marginTop: 5,
	},
	location: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e5e5e5',
		borderRadius: 10,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	attachment: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	attachmentIcon: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectMultiFilesContainer: {
		marginTop: 5,
		marginBottom: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	privacyContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
	},
});
export default Journal;
