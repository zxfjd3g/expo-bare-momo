import React from 'react';
import { Image, View, Text, StyleSheet, ViewPropTypes, TextPropTypes, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import { useNavigation, useRoute } from '@react-navigation/native';

import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';

/*
* 性别年龄元素必定显示，所以需要传递性别与年龄，但如果没有级别，将不显示级别信息
* 参数说明
@param avatar 							optional 			头像
@param avatarContainerStyle 			optional 			头像容器样式，主要处理阴影等样式
@param avatarStyle 						optional 			头像图片样式，主要控制图片大小样式

@param sex 								required 	WOMAN 	性别：MAN,WOMAN
@param sexContainerStyle 				optional 			性别容器样式，主要处理背景等样式
@param sexTextStyle 					optional 			性别文本样式，主要控制文本颜色样式

@param age 								required 	18		年龄

@param isVip 							optional 			是否为Vip
@param isVipContainerStyle 				optional 			是否为Vip容器样式，主要处理背景等样式
@param isVipTextStyle 					optional 			是否为Vip文本样式，主要控制文本颜色样式


@param nickName 						required 			用户昵称
@param nickNameTextStyle 				optional 			用户昵称文本样式，主要控制文本颜色样式

@param signature 						    optional 			简短介绍
@param signatureTextStyle 					optional 			简短介绍文本样式，主要控制文本颜色样式

@param children 						optional 			嵌套元素

*/
/*
View.propTypes.style
Text.propTypes.style
*/

const UserInfo = ({
	avatar,
	avatarContainerStyle,
	avatarStyle,
	sex,
	sexContainerStyle,
	sexTextStyle,
	age,
	isVip,
	isVipContainerStyle,
	isVipTextStyle,
	nickName,
	nickNameTextStyle,
	signature,
	signatureTextStyle,
	children,
}) => {
	const navigation = useNavigation();
	const route = useRoute();

	if (sex === 'MAN') sexContainerStyle = { backgroundColor: '#58a1f5' };
	return (
		<View style={styles.header}>
			<TouchableOpacity
				style={styles.avatarAndUserMsg}
				// onPress={() => {
				// 	navigation.navigate('ViewUserDetail');
				// }}
			>
				{/* 头像*/}
				{avatar ? (
					<View style={avatarContainerStyle}>
						<ImageCache
							{...{ IMAGE_LOADING_PLACEHOLDER, uri: avatar }}
							style={[styles.avatar, avatarStyle]}
						/>
					</View>
				) : null}
				{/* 用户信息 */}
				<View style={styles.userMsg}>
					{/* 用户名称 */}
					<Text style={[styles.nickName, nickNameTextStyle]}>{nickName}</Text>
					{/* 性别年龄与级别 */}
					<View style={[styles.sexAgeAndisVip]}>
						{/* 性别年龄 */}
						<View style={[styles.sex, sexContainerStyle]}>
							<FontAwesome name={sex === 'MAN' ? 'male' : 'female'} size={12} style={sexTextStyle} />
							<Text style={[styles.sexAgeAndisVipFont, sexTextStyle]}>{age}</Text>
						</View>
						{/* 级别 */}
						{isVip ? (
							<View style={[styles.isVip, isVipContainerStyle]}>
								<Text style={[styles.sexAgeAndisVipFont, isVipTextStyle]}>VIP</Text>
							</View>
						) : null}
					</View>
					{/* 简介 */}
					{signature ? <Text style={[styles.signature, signatureTextStyle]}>签名: {signature}</Text> : null}
				</View>
			</TouchableOpacity>
			{/* 右侧元素 */}
			<View style={styles.operate}>{children}</View>
		</View>
	);
};

UserInfo.propTypes = {
	avatarContainerStyle: ViewPropTypes.style,
	avatarStyle: Image.propTypes.style,

	sex: PropTypes.oneOf(['MAN', 'WOMAN', 'UNKNOWN']).isRequired,
	sexContainerStyle: ViewPropTypes.style,
	sexTextStyle: Text.propTypes.style,

	age: PropTypes.number.isRequired,

	isVip: PropTypes.number,
	isVipContainerStyle: ViewPropTypes.style,
	isVipTextStyle: Text.propTypes.style,

	nickName: PropTypes.string.isRequired,
	nickNameTextStyle: Text.propTypes.style,

	signatureTextStyle: Text.propTypes.style,
};

UserInfo.defaultProps = {
	sex: 'WOMAN',
	age: 18,
	isVip: 0,
	nickName: '匿名',
	avatarContainerStyle: {
		shadowColor: '#000',
		shadowOffset: {
			width: 1,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 2,

		elevation: 2,
	},
	avatarStyle: {},
	sexContainerStyle: {
		backgroundColor: '#E18CB6',
	},
	sexTextStyle: {
		color: 'white',
	},
	isVipContainerStyle: {
		backgroundColor: '#EB9450',
	},
	isVipTextStyle: {
		color: '#fff',
	},
	nickNameTextStyle: {
		color: '#333',
	},
	signatureTextStyle: {
		color: '#b3b4b5',
	},
};

const styles = StyleSheet.create({
	// 头部
	header: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	avatarAndUserMsg: {
		flexDirection: 'row',
	},
	operate: {
		flexDirection: 'column',
		justifyContent: 'center',
	},
	// 头像
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
		resizeMode: 'cover',
	},
	// 用户信息
	userMsg: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: 10,
	},
	// 用户名称
	nickName: {
		fontWeight: 'bold',
		marginBottom: 5,
	},
	signature: {
		marginTop: 5,
		fontSize: 12,
	},
	// 性别年龄与等级
	sexAgeAndisVip: {
		flexDirection: 'row',
	},
	sex: {
		borderRadius: 8,
		paddingRight: 5,
		paddingLeft: 5,
		paddingTop: 2,
		paddingBottom: 2,
		flexDirection: 'row',
	},
	isVip: {
		marginLeft: 5,
		borderRadius: 8,
		paddingRight: 5,
		paddingLeft: 5,
		paddingTop: 2,
		paddingBottom: 2,
	},
	sexAgeAndisVipFont: {
		marginLeft: 2,
		marginRight: 2,
		fontSize: 10,
	},
});

export default UserInfo;
