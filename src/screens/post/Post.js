import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { useNavigation} from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons';
import { TabView } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import PostList from '@/pages/PostList'
import requestApi from '@/api/requestApi'

const Post = () => {

	const navigation = useNavigation()
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: requestApi.getMyPostList, title: '我的', icon: 'star' },
		{ key: requestApi.getRecommendPostList, title: '推荐', icon: 'map-marker' },
		{ key: requestApi.getFollowPostList, title: '关注', icon: 'comments' },
	]);

	const renderScene = ({ route, jumpTo }) => {
		console.log('--Post renderScene', route.key)
		return <PostList key={route.key} apiPath={route.key}/>
	};


	const renderTabViewItem = ({ navigationState, position }) => ({ route, index }) => {
		const inputRange = navigationState.routes.map((_, i) => i);

		const activeOpacity = Animated.interpolateNode(position, {
			inputRange,
			outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
		});
		const inactiveOpacity = Animated.interpolateNode(position, {
			inputRange,
			outputRange: inputRange.map((i) => (i === index ? 0 : 1)),
		});

		return (
			<View
				style={
					([styles.tab],
					{
						flexDirection: 'row',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
					})
				}
			>
				<Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
					<View
						style={{
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
							flexDirection: 'row',
						}}
					>
						<Text style={[styles.label, styles.inactive]}>{route.title}</Text>
						<FontAwesome name={route.icon} style={[styles.icon, styles.inactive]} />
					</View>
				</Animated.View>
				<Animated.View style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}>
					<View
						style={{
							alignItems: 'flex-end',
							flexDirection: 'row',
						}}
					>
						<Text style={[styles.label, styles.active]}>{route.title}</Text>
						<FontAwesome name={route.icon} style={[styles.icon, styles.active]} />
					</View>
				</Animated.View>
			</View>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				renderTabBar={(props) => (
					<View style={styles.tabbar}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{props.navigationState.routes.map((route, index) => {
								return (
									<TouchableOpacity key={route.key} onPress={() => props.jumpTo(route.key)}>
										{renderTabViewItem(props)({ route, index })}
									</TouchableOpacity>
								);
							})}
						</ScrollView>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingRight: 20,
								paddingLeft: 20,
							}}
						>
							<View
								style={{
									backgroundColor: '#4cd1fc',
									paddingTop: 5,
									paddingBottom: 5,
									paddingLeft: 10,
									paddingRight: 10,
									borderRadius: 5,
								}}
							>
								<Text style={{ color: 'white' }}
									onPress={async () => {
										navigation.navigate('Journal');
									}}
								>发动态</Text>
							</View>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	tabbar: {
		flexDirection: 'row',
		backgroundColor: '#fafafa',
	},
	tab: {
		flex: 1,
	},
	scene: {
		flex: 1,
		backgroundColor: 'white',
	},
	item: {
		padding: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	activeItem: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	active: {
		color: '#0084ff',
		fontSize: 20,
	},
	inactive: {
		color: '#999',
	},
	icon: {
		height: 20,
		width: 20,
		lineHeight: 20,
	},
	label: {
		marginBottom: 2,
		marginRight: 2,
		backgroundColor: 'transparent',
		lineHeight: 20,
	},
});

export default Post;
