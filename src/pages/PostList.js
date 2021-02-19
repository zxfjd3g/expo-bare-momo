import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';

import NearbyJournalItem from '@/components/NearbyJournalItem';
import useAxios from '@/api/request';
import { Video, Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

function PostList({apiPath}) {
	console.log('PostList', apiPath)
	const navigation = useNavigation();
	const route = useRoute();

	const [list, setList] = useState([]);
	const [isModalVisible, setModalVisible] = useState(false);
	const [videoUri, setVideoUri] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [refreshing, setRefreshing] = useState(false);
	const [reset, setReset] = useState(false);

	const [{ data, loading, error }, getList] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

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
	}, []);

	useEffect(() => {
		const getListData = async () => {
			if (reset) {
				let { code, data, message, ok } = await getList({
					url: apiPath + `/1/${limit}`,
				});
				console.log('----PostList', apiPath, data.records)

				await setList((list) => {
					return [data.records];
				});
				setPage(1);
				setReset(false);
			} else {
				let { code, data, message, ok } = await getList({
					url: apiPath + `/${page}/${limit}`,
				});
				console.log('----reset PostList', apiPath, data.records)
				await setList((list) => {
					return [...list, ...data.records];
				});
			}
		};

		getListData();
	}, [page]);

	if (error) {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Text>{error}</Text>
			</View>
		);
	}

	const playVideo = (uri) => {
		setVideoUri(uri);
		setModalVisible(true);
	};

	const onRefreshData = async () => {
		await setReset(true);
		await setPage((page) => page + 1);
	};

	const onLoadMoreData = async () => {
		await setPage((page) => page + 1);
	};

	const renderListFooterComponent = () => {
		return (
			<TouchableOpacity
				style={{ height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
				onPress={onLoadMoreData}
			>
				{loading && <ActivityIndicator size='small' style={{ marginRight: 10 }} />}
				{data && data.length !== 0 && <Text>点击加载更多数据</Text>}
			</TouchableOpacity>
		);
	};

	const renderListEmptyComponent = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Text>暂无数据，请稍后...</Text>
			</View>
		);
	};

	if (list && list.length > 0) {
		return (
			<>
				<FlatList
					ListEmptyComponent={renderListEmptyComponent}
					ListFooterComponent={renderListFooterComponent}
					refreshing={refreshing}
					onRefresh={onRefreshData}
					data={list}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={({ item, index }) => {
						return <NearbyJournalItem {...item} index={index} playVideo={playVideo} />;
					}}
				/>
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
			</>
		);
	} else {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Text>数据加载中...</Text>
			</View>
		);
	}
}

export default PostList;
