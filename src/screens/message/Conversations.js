import React, {useState, useEffect} from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import { Image as ImageCache } from 'react-native-expo-image-cache';
import dayjs from 'dayjs'

import voice from '@/static/svg/voice.svg'
import {getCS} from '@/redux/actions'
import {axios} from '@/api/request'
import requestApi from '@/api/requestApi'
import { IMAGE_LOADING_PLACEHOLDER } from '@/constant/env';

const Conversations = ({userId, conversations, getCS}) => {
	console.log('Conversations init()')
	const navigation = useNavigation();
	const [users, setUsers] = useState([])

	useEffect(() => {
		const getConversations = async () => {
			const conversations = await getCS()
			
			const ids = conversations.map(c => userId==c.targetId ? c.senderUserId*1 : c.targetId*1)
			console.log('---Conversations conversations44', conversations, ids)
			const {data} = await axios({
				url: requestApi.getUserList,
				method: 'POST',
				data: ids,
			})
			console.log('---Conversations users22', data)

			setUsers(data)
		}
		getConversations()
	}, []);

	console.log('Conversations conversations', conversations)
	
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>消息</Text>
				<Feather name='users' size={24} color='gray' onPress={() => navigation.push('FriendFollowFan', {})}/>
			</View>

			<FlatList
				data={users}
				keyExtractor={(item, index) => item.userId.toString()}
				renderItem={({ item, index }) => {
					const {latestMessage, receivedTime, sentTime, unreadMessageCount} = conversations[index]
					return (
						<TouchableOpacity
							onPress={() => {
								// rmConversation(conversations[index].targetId)
								navigation.navigate('Chat', {userInfo: item});
							}}
						>
							<View>
								<ImageCache
									{...{ IMAGE_LOADING_PLACEHOLDER, uri: item.avatar }}
									style={[styles.avatar]}
								/>
								<Text>用户名:{item.nickName}</Text>
								<Text>最后消息: {latestMessage.content}</Text>
								<Text>时间: {dayjs(sentTime).format('M-DD')}</Text>
								<Text>未读数量: {unreadMessageCount}</Text>
							</View>
						</TouchableOpacity>
					);
				}}
				ListHeaderComponent={() => {
					return (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('SysMessages');
							}}
						>
							<ImageCache
								{...{ IMAGE_LOADING_PLACEHOLDER, uri: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1006811894,971433358&fm=26&gp=0.jpg' }}
								style={[styles.avatar]}
							/>
							<Text>互动消息</Text>
							<Text>暂无最新消息</Text>
						</TouchableOpacity>
					)
				}}
			/>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { flexDirection: 'row', justifyContent: 'space-between', margin: 10 },

	avatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
		resizeMode: 'cover',
	}

});

export default connect(
	state => ({
		userId: state.user.userInfo.userId,
		conversations: state.chat.conversations
	}), 
	{getCS}
)(Conversations);
