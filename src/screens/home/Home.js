import React, { useState, useEffect } from "react";
import {
	Image,
	StatusBar,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Alert,
	Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Swiper from "react-native-deck-swiper";
import { Transitioning, Transition } from "react-native-reanimated";
import {
	MaterialCommunityIcons,
	MaterialIcons,
	AntDesign,
} from "@expo/vector-icons";
import useAxios from "@/api/request";
import requestApi from "@/api/requestApi";

const stackSize = 4;
const colors = {
	red: "#EC2379",
	blue: "#0070FF",
	gray: "#777777",
	white: "#ffffff",
	black: "#000000",
};
const ANIMATION_DURATION = 200;
const PAGE_SIZE = 10;

const transition = (
	<Transition.Sequence>
		<Transition.Out
			type="slide-bottom"
			durationMs={ANIMATION_DURATION}
			interpolation="easeIn"
		/>
		<Transition.Together>
			<Transition.In
				type="fade"
				durationMs={ANIMATION_DURATION}
				delayMs={ANIMATION_DURATION / 2}
			/>
			<Transition.In
				type="slide-bottom"
				durationMs={ANIMATION_DURATION}
				delayMs={ANIMATION_DURATION / 2}
				interpolation="easeOut"
			/>
		</Transition.Together>
	</Transition.Sequence>
);

const swiperRef = React.createRef();
const transitionRef = React.createRef();

const Card = ({ card = {} }) => {
	return (
		<View style={styles.card}>
			<Image source={{ uri: card.avatar }} style={styles.cardImage} />
		</View>
	);
};

const CardDetails = ({ item = {}, index, page, length }) => (
	<View key={item.userId} style={styles.userInfo}>
		<View>
			<Text style={styles.nickName}>{item.nickName}</Text>
			<View
				style={[
					styles.age,
					{ backgroundColor: item.sex === "WOMAN" ? "#eb2f96" : "#1890ff" },
				]}
			>
				<AntDesign
					name={item.sex === "WOMAN" ? "woman" : "man"}
					size={10}
					color="#fff"
				/>
				<Text style={styles.text}>{item.age}</Text>
			</View>
		</View>
		<View style={styles.userDetail}>
			<AntDesign name="right" size={24} color="#8c8c8c" />
		</View>
	</View>
);

export default function Home() {
	const navigation = useNavigation();

	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(0);
	const [index, setIndex] = useState(0);
	const [total, setTotal] = useState(0);
	// const [modalVisible, setModalVisible] = useState(false)

	const [{ data, loading, error }, fetchData] = useAxios(
		{
			method: "GET",
		},
		{ manual: true }
	);

	useEffect(() => {
		const getListDate = async () => {
			const { code, data, message, ok } = await fetchData({
				url: `${requestApi.getRecommendUserList}/${page}/${PAGE_SIZE}`,
			});
			setPages(data.pages);
			setTotal(data.total);
			const arr = list.concat(data.records);
			setList(arr);
			console.log("++++ Home length", arr, arr.length);
		};

		getListDate();
	}, [page]);

	const onSwiped = (index) => {
		// console.log('onSwiped', index)
		transitionRef.current.animateNextTransition();
		setIndex(index + 1);
		if (index === list.length - 3 && page < pages) {
			console.log("Home 加载新一页", index + 1);
			if (page < pages) {
				setPage(page + 1);
			}
		}
	};

	const onSwipedLeft = async (index) => {
		const { code, data } = await fetchData({
			url: requestApi.getDisLike + "/" + list[index].userId,
		});
		console.log("----Home disLike", code, data);
	};

	const onSwipedRight = async (index) => {
		const { code, data } = await fetchData({
			url: requestApi.getLike + "/" + list[index].userId,
		});
		console.log("----Home like", code, data);
		if (data.status === "1") {
			Alert.alert("缘分来临", "查看对方详情", [
				{ text: "暂时不看", onPress: () => {} },
				{
					text: "立即查看",
					onPress: () => {
						navigation.push("ViewUserDetail", { userId: list[index].userId });
					},
				},
			]);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar hidden={true} />
			<View style={styles.swiperContainer}>
				<Swiper
					ref={swiperRef}
					cards={list}
					cardIndex={index}
					renderCard={(card) => <Card card={card} />}
					infinite={false}
					backgroundColor={"transparent"}
					onSwiped={onSwiped}
					onSwipedLeft={onSwipedLeft}
					onSwipedRight={onSwipedRight}
					cardVerticalMargin={10}
					stackSize={stackSize}
					stackScale={10}
					stackSeparation={4}
					animateOverlayLabelsOpacity
					animateCardOpacity
					disableTopSwipe
					disableBottomSwipe
					disableLeftSwipe={index >= total - 1}
					disableRightSwipe={index >= total - 1}
					overlayLabels={{
						left: {
							// title: 'aaaa',
							element: (
								<MaterialCommunityIcons
									name="close"
									size={70}
									color={colors.red}
								/>
							),
							style: {
								label: {
									backgroundColor: colors.red,
									borderColor: colors.red,
									color: colors.white,
									borderWidth: 1,
									fontSize: 24,
								},
								wrapper: {
									flexDirection: "column",
									alignItems: "flex-end",
									justifyContent: "flex-start",
									marginTop: 20,
									marginLeft: -20,
								},
							},
						},
						right: {
							element: (
								<MaterialCommunityIcons
									name="heart"
									size={70}
									color={colors.blue}
								/>
							),
							style: {
								label: {
									backgroundColor: colors.blue,
									borderColor: colors.blue,
									color: colors.white,
									borderWidth: 1,
									fontSize: 24,
								},
								wrapper: {
									flexDirection: "column",
									alignItems: "flex-start",
									justifyContent: "flex-start",
									marginTop: 20,
									marginLeft: 20,
								},
							},
						},
					}}
					showSecondCard
				/>
			</View>
			<View style={styles.bottomContainer}>
				<Transitioning.View
					ref={transitionRef}
					transition={transition}
					style={styles.bottomContainerMeta}
				>
					<CardDetails
						item={list[index]}
						index={index}
						page={page}
						length={list.length}
					/>
				</Transitioning.View>
				<View style={styles.bottomContainerButtons}>
					<View style={styles.smallIcon}>
						<AntDesign
							name="back"
							size={30}
							color="#fa8c16"
							onPress={() => {
								if (index < total - 1) {
									swiperRef.current.swipeLeft();
								}
							}}
						/>
					</View>
					<View style={styles.bigIcon}>
						<AntDesign
							name="heart"
							size={50}
							color="#1890ff"
							onPress={() => {
								if (index < total - 1) {
									swiperRef.current.swipeRight();
								}
							}}
						/>
					</View>

					<View style={styles.bigIcon}>
						<AntDesign
							name="info"
							size={50}
							color="#a0d911"
							onPress={() =>
								navigation.push("ViewUserDetail", {
									userId: list[index].userId,
								})
							}
						/>
					</View>

					<View style={styles.smallIcon}>
						<AntDesign
							name="ellipsis1"
							size={30}
							color="#eb2f96"
							onPress={() => navigation.push("LikeList", { isMyLike: true })}
						/>
					</View>
				</View>
				{/* <Button title="查看我喜欢的列表" onPress={() => navigation.push('LikeList', {isMyLike: true})}></Button>
        <Button title="查看喜欢我的列表" onPress={() => navigation.push('LikeList', {isMyLike: false})}></Button> */}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	swiperContainer: {
		flex: 0.75,
		// backgroundColor: colors.blue
	},
	bottomContainer: {
		flex: 0.25,
		justifyContent: "space-evenly",
	},
	bottomContainerMeta: { alignContent: "flex-end", alignItems: "center" },
	bottomContainerButtons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	smallIcon: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		width: 54,
		height: 54,
		borderRadius: 54,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	bigIcon: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		width: 74,
		height: 74,
		borderRadius: 74,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	cardImage: {
		width: "98%",
		height: "98%",
		// flex: 1,
		// resizeMode: 'contain'
	},
	card: {
		flex: 0.75,
		borderRadius: 8,
		shadowRadius: 25,
		shadowColor: colors.black,
		shadowOpacity: 0.08,
		shadowOffset: { width: 0, height: 0 },
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#eeeeee",
	},

	userInfo: {
		position: "absolute",
		top: -90,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 100,
		paddingLeft: 35,
		paddingRight: 35,
		width: "100%",
	},
	nickName: {
		fontSize: 30,
		fontWeight: "700",
		color: "#fff",
		marginBottom: 10,
	},
	age: {
		width: 40,
		paddingLeft: 5,
		paddingRight: 5,
		borderRadius: 30,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	userDetail: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		width: 40,
		height: 40,
		borderRadius: 40,
	},
	text: {
		color: "#fff",
	},

	done: {
		textAlign: "center",
		fontSize: 30,
		color: colors.white,
		backgroundColor: "transparent",
	},
	heading: { fontSize: 18, marginBottom: 10, color: colors.gray },
	price: { color: colors.blue, fontSize: 18, fontWeight: "500" },
});
