import React, { useContext} from 'react';
import {
	StatusBar,
	Animated,
	Text,
	Image,
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthContext from '~/AuthContext'

const { width, height } = Dimensions.get('screen');
const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF'];
const DATA = [
	{
		key: '1',
		title: '陌生的你，熟悉的朋友',
		description: '第一次看到你，就感觉你是那个熟悉的陌生人',
		image: require('@/static/guide001.jpg'),
	},
	{
		key: '2',
		title: '我在线，在等在线的你',
		description: '来一次线上的互动，是心灵的火花绽放',
		image: require('@/static/guide002.jpg'),
	},
	{
		key: '3',
		title: '从此以后，我们不再陌生',
		description: '陌生，是因为没遇见我；陌生，是因为没遇见你',
		image: require('@/static/guide003.jpg'),
	},
	{
		key: '4',
		title: '无拘无束的敞开心扉，才是获得真正情感的开始',
		description: '就这样，推开了一扇门，我看到从门外走进的你',
		image: require('@/static/guide004.jpg'),
	},
];

const Indicator = ({ scrollX }) => {
	return (
		<View style={{ position: 'absolute', bottom: 100, flexDirection: 'row' }}>
			{DATA.map((_, i) => {
				const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

				const scale = scrollX.interpolate({
					inputRange,
					outputRange: [0.8, 1.4, 0.8],
					extrapolate: 'clamp',
				});

				const opacity = scrollX.interpolate({
					inputRange,
					outputRange: [0.6, 0.9, 0.6],
					extrapolate: 'clamp',
				});

				return (
					<Animated.View
						key={`indicator-${i}`}
						style={{
							height: 10,
							width: 10,
							borderRadius: 5,
							backgroundColor: '#ff',
							opacity,
							backgroundColor: '#333',
							margin: 10,
							transform: [{ scale }],
						}}
					></Animated.View>
				);
			})}
		</View>
	);
};

const Backdrop = ({ scrollX }) => {
	const backgroundColor = scrollX.interpolate({
		inputRange: bgs.map((_, i) => i * width),
		outputRange: bgs.map((bg) => bg),
	});

	return <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} />;
};

const Square = ({ scrollX }) => {
	const YOLO = Animated.modulo(Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)), 1);

	const rotate = YOLO.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: ['35deg', '0deg', '35deg'],
	});

	const translateX = YOLO.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, -height, 0],
	});

	return (
		<Animated.View
			style={{
				width: height,
				height: height,
				backgroundColor: '#fff',
				borderRadius: 86,
				position: 'absolute',
				top: -height * 0.6,
				left: -height * 0.3,
				transform: [
					{
						rotate,
					},
					{
						translateX,
					},
				],
			}}
		/>
	);
};

/* 
向导界面(只有安装后第一次运行才会显示)
*/
export default function App(props) {
	const scrollX = React.useRef(new Animated.Value(0)).current;
	const { toggleGuide } = useContext(AuthContext);
	const gotoRootStackScreen = async () => {
		await AsyncStorage.setItem('showGuide', 'true');
		toggleGuide({ showGuide: false });
	};
	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<Backdrop scrollX={scrollX} />
			<Square scrollX={scrollX} />
			<Animated.FlatList
				data={DATA}
				keyExtractor={(item) => item.key}
				horizontal
				scrollEventThreshold={32}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
					useNativeDriver: false,
				})}
				contentContainerStyle={{ paddingBottom: 100 }}
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				renderItem={({ item, index }) => {
					return (
						<View style={{ width, padding: 20, alignItems: 'center' }}>
							<View style={{ flex: 0.7, justifyContent: 'center' }}>
								<Image
									source={item.image}
									style={{
										width: width / 2,
										height: width / 2,
										resizeMode: 'contain',
										borderRadius: width / 2,
									}}
								></Image>
							</View>
							<View style={{ flex: 0.3 }}>
								<Text style={{ color: '#fff', fontWeight: '800', fontSize: 28, marginBottom: 10 }}>
									{item.title}
								</Text>
								<Text style={{ color: '#fff', fontWeight: '300' }}>{item.description}</Text>

								{index === DATA.length - 1 ? (
									<TouchableOpacity onPress={gotoRootStackScreen}>
										<View
											style={{
												backgroundColor: '#ff3d11',
												flexDirection: 'row',
												justifyContent: 'center',
												padding: 20,
												marginTop: 20,
												borderRadius: 30,
											}}
										>
											<Text style={{ fontSize: 18, color: '#fff' }}>进入系统</Text>
										</View>
									</TouchableOpacity>
								) : null}
							</View>
						</View>
					);
				}}
			/>
			<Indicator scrollX={scrollX} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
