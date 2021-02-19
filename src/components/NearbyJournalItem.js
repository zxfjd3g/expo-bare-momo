import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';

import ImageList from './ImageList';
import UserInfo from './UserInfo';
import OperateBar from './OperateBar';

const NearbyJournalItem = ({
	id,
	index,
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
	playVideo,
	postTimeString,
}) => {
	const navigation = useNavigation();
	const route = useRoute();

	const [viewContainerWidth, setViewContainerWidth] = useState(0);
	// 获取内容区宽度
	const onViewLayout = ({
		nativeEvent: {
			layout: { width },
		},
	}) => {
		setViewContainerWidth(width);
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
		<View style={styles.container} onLayout={onViewLayout}>
			{/* 头部 */}

			<UserInfo {...userBaseInfo}>
				<Feather name='more-vertical' size={24} color='#adaeaf' />
			</UserInfo>
			{/* 内容 */}
			<View style={styles.content}>
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
							<Text style={{ color: 'gray', marginTop: 5, flexWrap: 'wrap' }}>{forwardContent}</Text>
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
							isPraise,
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
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		padding: 15,
		marginBottom: 5,
		backgroundColor: '#fff',
	},
	// 内容
	content: {
		marginTop: 10,
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
});

export default NearbyJournalItem;
