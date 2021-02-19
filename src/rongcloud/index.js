/* 
连接融云
*/
import {
  init,
  connect,
  sendMessage,
  ConversationType,
  ObjectName,
  addReceiveMessageListener,
  getHistoryMessages,
  getConversation,
  getConversationList,
  removeConversation,
  disconnect,
  sendReadReceiptMessage,
  addPushArrivedListener
 } from 'rongcloud-react-native-imlib';

let connectId = -1
let listener
let receiveMessageCB

 function onSuccess(userId) {
  connectId = userId
  console.log('连接成功：' + userId);
  listener = addReceiveMessageListener(receiveMessageCB)
  addPushArrivedListener((message) => {
    console.log('接收推送消息', message)
  })
 }
 
 function onError(errorCode) {
  console.log('连接失败：' + errorCode);
  listener = null
  receiveMessageCB = null
  connectId = -1
 }
 
 function onTokenIncorrect() {
  console.log('Token 不正确或已过期222');
  listener = null
  receiveMessageCB = null
  connectId = -1
 }
 
 const APP_KEY = 'bmdehs6pbfr9s'
//  const APP_SECRET = 'aP4TfDD6yXa2'

/* 
连接融云, 打开应用或重新登陆时连接
只有没有连接或重新登陆时执行
*/
export function connectRC(token, receiveCallback) {
  if (connectId!==-1) return
  connectId = 0
  // 初始连接，appKey的设置
  init(APP_KEY);
  
  connect(
    token,
    onSuccess,
    onError,
    onTokenIncorrect
  );
  receiveMessageCB = receiveCallback
}

/* 
断开连接, 退出登陆
*/
export function disConnectRC() {
  
  if (connectId<=0) return

  // 移除监听
  listener.remove();
  listener = null
  receiveMessageCB = null
  connectId = -1
  
  // 断开连接，但仍然可以接收推送消息
  // disconnect();
  // 断开连接，不再接收推送消息
  disconnect(false);
}

/* 
发送文本消息
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};
*/
export function sendTextMsg({targetId, text, callback}) {
  const conversationType = ConversationType.PRIVATE;
  const content = { objectName: ObjectName.Text, content: text};
  sendMessage({ conversationType, targetId, content }, callback);
}

/* 
发送图片消息
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  progress(progress, messageId) {
    console.log(`发送进度: ${progress} %`);

    // 消息发送过程中可随时取消发送
    cancelSendMediaMessage(messageId);
  },
  cancel() {
    console.log("发送取消");
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};
*/
export function sendImgMsg({targetId, local, callback}) {
  const conversationType = ConversationType.PRIVATE;
  const content = { objectName: ObjectName.Image, local };
  sendMediaMessage({ conversationType, targetId, content }, callback);
}

/* 
添加接收消息的监听
message => {
  console.log(message);
}
*/
// export function addReceiveMsgListener(callback) {
//   const listener = addReceiveMessageListener(callback);
//   return listener
// }

// addReceiveMsgListener((message) => {
//   console.log('--rongcloud receive', message)
// })

/* 
获取指定用户的消息列表
返回value为messages的promise对象
*/
export function getHistoryMsgs(targetId) {
  const conversationType = ConversationType.PRIVATE;
  // 获取指定会话消息，默认获取最新 10 条
  return getHistoryMessages(conversationType, targetId);
}


/* 
提交已读消息的请求
好像没有效果
*/
export function sendReadMessage(targetId, time) {
  console.log('time', targetId, time)
  sendReadReceiptMessage(ConversationType.PRIVATE, targetId, time);
}

/* 
获取会话列表
conversations
*/
export function getConversations() {
  const conversationTypes = [ConversationType.PRIVATE];
  return getConversationList(conversationTypes);
}

/* 
删除会话
*/
export function rmConversation(targetId) {
  const conversationType = ConversationType.PRIVATE;
  removeConversation(conversationType, targetId);
}