import React, { useRef, useState, useEffect, useContext } from 'react';
import {connect} from 'react-redux'
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from 'react-native';
import { ChatScreen } from 'react-native-easy-chat-ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { sendTextMsg } from '@/rongcloud';
import {getMessages, addMessage, sendReadMsg} from '@/redux/actions'
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')
const panelSource = [
	{
		icon: <FastImage source={require('@/static/photo.png')} style={{ width: 30, height: 30 }} />,
		title: '照片',
	}, {
		icon: <FastImage source={require('@/static/camera.png')} style={{ width: 30, height: 30 }} />,
		title: '拍照'
	}
]

const Chat = ({userInfo, messages, getMessages, addMessage, sendReadMsg}) => {
	const navigation = useNavigation();
	const route = useRoute();
	const targetUser = route.params.userInfo
	// const {userId, nickName, avatar} = route.params.userInfo
	// console.log('Chat user targetUser', targetUser)
	// console.log('Chat', userInfo.userId, messages)

	let chatInfo = {
		avatar: targetUser.avatar,
		id: targetUser.userId+'',
		nickName: targetUser.nickName,
	}
	let message

	function convert (messages) {

		const types = ['', 'text', 'image', 'voice']

		return messages.map(m => {
			return {
				id: m.messageId,
				type: types[m.conversationType],
				targetId: m.senderUserId,
				content: m.content.content,
				chatInfo,
				renderTime: true,
				sendStatus: m.receivedStatus, // 0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
				time: m.sentTime, // moment，messageList sorted by time
			}
		})
	}

	messages = convert(messages)
	console.log('Chat', userInfo.userId, messages)

	const [msgs, setMsgs] = useState(messages)

	const chatRef = useRef(null);

	useEffect(() => {
		navigation.setOptions({
			title: targetUser.nickName
		});
		getMessages(targetUser.userId+'')

		return () => {
			navigation.dangerouslyGetParent() && navigation.dangerouslyGetParent().setOptions({
				tabBarVisible: true,
			});

			setMsgs(msgs => {
				if (msgs.length>0) {
					console.log('------Chat', msgs[0].time)
					sendReadMsg(targetUser.userId+'', msgs[0].time)
				}
			})
		}
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			navigation.dangerouslyGetParent() && navigation.dangerouslyGetParent().setOptions({
				tabBarVisible: false,
			});
		});
		return unsubscribe;
	}, []);


	/* 
	id: message id
	about message type: 'text', 'image', 'voice', 'video', 'location', 'share', 'videoCall', 'voiceCall', 'redEnvelope', 'file', 'system'
	targetId: The id of the person who sent the message
	content: see example
	chatInfo: The profile of the person you're chatting with
	renderTime: Whether to render time above message
	sendStatus: 0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
	time: moment，messageList sorted by time
	*/
	/* 
	一个消息:
	{
        "content": {
            "content": "Rrr",
            "extra": null,
            "objectName": "RC:TxtMsg"
        },
        "conversationType": 1,
        "extra": "",
        "messageDirection": 1,
        "messageId": 6,
        "messageUId": "BN6D-3HBC-0PU4-1FGK",
        "objectName": "RC:TxtMsg",
        "receivedStatus": 1,
        "receivedTime": 1611473032511,
        "senderUserId": "113",
        "sentStatus": 30,
        "sentTime": 1611473032624,
        "targetId": "114"
    },
	*/

	/* const [state, setState] = useState({
		messages: [
			{
				id: `6`,
				type: 'voice',
				content: {
					uri:
						'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
					length: 30,
				},
				targetId: '88886666',
				chatInfo: {
					avatar: require('@/static/avatar.png'),
					id: '12345678',
				},
				renderTime: true,
				sendStatus: 0,
				time: '1542264667161',
			},
		],
		// chatBg: require('@/static/bg.jpg'),
		inverted: false, // require
		voiceHandle: true,
		currentTime: 0,
		recording: false,
		paused: false,
		stoppedRecording: false,
		finished: false,
		audioPath: '',
		voicePlaying: false,
		voiceLoading: false,
	}); */

	const sendMessage = (type, content, isInverted) => {
		console.log('sendMessage', type, content, isInverted);
		console.log('sendMessage targetUser', targetUser.userId)
		const callback = {
			success(messageId) {
				console.log("发送成功2：" + messageId, addMessage);
				message.id = messageId
				message.sendStatus = 1
				addMessage(message)
			},
			error(errorCode) {
				console.log("发送失败：" + errorCode);
			}
		}

		message = {
			type: 'text',
			targetId: userInfo.userId+'',
			content,
			chatInfo,
			renderTime: true,
			sendStatus: 0, // 0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
			time: Date.now(), // moment，messageList sorted by time
		}

		message = {
			content: {
					content,
			},
			conversationType: 1,
			messageDirection: 1,
			senderUserId: userInfo.userId+'',
			sentTime: Date.now(), // moment，messageList sorted by time
			targetId: userInfo.userId+'', 
			sendStatus: 0, // 0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
		}

		sendTextMsg({targetId: targetUser.userId+'', text: content, callback})
	};

	const userProfile = {id:userInfo.userId+'', avatar: userInfo.avatar}

	const renderPanelRow = (data, index) => (
		<TouchableOpacity
      key={index}
      style={{ width: (width - 30) / 4,
        height: (width - 30) / 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20 }}
      activeOpacity={0.7}
      onPress={() => {
				if (index===0) {
					navigation.push('SelectImageAndVideo', {
						assetsType: 'PICTURE',
						goBackRouteName: 'Chat',
					});
				} else if (index===1) {
					navigation.push('SelectImageAndVideo', {
						assetsType: 'VIDEO',
						goBackRouteName: 'Chat',
					});
				}
				
			}}
    >
      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, borderColor: '#ccc', borderWidth: StyleSheet.hairlineWidth }}>
        {data.icon}
      </View>
      <Text style={{ color: '#7a7a7a', marginTop: 10 }}>{data.title}</Text>
    </TouchableOpacity>
	)

	return <ChatScreen 
						usePopView={false} 
						ref={chatRef} 
						messageList={messages} 
						sendMessage={sendMessage} 
						isIPhoneX={false}
						showUserName={true}
						userNameStyle={{color: 'black'}}
						userProfile={userProfile}
						panelSource={panelSource}
						CustomImageComponent={FastImage}
						renderPanelRow={renderPanelRow}
				/>;
};

export default connect(
	state => ({
		userInfo: state.user.userInfo.userInfo,
		messages: state.chat.messages,
	}),
	{
		getMessages,
		addMessage,
		sendReadMsg
	}
)(Chat);
