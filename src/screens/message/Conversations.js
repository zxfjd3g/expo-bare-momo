import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { connect } from "react-redux";
import { Image as ImageCache } from "react-native-expo-image-cache";
import dayjs from "dayjs";

import voice from "@/static/svg/voice.svg";
import { getCS } from "@/redux/actions";
import { axios } from "@/api/request";
import requestApi from "@/api/requestApi";
import { IMAGE_LOADING_PLACEHOLDER } from "@/constant/env";

const Conversations = ({ userId, conversations, getCS }) => {
  console.log("Conversations init()");
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      const conversations = await getCS();

      const ids = conversations.map((c) =>
        userId == c.targetId ? c.senderUserId * 1 : c.targetId * 1
      );
      console.log(
        "------------------Conversations conversations44",
        conversations,
        ids
      );
      const { data } = await axios({
        url: requestApi.getUserList,
        method: "POST",
        data: ids,
      });
      console.log("--------------------Conversations users22", data);

      setUsers(data);
    };
    getConversations();
  }, []);

  console.log("Conversations conversations", conversations);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>消息</Text>
        <Feather
          name="users"
          size={24}
          color="gray"
          onPress={() => navigation.push("FriendFollowFan", {})}
        />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item, index) => item.userId.toString()}
        renderItem={({ item, index }) => {
          const {
            latestMessage,
            receivedTime,
            sentTime,
            unreadMessageCount,
          } = conversations[index];

          return (
            <TouchableOpacity
              onPress={() => {
                // rmConversation(conversations[index].targetId)
                navigation.navigate("Chat", { userInfo: item });
              }}
            >
              <View style={styles.messageList}>
                <View>
                  <ImageCache
                    {...{ IMAGE_LOADING_PLACEHOLDER, uri: item.avatar }}
                    style={[styles.avatar]}
                  />
                </View>
                <View style={styles.messageContainer}>
                  <View style={styles.messageContent}>
                    <Text style={styles.messageContentName}>
                      {item.nickName}
                    </Text>
                    <Text>
                      <Text style={styles.messageContentDetail}>最后消息:</Text>
                      {latestMessage.content}
                    </Text>
                  </View>
                  <View style={styles.messageTime}>
                    <Text>{dayjs(sentTime).format("M-DD")}</Text>
                    <Text style={styles.messageUnread}>
                      {unreadMessageCount}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        // ListHeaderComponent={() => {
        //   return (
        //     <TouchableOpacity
        //       onPress={() => {
        //         navigation.navigate("SysMessages");
        //       }}
        //     >
        //       <ImageCache
        //         {...{
        //           IMAGE_LOADING_PLACEHOLDER,
        //           uri:
        //             "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1006811894,971433358&fm=26&gp=0.jpg",
        //         }}
        //         style={[styles.avatar]}
        //       />
        //       <Text>互动消息</Text>
        //       <Text>暂无最新消息</Text>
        //     </TouchableOpacity>
        //   );
        // }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", margin: 10 },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    resizeMode: "cover",
  },
  messageList: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 60,
  },
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  messageContent: {
    justifyContent: "space-between",
  },
  messageContentName: {
    fontWeight: "700",
    fontSize: 22,
  },
  messageContentDetail: {
    fontWeight: "600",
  },
  messageTime: {
    paddingTop: 10,
    textAlign: "center",
    justifyContent: "space-between",
  },
  messageUnread: {
    backgroundColor: "red",
    borderRadius: 10,
    color: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default connect(
  (state) => ({
    userId: state.user.userInfo.userId,
    conversations: state.chat.conversations,
  }),
  { getCS }
)(Conversations);
