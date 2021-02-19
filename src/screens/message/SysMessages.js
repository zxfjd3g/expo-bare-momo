import React, {useState, useEffect} from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import UserInfo from '@/components/UserInfo'

import {getSysMessages} from '@/redux/actions'

const SysMessages = ({targetId, messages, getSysMessages}) => {
	const navigation = useNavigation();

	useEffect(() => {

		navigation.dangerouslyGetParent().setOptions({
			tabBarVisible: false,
		});

		const getSysMsgs = async () => {
			getSysMessages('1')
		}
		getSysMsgs()

		return () => {
			navigation.dangerouslyGetParent().setOptions({
				tabBarVisible: true,
			});
		}
	}, []);

	console.log('Message messages', messages, targetId)
	
	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={messages}
				keyExtractor={(item, index) => item.messageId.toString()}
				renderItem={({ item, index }) => {
					const {
						messageType,
						postId,
						user
					} = JSON.parse(item.content.extra)

					return (
						<TouchableOpacity
							onPress={() => {
								if (postId) {
									navigation.navigate('JournalDetail', { id: postId })
								}
							}}
						>
							<UserInfo {...user}>
								<Text>{item.content.content}</Text>
							</UserInfo>
						</TouchableOpacity>
					);
				}}
			/>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default connect(
	state => ({
		targetId: state.chat.targetId,
		messages: state.chat.messages
	}), 
	{
		getSysMessages
	}
)(SysMessages);

/* 
{
    "content": {
        "content": "文本消息",
        "extra": "{\"messageType\":\"0\",\"postId\":\"5ffcf9f62397e96fe909ca05\",\"user\":{\"age\":20,\"avatar\":\"https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg\",\"isVip\":0,\"nickName\":\"chinavane\",\"pictures\":[\"https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/f5176fe3-174d-4ebe-8fb2-74ef3f771235.jpg\",\"https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/7a671b52-58cc-4621-a194-ca8f04b73c6e.jpg\"],\"sex\":\"WOMAN\",\"signature\":\"I’m chinavane\",\"userId\":113}}",
        "objectName": "RC:TxtMsg"
    },
    "conversationType": 6,
    "extra": null,
    "messageDirection": 2,
    "messageId": 65,
    "messageUId": "BN7P-0TOV-M7OO-1FGJ",
    "objectName": "RC:TxtMsg",
    "receivedStatus": 0,
    "receivedTime": 1611657231078,
    "senderUserId": "1",
    "sentStatus": 30,
    "sentTime": 1611657239678,
    "targetId": "1"
}
*/