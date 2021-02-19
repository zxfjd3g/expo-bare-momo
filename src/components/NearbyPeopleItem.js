import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import ImageList from './ImageList';
import UserInfo from './UserInfo';

/* 
{
      "userBaseInfo": {
        "userId": 35,
        "nickName": "晴天_23",
        "avatar": "https://shejiao-fliecd-2feb-4211-8e9e-b00e2911df67.jpg",
        "sex": "WOMAN",
        "signature": "爱拼才会赢",
        "age": 10,
        "isVip": 0
      },
      "distance": 7.4,
      "locationName": "北海公园_35"
}
*/
const NearbyPeopleItem = ({
	userBaseInfo: {pictures, ...userInfo},
	distance,
	locationName,
}) => {
	const [viewContainerWidth, setViewContainerWidth] = useState(0);
	// 获取内容区宽度
	const onViewLayout = ({
		nativeEvent: {
			layout: { width },
		},
	}) => {
		setViewContainerWidth(width);
	};

	// const userMsg = {
	// 	nickName,
	// 	avatar,
	// 	age,
	// 	sex,
	// 	isVip,
	// 	signature
	// }

	return (
		<View style={styles.container}>
			<UserInfo {...userInfo} avatarStyle={{ width: 65, height: 65 }}>
				<Text style={styles.message}>
					{distance}米
					{locationName && '   '}
					{locationName}
				</Text>
			</UserInfo>
			{/* 内容 */}
			{pictures && pictures.length ? (
				<View style={styles.content} onLayout={onViewLayout}>
					<ImageList
						images={pictures}
						viewContainerWidth={viewContainerWidth}
						twoImagesOffset={10}
						threeImagesOffset={10}
					/>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		padding: 15,
		backgroundColor: '#fff',
	},
	message: {
		color: '#b3b4b5',
	},
	content: {
		marginLeft: 75,
	},
});

export default NearbyPeopleItem;
