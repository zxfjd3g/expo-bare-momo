import {
	sendTextMsg,
	sendImgMsg,
	getConversations,
	getHistoryMsgs,
	sendReadMessage
} from '@/rongcloud'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const receiveMessage = (message) => ({type: 'RECEIVE_MESSAGE', payload: message})
export const addMessage = (message) => ({type: 'ADD_MESSAGE', payload: message})
export const receiveMessages = (targetId, messages) => ({
	type: 'RECEIVE_MESSAGES', 
	payload: {targetId, messages}
})
export const receiveConversations = (conversations) => ({
	type: 'RECEIVE_CONVERSATIONS',
	payload: conversations
})


export const getCS = () => {
	return async dispatch => {
		const conversations = await getConversations()
		dispatch(receiveConversations(conversations))
		return conversations
	}
}

export const getMessages = (targetId) => {
	return async dispatch => {
		const messages = await getHistoryMsgs(targetId)
		dispatch(receiveMessages(targetId, messages))
	}
}

export const getSysMessages = (targetId) => {
	return async dispatch => {
		let sysMessages = await AsyncStorage.getItem('SYS-MESSAGES')
		sysMessages = JSON.parse(sysMessages) || []
		dispatch(receiveMessages(targetId, sysMessages))
	}
}

export const sendReadMsg = (targetId, time) => {
	sendReadMessage(targetId, time)
	return {type: 'READ_MSG'}
}

export const sendImgMessage = () => {
	return dispatch => {

	}
}