import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native'
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons'
import UserInfo from './UserInfo';


/* 
{
	"userId": 2,
	"nickName": "qq",
	"avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
	"sex": "MAN",
	"signature": "I’m chinavane",
	"age": 20,
	"isVip": 0,
	"pictures": [
		"https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/f5176fe3-174d-4ebe-8fb2-74ef3f771235.jpg",
		"https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/7a671b52-58cc-4621-a194-ca8f04b73c6e.jpg"
	]
},
*/

const PersonItem = ({userInfo}) => {

	const navagation = useNavigation()

	return (
		<TouchableOpacity style={styles.container} onPress={() => navagation.push('Chat', {userInfo})}>
				<UserInfo {...userInfo} avatarStyle={{ width: 65, height: 65 }}>
					<FontAwesome name='angle-right' size={24} color='#adaeaf' />
				</UserInfo>
		</TouchableOpacity>
		
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

export default PersonItem;
