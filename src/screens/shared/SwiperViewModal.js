import React, { useEffect, useState, useRef } from 'react';
import {
	View,
	Image,
	StyleSheet,
	SafeAreaView,
	Dimensions,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Pagination } from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import { Feather } from '@expo/vector-icons';

import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';
import UserInfo from '@/components/UserInfo';
import OperateBar from '@/components/OperateBar';

const { width, height } = Dimensions.get('window');

// const isIos = Platform.OS === 'ios' ? true : false;

/* 
图片轮播查看
*/
const SwiperViewModal = (props) => {
	const navigation = useNavigation();
	const route = useRoute();
	const { images, index, userMsg, operate, cacheImage = true } = route.params;

	const [slideIndex, setSlideIndex] = useState(index);
	useEffect(() => {
		navigation.setOptions({
			header: (props) => (
				<View style={styles.header}>
					<View style={styles.btnBack}>
						<TouchableOpacity
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Feather name='x' size={24} color='gray' />
						</TouchableOpacity>
					</View>
					{userMsg && (
						<UserInfo {...userMsg}>
							<Feather name='more-vertical' size={24} color='#adaeaf' />
						</UserInfo>
					)}
				</View>
			),
		});
	}, []);

	const _renderItem = ({ item, index }) => {
		return (
			<ImageZoom cropWidth={width} cropHeight={height} imageWidth={width} imageHeight={height}>
				{cacheImage ? (
					<ImageCache
						style={{
							flex: 1,
							width: width - 20,
							height,
							resizeMode: 'cover',
							borderRadius: 10,
						}}
						{...{ IMAGE_LOADING_PLACEHOLDER, uri: item }}
					/>
				) : (
					<Image
						style={{
							flex: 1,
							width: width - 20,
							height,
							resizeMode: 'cover',
							borderRadius: 10,
						}}
						source={{ uri: item }}
					/>
				)}
			</ImageZoom>
		);
	};

	const paginationDot = () => {
		return (
			<Pagination
				dotsLength={images.length}
				activeDotIndex={slideIndex}
				dotStyle={{
					width: 5,
					height: 5,
					borderRadius: 5,
					marginHorizontal: 8,
					backgroundColor: '#fff',
				}}
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
			/>
		);
	};

	const _onSnapToItem = (slideIndex) => {
		setSlideIndex(slideIndex);
	};
	return (
		<SafeAreaView 
			style={styles.container}
			loop={true}
			data={images}
			sliderWidth={width}
			itemWidth={width}
			renderItem={_renderItem}
			firstItem={index}
			layout={'stack'}
			layoutCardOffset={9}
			onSnapToItem={_onSnapToItem}
			hasParallaxImages={true}
			layout={'stack'}
		>
			{paginationDot()}
			{operate && <OperateBar {...operate} />}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'space-between', backgroundColor: '#0d0e0f' },
	header: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		// marginTop: isIos && Constants.statusBarHeight,
		marginTop: 0,
		padding: 5,
	},
	btnBack: { flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 10 },
});

export default SwiperViewModal;
