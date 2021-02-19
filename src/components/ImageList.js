import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import PropTypes from 'prop-types';
import { FontAwesome, Feather, Ionicons, AntDesign, Entypo } from '@expo/vector-icons';

import { IMAGE_URL_PREFIX, IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';

/*
* 图片列表的显示
* 参数说明
@param images 					required 	[] 	图片
@param viewContainerWidth 		required 	0	图片列表容器宽度
@param twoImagesOffset 			optional 		双图偏移量
@param threeImagesOffset 		optional 		三图偏移量
@cacheImage 					options 		是否缓存图片
*/

const ImageList = ({
	images,
	viewContainerWidth,
	twoImagesOffset,
	threeImagesOffset,
	userMsg,
	operate,
	cacheImage,
	deleteItem,
}) => {
	const navigation = useNavigation();

	// 计算图片宽高样式对象
	const calculateImageStyle = (numbers) => {
		let styles = {
			width: 0,
			height: 0,
		};
		if (numbers === 1) {
			styles = {
				width: viewContainerWidth / 1.5,
				height: (viewContainerWidth / 1.5) * 1.25,
			};
		} else if (numbers === 2) {
			styles = {
				width: viewContainerWidth / 2 - twoImagesOffset,
				height: viewContainerWidth / 2 - twoImagesOffset,
			};
		} else if (numbers >= 3) {
			styles = {
				width: viewContainerWidth / 3 - threeImagesOffset,
				height: viewContainerWidth / 3 - threeImagesOffset,
			};
		}
		return styles;
	};

	const showSwiperViewModal = (index) => {
		navigation.navigate('SwiperViewModal', { index, images, userMsg, operate, cacheImage });
	};

	// 渲染图片
	const renderImages = (images) => {
		if (viewContainerWidth === 0) {
			return null;
		}
		const imageList = [];
		const imagesLength = images.length;
		for (let i = 0; i < imagesLength; i++) {
			imageList.push(
				<View key={i}>
					<TouchableOpacity onPress={() => showSwiperViewModal(i)}>
						{cacheImage ? (
							<ImageCache
								{...{ IMAGE_LOADING_PLACEHOLDER, uri: images[i] }}
								style={[styles.contentImgItem, calculateImageStyle(imagesLength)]}
							/>
						) : (
							<Image
								source={{ uri: images[i] }}
								style={[styles.contentImgItem, calculateImageStyle(imagesLength)]}
							/>
						)}
					</TouchableOpacity>

					{deleteItem && (
						<TouchableOpacity
							style={{
								position: 'absolute',
								right: 0,
								top: -2,
								backgroundColor: '#999',
								borderRadius: '50%',
							}}
							onPress={() => {
								deleteItem(i);
							}}
						>
							<AntDesign name='close' size={20} color='white' />
						</TouchableOpacity>
					)}
				</View>
			);
		}
		return <View style={styles.contentImages}>{imageList}</View>;
	};

	return <>{renderImages(images)}</>;
};

ImageList.propTypes = {
	images: PropTypes.array.isRequired,
	viewContainerWidth: PropTypes.number.isRequired,
	twoImagesOffset: PropTypes.number,
	threeImagesOffset: PropTypes.number,
};

ImageList.defaultProps = {
	images: [],
	viewContainerWidth: 0,
	twoImagesOffset: 30,
	threeImagesOffset: 20,
	cacheImage: true,
};

const styles = StyleSheet.create({
	contentImages: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	contentImgItem: {
		resizeMode: 'cover',
		margin: 3,
	},
});

export default ImageList;
