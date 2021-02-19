import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Ionicons, FontAwesome, FontAwesome5, Foundation, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Divider from '@/components/Divider';

import AuthContext from '~/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = ({ title, titleColor, tip, onPress }) => {
	return (
		<TouchableOpacity style={styles.ListItemContainer} onPress={onPress}>
			<Text style={[styles.ListItemTitle, { color: titleColor }]}>{title}</Text>
			<View style={styles.ListItemTipAndArrow}>
				<Text style={styles.ListItemTip}>{tip}</Text>
				<FontAwesome name='angle-right' size={24} color='#adaeaf' />
			</View>
		</TouchableOpacity>
	);
};

const Setting = (props) => {
	const navigation = useNavigation();

	const { signOut } = useContext(AuthContext);

	useEffect(() => {
		navigation.dangerouslyGetParent().setOptions({
			tabBarVisible: false,
		});
	}, []);

	const exitApp = () => {
		AsyncStorage.removeItem('RY_TOKEN')
		signOut();
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.svContainer}>
				<ListItem title='帐号与安全' tip='安全等级低' />
				<Divider />
				<ListItem title='消息通知' />
				<Divider />
				<ListItem title='通用' />
				<Divider />
				<ListItem title='隐私' />
				<Divider />
				<ListItem title='扫一扫' />
				<Divider />
				<ListItem title='青少年模式' />
				<Divider />
				<ListItem title='直播设置' />
				<Divider />
				<ListItem title='清理缓存空间' />
				<Divider />
				<ListItem title='关于陌陌' />
				<Divider />
				<ListItem title='我的客服' />
				<Divider />
				<ListItem title='帐号管理' />
				<Divider />
				<ListItem title='退出应用' titleColor='red' onPress={exitApp} />
				<Divider />
			</ScrollView>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'white' },
	svContainer: { margin: 15 },
	ListItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 5 },
	ListItemTipAndArrow: { flexDirection: 'row', alignItems: 'center' },
	ListItemTitle: { fontSize: 16 },
	ListItemTip: { fontSize: 14, color: 'gray', marginRight: 10 },
});
export default Setting;
