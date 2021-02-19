import React, { useContext, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { getDictIncome, getDictMarriage, getDictIndustry } from '@/redux/actions';
import AuthContext from '~/AuthContext'
/* 
欢迎界面: 加载一些初始化数据
*/
const SplashScreen = ({ getDictIncome, getDictMarriage, getDictIndustry, income, marriage, industry }) => {
	const { toggleSplashScreen } = useContext(AuthContext);

	useEffect(() => {
		const gotoRootStackScreen = async () => {
			// 在过渡页可以进行整体项目的初始化操作，比如分类页的初始数据请求、通讯连接等
			if (income.length === 0) await getDictIncome();
			if (marriage.length === 0) await getDictMarriage();
			if (industry.length === 0) await getDictIndustry();
			toggleSplashScreen({ showSplashScreen: false });
		};

		gotoRootStackScreen();
	}, []);

	return (
		<ImageBackground source={require('@/static/splashLoading.jpg')} style={styles.ImageBackground}>
			<View style={styles.container}>
				<Text style={styles.textTitle}> 为了遇见她 </Text>
				<Text style={styles.textContent}>我就在这里，静心的等待</Text>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	ImageBackground: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba( 0, 0, 0, 0.6 )',
	},
	textTitle: {
		marginLeft: 30,
		marginRight: 30,
		marginBottom: 10,
		marginTop: 60,
		color: 'white',
		fontSize: 55,
		color: 'rgba( 155, 155, 155, 0.5)',
	},
	textContent: {
		marginLeft: 30,
		marginRight: 30,
		color: 'white',
		fontSize: 24,
		color: 'rgba( 155, 155, 155, 0.5)',
	},
});

// react-redux 属性方法映射
const mapStateToProps = (state) => {
	return {
		income: state.dict.income,
		marriage: state.dict.marriage,
		industry: state.dict.industry,
	};
};
const mapDispatchToProps = { 
	getDictIncome, 
	getDictMarriage, 
	getDictIndustry
 };

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
