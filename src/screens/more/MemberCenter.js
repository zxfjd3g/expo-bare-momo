import React, { useState, useRef, useEffect, useContext } from "react";
import {
	Image,
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
	FlatList,
} from "react-native";
import {
	AntDesign,
	Ionicons,
	FontAwesome,
	FontAwesome5,
	Foundation,
	Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// redux
import { connect } from "react-redux";

import { getPriceList, createOrderPay } from "@/redux/actions";

const MemberCenter = ({ getPriceList, createOrderPay, priceList }) => {
	const [selectedMember, setSelectedMember] = useState(null);
	const navigation = useNavigation();

	// 发送请求，请求会员价格列表
	useEffect(() => {
		getPriceList();
	}, []);

	// 会员特权
	const memberPrivilegesData = [
		{
			id: 1,
			icon: "user",
			title: "身份标识11",
		},
		{
			id: 2,
			icon: "user",
			title: "身份标识2",
		},
		{
			id: 3,
			icon: "user",
			title: "身份标识33",
		},
		{
			id: 4,
			icon: "user",
			title: "身份标识44",
		},
		{
			id: 5,
			icon: "user",
			title: "身份标识55",
		},
		{
			id: 6,
			icon: "user",
			title: "身份标识66",
		},
		{
			id: 7,
			icon: "user",
			title: "身份标识77",
		},
	];

	const memberPrivilegesRenderItem = ({ item }) => {
		return (
			<View style={styles.memberPrivilegesItem}>
				<View style={styles.memberPrivilegesItemIconContainer}>
					<AntDesign
						style={styles.memberPrivilegesItemIcon}
						name={item.icon}
						size={24}
						color="black"
					/>
				</View>
				<Text style={styles.memberPrivilegesItemText}>{item.title}</Text>
			</View>
		);
	};

	// 会员价格
	const priceListData = Object.keys(priceList).map((key, index) => {
		let name = "";

		if (key === "THREE") {
			name = "3个月";
		} else if (key === "HALF_YEAR") {
			name = "6个月";
		} else if (key === "YEAR") {
			name = "12个月";
		}

		return {
			id: index,
			key,
			name,
			price: priceList[key],
		};
	});

	const priceListRenderItem = ({ item }) => {
		const borderColor = item.key === selectedMember ? "#FE9A2E" : "#000";

		return (
			<TouchableOpacity onPress={() => setSelectedMember(item.key)}>
				<View style={[styles.memberShopContainer, { borderColor }]}>
					<Text style={styles.memberShopTop}>{item.name}</Text>
					<Text style={styles.memberShopBottom}>
						<Text style={styles.memberShopBottomLeft}>￥</Text>
						{item.price}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	// 支付
	const onAliPay = async () => {
		await createOrderPay(selectedMember);
		navigation.push("Pay", { index: 4 });
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.memberCard}>
					<Text style={styles.memberCardIs}>VIP已/未开通</Text>
					<Text style={styles.memberCardId}>MOMO 123456789</Text>
				</View>

				<View>
					<Text style={styles.memberPrivileges}>会员特权</Text>

					<FlatList
						data={memberPrivilegesData}
						renderItem={memberPrivilegesRenderItem}
						keyExtractor={(item) => item.id}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
					/>

					<View style={styles.memberShop}>
						<Text style={styles.memberShopTitle}>开通会员</Text>

						<View style={styles.memberShopWrap}>
							<FlatList
								data={priceListData}
								renderItem={priceListRenderItem}
								keyExtractor={(item) => item.id}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
							/>

							<Text style={styles.memberShopSub}>
								成为会员即表示同意
								<Text style={styles.memberShopSubText}>xxxxxxxxxxxx</Text>协议
							</Text>

							<TouchableWithoutFeedback onPress={onAliPay}>
								<View style={styles.memberPayBtn}>
									<Text style={styles.memberPayBtnText}>支付宝支付</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "white" },
	memberCard: {
		position: "relative",
		height: 100,
		marginTop: 20,
		marginLeft: "5%",
		width: "90%",
		padding: 10,
		backgroundColor: "#9966ff",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	memberCardIs: {
		position: "absolute",
		top: 20,
		right: 20,
	},
	memberCardId: {
		position: "absolute",
		left: 20,
		bottom: 20,
	},
	memberPrivileges: {
		paddingTop: 20,
		paddingLeft: 10,
		marginBottom: 20,
	},
	memberPrivilegesItem: {
		position: "relative",
		marginLeft: 15,
		marginRight: 15,
		height: 100,
	},
	memberPrivilegesItemIconContainer: {
		position: "absolute",
		left: "50%",
		marginLeft: -20,
		width: 40,
		height: 40,
		backgroundColor: "rgba(0, 0, 0, .2)",
		borderRadius: 40,
	},
	memberPrivilegesItemIcon: {
		textAlign: "center",
		lineHeight: 40,
	},
	memberPrivilegesItemText: {
		marginTop: 50,
	},
	memberShop: {
		backgroundColor: "#F2F2F2",
		borderRadius: 10,
	},
	memberShopTitle: {
		backgroundColor: "white",
		paddingLeft: 15,
		paddingBottom: 20,
	},
	memberShopWrap: {
		padding: 20,
	},
	memberShopContainer: {
		width: 110,
		height: 100,
		marginRight: 10,
		borderWidth: 1,
		borderRadius: 10,
		shadowColor: 1,
	},
	memberShopTop: {
		textAlign: "center",
		marginTop: 20,
	},
	memberShopBottom: {
		textAlign: "center",
		marginTop: 10,
		fontSize: 30,
		fontWeight: "600",
	},
	memberShopBottomLeft: {
		fontSize: 20,
	},
	memberShopSub: {
		marginTop: 5,
		textAlign: "center",
		fontSize: 12,
		color: "#aaa",
	},
	memberShopSubText: {
		fontSize: 12,
		color: "#aaa",
		textDecorationLine: "underline",
		textDecorationColor: "#000",
		textDecorationStyle: "solid",
	},
	memberPayBtn: {
		height: 50,
		borderRadius: 30,
		marginTop: 10,
		backgroundColor: "#9966ff",
	},
	memberPayBtnText: {
		textAlign: "center",
		lineHeight: 50,
		color: "#fff",
		fontWeight: "500",
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {
		priceList: state.pay.priceList,
	};
};

const mapDispatchToProps = { getPriceList, createOrderPay };

export default connect(mapStateToProps, mapDispatchToProps)(MemberCenter);
