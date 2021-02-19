import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ImageList from './ImageList';
import UserInfo from './UserInfo';

/* 
	{
    "age": 10,
    "avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    "isVip": 0,
    "nickName": "晴天_34",
    "pictures": Array [
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    ],
    "sex": "WOMAN",
    "signature": "爱拼才会赢",
    "userId": 46,
  }
*/
const LikePeopleItem = (props) => {
	const {pictures} = props
	const [viewContainerWidth, setViewContainerWidth] = useState(0);
	// 获取内容区宽度
	const onViewLayout = ({
		nativeEvent: {
			layout: { width },
		},
	}) => {
		setViewContainerWidth(width);
	};

	return (
		<View style={styles.container}>
			<UserInfo {...props} avatarStyle={{ width: 65, height: 65 }}>
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

export default LikePeopleItem;
