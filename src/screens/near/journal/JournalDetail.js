import React, { useState, useEffect, useRef } from 'react';
import {
	Image,
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	Dimensions,
	TextInput,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import { FontAwesome, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Video, Audio } from 'expo-av';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Animatable from 'react-native-animatable';

import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
import ImageList from '@/components/ImageList';
import UserInfo from '@/components/UserInfo';
import OperateBar from '@/components/OperateBar';
import { useKeyboard } from '@/hooks/useKeyboard';
import { getStatusBarHeight } from '@/utils/util';

const { width, height } = Dimensions.get('window');

const JournalDetail = ({ id }) => {
	const navigation = useNavigation();
	const route = useRoute();

	const refComment = useRef(null);
	const [videoUri, setVideoUri] = useState('');
	const [isModalVisible, setModalVisible] = useState(false);
	const [toggleInputContainer, setToggleInputContainer] = useState(false);

	const keyboardVerticalOffset = getStatusBarHeight();

	const [{ data, loading, error }, getJournalDetail] = useAxios(
		{
			method: 'GET',
			url: requestApi.getJournalDetail + `/` + route.params?.id,
		},
		{ manual: true }
	);

	const [viewContainerWidth, setViewContainerWidth] = useState(0);

	const onKeyboardWillHide = () => {
		setToggleInputContainer(false);
	};

	useEffect(() => {
		// 开启音乐播放模式，不开启，视频将无声
		const enableAudio = async () => {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
				playsInSilentModeIOS: true,
				staysActiveInBackground: false,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
				shouldDuckAndroid: false,
			});
		};
		enableAudio();

		Keyboard.addListener('keyboardWillHide', onKeyboardWillHide);
		return () => {
			Keyboard.removeListener('keyboardWillHide', onKeyboardWillHide);
		};
	}, []);

	// 获取内容区宽度
	const onViewLayout = ({
		nativeEvent: {
			layout: { width },
		},
	}) => {
		setViewContainerWidth(width);
	};

	useEffect(() => {
		getJournalDetail();
	}, [route.params?.id]);

	if (data && data.id) {
		const {
			id,
			userBaseInfo,
			commentCount,
			distance,
			fileUrls,
			forwardFileUrl,
			forwardPostId,
			forwardContent,
			forwardNickName,
			ideas,
			isPraise,
			locationName,
			postTime,
			praiseCount,
			seeCount,
			type,
			thumbnails,
			postTimeString,
		} = data;

		const playVideo = (uri) => {
			setVideoUri(uri);
			setModalVisible(true);
		};

		const renderVideo = () => {
			if (thumbnails.trim().length !== 0) {
				return (
					<TouchableOpacity onPress={() => playVideo(fileUrls)}>
						<ImageCache
							{...{ IMAGE_LOADING_PLACEHOLDER, uri: thumbnails }}
							style={{ width: 200, height: 250, resizeMode: 'cover' }}
						/>
						<Feather
							name='video'
							size={30}
							color='white'
							style={{ position: 'absolute', top: 115, left: 85 }}
						/>
					</TouchableOpacity>
				);
			}
		};

		return (
			<SafeAreaView style={styles.container}>
				{/* 视频播放模态框 */}
				<Modal
					backdropOpacity={0.8}
					hasBackdrop={true}
					hideModalContentWhileAnimating={true}
					coverScreen={true}
					useNativeDriver={true}
					isVisible={isModalVisible}
					animationIn='fadeIn'
					animationOut='fadeOut'
					swipeDirection={['down']}
					onSwipeComplete={() => {
						setModalVisible(false);
					}}
					style={{ justifyContent: 'center', alignItems: 'center' }}
				>
					<View
						style={{
							width: width,
							height: height,
						}}
					>
						<Video
							source={{ uri: videoUri }}
							rate={1.0}
							volume={1.0}
							isMuted={false}
							resizeMode='cover'
							shouldPlay
							useNativeControls
							style={{ width, height }}
						/>
					</View>
				</Modal>

				<TouchableOpacity
					style={styles.stickBtnContainer}
					onPress={async () => {
						await setToggleInputContainer(true);
						await refComment.current.focus();
					}}
				>
					<View style={{ backgroundColor: 'white', borderRadius: 24, padding: 5, marginRight: 5 }}>
						<FontAwesome name='pencil-square-o' size={24} color='gray' />
					</View>
					<Text>评论</Text>
				</TouchableOpacity>

				<View style={{ flex: 1, flexDirection: 'column' }}>
					<View style={{ flex: 1 }}>
						{/* 头部 */}
						<View style={styles.headerContainer}>
							<TouchableOpacity
								onPress={() => {
									navigation.goBack();
								}}
							>
								<Feather
									name='chevron-left'
									size={32}
									color='#999'
									style={{ paddingLeft: 10, paddingRight: 10 }}
								/>
							</TouchableOpacity>
							<UserInfo {...data.userBaseInfo}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<View
										style={{
											backgroundColor: '#4cd1fc',
											paddingTop: 5,
											paddingBottom: 5,
											paddingLeft: 10,
											paddingRight: 10,
											borderRadius: 5,
										}}
									>
										<Text style={{ color: 'white' }}>关注</Text>
									</View>
									<Feather name='more-vertical' size={24} color='#999' />
								</View>
							</UserInfo>
						</View>

						{/* 内容 */}
						<View style={styles.content} onLayout={onViewLayout}>
							<TouchableOpacity onPress={() => navigation.navigate('JournalDetail', { id })}>
								<Text style={styles.contentText}>{ideas}</Text>
							</TouchableOpacity>
							{/* 转发 */}
							{type === 'FORWARD' && (
								<View style={{ flexDirection: 'row', backgroundColor: '#e5e5e5', marginBottom: 5 }}>
									<ImageCache
										{...{ IMAGE_LOADING_PLACEHOLDER, uri: forwardFileUrl }}
										style={{ width: 80, height: 80, resizeMode: 'cover' }}
									/>
									<View style={{ marginLeft: 10, marginTop: 10, flex: 1 }}>
										<Text style={{ fontSize: 16 }}>{forwardNickName}</Text>
										<Text style={{ color: 'gray', marginTop: 5, flexWrap: 'wrap' }}>
											{forwardContent}
										</Text>
									</View>
									<View style={{ margin: 5 }}>
										<FontAwesome name='share' size={24} color='#ccc' />
									</View>
								</View>
							)}

							{/* 图片列表 */}
							{type === 'PICTURE' && (
								<ImageList
									images={fileUrls.split(',')}
									viewContainerWidth={viewContainerWidth}
									userMsg={userBaseInfo}
									operate={{
										commentCount,
										praiseCount,
										seeCount,
										fileUrls,
										thumbnails,
										ideas,
										id,
										nickName: userBaseInfo.nickName,
										type,
									}}
								/>
							)}

							{type === 'VIDEO' && renderVideo()}

							{/* 时间与定位 */}
							<Text style={styles.timeAndLocation}>
								{postTimeString} ‧ {locationName}
							</Text>
						</View>
						{/* 分隔线 */}
						<View style={styles.divider}></View>
						{/* 底部 */}
						<OperateBar
							commentCount={commentCount}
							praiseCount={praiseCount}
							seeCount={seeCount}
							id={id}
							fileUrls={fileUrls}
							thumbnails={thumbnails}
							ideas={ideas}
							nickName={userBaseInfo.nickName}
							type={type}
							isPraise={isPraise}
						/>
					</View>

					{toggleInputContainer && (
						<KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={keyboardVerticalOffset}>
							<Animatable.View
								useNativeDriver={true}
								duration={100}
								animation='flipInX'
								style={{ backgroundColor: '#eee', paddingLeft: 10, paddingRight: 10 }}
							>
								<TextInput ref={refComment} placeholder='发布评论' style={{ height: 50 }} />
							</Animatable.View>
						</KeyboardAvoidingView>
					)}
				</View>
			</SafeAreaView>
		);
	}

	return (
		<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
			<Spinner animation='fade' visible={true} />
			<Text>数据加载中...</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'white' },
	headerContainer: {
		flexDirection: 'row',
		paddingRight: 15,
		alignItems: 'center',
	},
	// 内容
	content: {
		margin: 20,
	},
	contentText: {
		color: '#363738',
		fontWeight: '100',
		lineHeight: 20,
		marginBottom: 10,
	},
	// 内容图片
	contentImages: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 10,
	},
	contentImgItem: {
		resizeMode: 'cover',
		margin: 3,
	},
	// 时间位置
	timeAndLocation: {
		color: '#a0a1a2',
		marginTop: 10,
	},
	// 分隔线
	divider: {
		marginTop: 10,
		borderBottomColor: '#f0f0f0',
		borderBottomWidth: 0.5,
		width: '100%',
	},
	// 操作
	operate: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	operateItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	operateItemIcon: {
		marginRight: 5,
		color: '#adaeaf',
	},
	operateItemText: { color: '#adaeaf' },
	stickBtnContainer: {
		position: 'absolute',
		bottom: 40,
		right: 30,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 20,
		zIndex: 1,
	},
});
export default JournalDetail;
