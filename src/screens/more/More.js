import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Ionicons, FontAwesome, FontAwesome5, Foundation, Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import SvgUri from 'expo-svg-uri';

import Divider from '@/components/Divider';
import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
import { getUserInfo } from '@/redux/actions';
import UserInfo from '@/components/UserInfo';

const More = (props) => {
	const navigation = useNavigation();

	const [homeUser, setHomeUser] = useState({})

	const [{ data, loading, error }, request] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {
		const fetchData = async () => {
			const {data} = await request({
				url: requestApi.getHome
			})
			setHomeUser(data)
			console.log('----More', data)
		}
		fetchData()
	}, [])
	
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			navigation.dangerouslyGetParent().setOptions({
				tabBarVisible: true,
			});
		});
		return unsubscribe;
	}, [navigation]);

	const {
		userInfo: { userInfo, userData },
		getUserInfo,
	} = props;

	useEffect(() => {
		getUserInfo();
	}, []);

	const onGotoSetting = () => {
		navigation.navigate('Setting');
	};

	const onGotoUserDetail = () => {
		navigation.navigate('UserDetail');
	};

	const showFriends = async () => {
		// const {data} = await request({
		// 	url: requestApi.getMyFriends
		// })
		// console.log('+++More showFriends', data)
		navigation.push('FriendFollowFan', {index: 0})
	}

	const showFollows = async () => {
		// const {data} = await request({
		// 	url: requestApi.getMyFollows
		// })
		// console.log('+++More showFollows', data)
		navigation.push('FriendFollowFan', {index: 1})
	}

	const showFans = async () => {
		// const {data} = await request({
		// 	url: requestApi.getMyFans
		// })
		// console.log('+++More showFans', data)
		navigation.push('FriendFollowFan', {index: 2})
	}

	const showMemberCenter = async () => {
    console.log(111);
    navigation.push("MemberCenter", { index: 3 });
  };

	
	const test = async () => {
		// 114
		const {data} = await request({
			// url: requestApi.getCancelFollow + '/114'
			// url: requestApi.getFollow + '/114'
			// url: requestApi.getMyLikeList
			// url: requestApi.getLikeMyList
			// url: requestApi.getVisitorList  // []
			url: requestApi.getVisitorList  // []
		})
		console.log('+++More test', data)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.navigate('Payment')}>
					<AntDesign name='wallet' size={24} color='gray' style={{ marginRight: 20 }} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onGotoSetting}>
					<AntDesign name='setting' size={24} color='gray' style={{ marginRight: 20 }} />
				</TouchableOpacity>
			</View>
			<ScrollView style={{ padding: 20 }}>
				<TouchableOpacity onPress={onGotoUserDetail}>
					<UserInfo {...userInfo} brief='查看或者编辑个人资料' avatarStyle={{ width: 80, height: 80 }}>
						<FontAwesome name='angle-right' size={24} color='#adaeaf' />
					</UserInfo>
				</TouchableOpacity>
				{/* 分割线 */}
				<View style={{ marginLeft: 20, marginRight: 20 }}>
					<Divider borderBottomColor={'#e5e5e5'} />
				</View>

				<View style={styles.basicInfoContainer}>
					<TouchableOpacity style={styles.basicInfoItem} onPress={showFriends}>
						<Text>{homeUser.friendCount}</Text>
						<Text style={styles.basicInfoItemText}>好友</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.basicInfoItem} onPress={showFollows}>
						<Text>{homeUser.followCount}</Text>
						<Text style={styles.basicInfoItemText}>关注</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.basicInfoItem} onPress={showFans}>
						<Text>{homeUser.fansCount}</Text>
						<Text style={styles.basicInfoItemText}>粉丝</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.basicInfoItem} onPress={test}>
						<Text>{homeUser.postCount}</Text>
						<Text style={styles.basicInfoItemText}>我的动态</Text>
					</TouchableOpacity>

					<View style={styles.basicInfoItem}>
						<View
							style={{
								borderColor: '#e5e5e5',
								borderWidth: 2,
								width: 60,
								height: 60,
								borderRadius: 50,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<FontAwesome5 name='glasses' size={24} color='#e5755c' />
						</View>
						<Text style={styles.basicInfoItemText}>谁看过我</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<View
							style={{
								borderColor: '#e5e5e5',
								borderWidth: 2,
								width: 60,
								height: 60,
								borderRadius: 50,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Foundation name='foot' size={24} color='#73e1be' />
						</View>
						<Text style={styles.basicInfoItemText}>我互动过</Text>
					</View>

					<TouchableOpacity style={styles.basicInfoItem} onPress={showMemberCenter}>
						<View
							style={{
								borderColor: '#e5e5e5',
								borderWidth: 2,
								width: 60,
								height: 60,
								borderRadius: 50,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Foundation name='crown' size={24} color='#dec46b' />
						</View>
						<Text style={styles.basicInfoItemText}>会员中心</Text>
					</TouchableOpacity>
				</View>
				{/* 分割线 */}
				<View style={{ marginLeft: 20, marginRight: 20 }}>
					<Divider borderBottomColor={'#e5e5e5'} />
				</View>

				<View style={{ marginTop: 20, paddingLeft: 20 }}>
					<Text>认识新朋友</Text>
				</View>
				<View style={[styles.basicInfoContainer, { marginTop: 0 }]}>
					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 0.5, 1]}
							colors={['#64cfea', '#5bd5ec', '#61eaeb']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/chat.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>聊天室</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 0.5, 1]}
							colors={['#f6d34e', '#f8d03d', '#fed33c']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/party.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>派对</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 0.5, 1]}
							colors={['#db64ff', '#d663fd', '#a459f9']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/heartbeat.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>心动狼人</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 0.5, 1]}
							colors={['#f68547', '#f9883b', '#f77e84']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/party.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>关注</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 0.5, 1]}
							colors={['#70e8ca', '#63e2bd', '#59dea0']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/group.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>附近群组</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#ec008c', '#fc6767']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/friend.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>附近群组</Text>
					</View>
					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#ffe259', '#ffa751']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/couple.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>在线配对</Text>
					</View>
				</View>

				{/* 分割线 */}
				<View style={{ marginLeft: 20, marginRight: 20 }}>
					<Divider borderBottomColor={'#e5e5e5'} />
				</View>

				<View style={{ marginTop: 20, paddingLeft: 20 }}>
					<Text>一起玩游戏</Text>
				</View>
				<View style={[styles.basicInfoContainer, { marginTop: 0 }]}>
					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#ffe259', '#ffa751']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/car.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>天天抢车位</Text>
					</View>
					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#fd5469', '#e5021e']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/dancer.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>心动劲舞团</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#68bd0a', '#478106']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/voice.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>一起来玩吧</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#cb91fe', '#ab4cfe']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/playmate.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>玩伴</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#b8e986', '#a6e367']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/mahjong.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>天天庄园</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#5077e3', '#3662df']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/group.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>一起养小妖</Text>
					</View>

					<View style={styles.basicInfoItem}>
						<LinearGradient
							locations={[0, 1]}
							colors={['#87d7ec', '#50c4e3']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{ padding: 10, borderRadius: 10 }}
						>
							<SvgUri width='30' height='30' source={require('@/static/svg/gameroom.svg')} />
						</LinearGradient>
						<Text style={styles.basicInfoItemText}>游戏室</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	basicInfoContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	basicInfoItem: {
		width: '25%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	basicInfoItemText: {
		marginTop: 10,
		color: 'gray',
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {
		userInfo: state.user.userInfo,
	};
};

const mapDispatchToProps = { getUserInfo };

export default connect(mapStateToProps, mapDispatchToProps)(More);
