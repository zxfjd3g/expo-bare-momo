import AsyncStorage from "@react-native-async-storage/async-storage"

const initChat = {
  unReadCount: 0,
  conversations: [],
  messages: [],
  targetId: ''
}
export default function chat (state=initChat, action) {
  console.log('action chat', action.type)
  switch (action.type) {
    case 'RECEIVE_CONVERSATIONS':
      const conversations = action.payload
      const unReadCount = conversations.reduce((pre, item) => pre + item.unreadMessageCount, 0)
      return {
        unReadCount,
        conversations,
        messages: [],
        targetId: '',
      }
    case 'RECEIVE_MESSAGES':
      const {targetId, messages} = action.payload
      return {
        unReadCount: state.unReadCount,
        conversations: state.conversations,
        messages,
        targetId
      } 
    case 'RECEIVE_MESSAGE':
      const message = action.payload
      let ms = state.messages
      console.log('---', message.senderUserId, state.targetId)
      if (message.senderUserId==state.targetId) {
        ms = [message, ...ms]
        AsyncStorage.setItem('SYS-MESSAGES', JSON.stringify(ms))
      }
      return {
        unReadCount: state.unReadCount + (message.senderUserId===state.targetId?0:1),
        conversations: state.conversations,
        messages: ms,
        targetId: state.targetId
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [action.payload, ...state.messages],
      }
    case 'READ_MSG':
      let unreadMessageCount = 0
      const cs = state.conversations.map(c => {
        if (c.targetId==state.targetId) {
          unreadMessageCount = c.unreadMessageCount
          return {...c, unreadMessageCount: 0}
        }
        return c
      })
      console.log('unreadMessageCount', unreadMessageCount)
      return {
        unReadCount: state.unReadCount-unreadMessageCount,
        conversations: cs,
        messages: [],
        targetId: ''
      }
    default:
      return state
  }
}