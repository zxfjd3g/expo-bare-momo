import React, { useRef, useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
	Dimensions,
	Button,
	TouchableWithoutFeedback,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import PostList from '@/pages/PostList';
import NearbyPeopleList from '@/pages/NearbyPeopleList';
import requestApi from '@/api/requestApi'

const { width, height } = Dimensions.get('window');
const zoomOut = {
	0: {
		scale: 1,
	},
	1: {
		scale: 0.6,
	},
};

const zoomIn = {
	0: {
		scale: 0.6,
	},
	1: {
		scale: 1,
	},
};

const SectionTitle = ['附近动态', '附近的人'];
// 上一个tab下标
let prevTabIndex = 0;

let SectionTitleIndex = 0;

const Near = () => {
	const navigation = useNavigation();

	// scrollRef: 主显示区ScrollView的ref对象
	const scrollRef = useRef(null);
	// Animation：动画标题的ref对象，多个对象
	const Animation = useRef([]);
	// AnimationDot：动画标题底标指示点的ref对象
	const AnimationDot = useRef(null);
	// nextTabIndex: 下一个tab下标
	const [nextTabIndex, setNextTabIndex] = useState(0);

	// 动画标题元素宽度
	const [AnimationTitleWidth, setAnimationTitleWidth] = useState(0);
	// scrollView内容容器的宽度
	const [svContentContainerWidth, setSVContentContainerWidth] = useState(0);

	const [animationTitleCords, setAnimationTitleCords] = useState([]);

	const [checkAnimationTitleCords, setCheckAnimationTitleCords] = useState(false);

	// ------------------------------------------------------------
	// * 初始化阶段
	// ------------------------------------------------------------
	// 获取高度内容
	// 获取scrollView内容容器的宽度
	const onSvContentContainerLayout = ({
		nativeEvent: {
			layout: { x, width },
		},
	}) => {
		setSVContentContainerWidth(width);
	};

	// 获取动画标题元素宽度
	const onAnimationTitleLayout = useCallback(({ nativeEvent: { layout: { x, width, height } } }, index) => {
		animationTitleCords[index] = {
			x,
			width,
		};

		if (animationTitleCords[index].x >= 0 && animationTitleCords[index].width > 0) {
			setAnimationTitleCords(animationTitleCords);
			if (SectionTitleIndex === SectionTitle.length - 1) {
				setCheckAnimationTitleCords(true);
			}
			SectionTitleIndex++;
		}
	}, []);

	// ------------------------------------------------------------
	// * 用户事件
	// ------------------------------------------------------------
	// 改变ScrollView显示的区域
	const _changeSVSection = () => {
		scrollRef.current.scrollTo({
			x: nextTabIndex * svContentContainerWidth,
			animation: true,
		});
	};

	// 标题底部擀示器动画
	const _transitionDot = () => {
		let targetPositionX = 0;
		if (checkAnimationTitleCords) {
			if (nextTabIndex === 0) {
				targetPositionX = animationTitleCords[nextTabIndex].width / 2;
			} else if (nextTabIndex === SectionTitle.length - 1) {
				targetPositionX = animationTitleCords[nextTabIndex].x + animationTitleCords[nextTabIndex].width / 2;
			} else {
				targetPositionX =
					(animationTitleCords[nextTabIndex + 1].x - animationTitleCords[nextTabIndex].x) / 2 +
					animationTitleCords[nextTabIndex].x;
			}

			AnimationDot.current.transition(
				{
					opacity: 0,
					scale: 0.2,
					translateX: targetPositionX,
				},
				{
					opacity: 1,
					scale: 1,
					translateX: targetPositionX,
				}
			);
		}
	};

	// 动画标题
	const _zoomInOutTitle = () => {
		// zoomIn 是放大，放大的是下一个目标
		// zoomOut 是缩小，缩小的是之前元素
		// nextTabIndex 与  prevTabIndex 相同则为第一次页面加载时

		if (nextTabIndex === prevTabIndex) {
			const ZoomInTarget = Animation.current[nextTabIndex].animate(zoomIn);
			SectionTitle.slice(1).map((item, index) => Animation.current[index + 1].animate(zoomOut));
		} else {
			const ZoomInTarget = Animation.current[nextTabIndex];
			ZoomInTarget.animate(zoomIn);
			const ZoomOutTarget = Animation.current[prevTabIndex];
			ZoomOutTarget.animate(zoomOut);
		}
		// 将下一个下标赋值给前一个下标
		prevTabIndex = nextTabIndex;
	};

	// 动画标题按钮点击切换
	// 点击动画标题获取的应该是当前tab下标参数
	const changeTitleTabIndex = (currentTabIndex) => {
		setNextTabIndex(currentTabIndex);
	};

	// 手势切换ScrollView显示的区域
	const handleOnMomentumScrollEnd = ({ nativeEvent }) => {
		const position = nativeEvent.contentOffset;
		// 通过x坐标计算出下一个tab下标
		const nextTabIndex = Math.round(nativeEvent.contentOffset.x / width);
		setNextTabIndex(nextTabIndex);
	};

	// ------------------------------------------------------------
	// * 更新渲染
	// ------------------------------------------------------------
	// 利用下一个目标索引值更新界面数据
	useEffect(() => {
		_zoomInOutTitle();
		_changeSVSection();
		if (checkAnimationTitleCords) _transitionDot();
	}, [checkAnimationTitleCords, nextTabIndex]);

	return (
		<SafeAreaView style={styles.container}>
			{/* 头部滑动选项卡以及操作按钮部分 */}
			<View style={styles.headerBar}>
				<View style={{ flex: 1 }}>
					{/* 选项卡滚动区，包括选项卡指示器内容 */}
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.headerBarSVContentContainer}
					>
						<View style={styles.headerBarSVTabs}>
							{SectionTitle.map((item, index) => {
								return (
									<TouchableWithoutFeedback key={index} onPress={() => changeTitleTabIndex(index)}>
										<Animatable.View
											ref={(ref) => Animation.current.push(ref)}
											onLayout={(e) => onAnimationTitleLayout(e, index)}
										>
											<Text
												style={[
													styles.headerBarSVTabsTitle,
													{ fontWeight: nextTabIndex === index ? 'bold' : 'normal' },
												]}
											>
												{SectionTitle[index]}
											</Text>

											<View style={styles.headerBarSVTabsBadgeContainer}>
												<Text style={styles.headerBarSVTabsBadgeText}>{index}</Text>
											</View>
										</Animatable.View>
									</TouchableWithoutFeedback>
								);
							})}
						</View>
						{/* 选项卡指示器 */}
						<Animatable.View ref={AnimationDot} style={styles.headerBarDot}></Animatable.View>
					</ScrollView>
				</View>
				{/* 渐变按钮 */}
				<TouchableOpacity
					style={styles.linearGradientBtnContainer}
					onPress={async () => {
						navigation.navigate('Journal');
					}}
				>
					<LinearGradient
						locations={[0, 0.5, 1]}
						colors={['#6bc5fc', '#61d6ff', '#6bc5fc']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={styles.linearGradientBtn}
					>
						<Text style={styles.linearGradientBtnText}>发动态</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>

			{/* 列表区域 */}
			<ScrollView
				style={styles.contentContainer}
				horizontal
				pagingEnabled
				ref={scrollRef}
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={handleOnMomentumScrollEnd}
				onLayout={onSvContentContainerLayout}
			>
				<View style={[styles.swiper, { width: svContentContainerWidth }]}>
					<PostList apiPath={requestApi.getNearPostList}/>
				</View>
				<View style={[styles.swiper, { width: svContentContainerWidth }]}>
					<NearbyPeopleList />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		flex: 1,
		backgroundColor: '#f7f8f9',
	},
	headerBar: { flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5 },
	headerBarDot: { backgroundColor: 'black', width: 6, height: 3, marginTop: 5, borderRadius: 6 },
	headerBarSVContentContainer: { height: 50, flexDirection: 'column' },
	headerBarSVTabs: {
		flexDirection: 'row',
		height: 35,
		alignItems: 'flex-end',
	},
	headerBarSVTabsTitle: {
		// fontSize: 24,
		// marginTop: -20,
	},
	headerBarSVTabsBadgeContainer: {
		position: 'absolute',
		backgroundColor: 'red',
		right: -10,
		top: -25,
		width: 20,
		height: 20,
		borderRadius: 10,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerBarSVTabsBadgeText: { color: 'white', fontWeight: 'bold' },
	contentContainer: {
		margin: 0,
	},
	swiper: {
		flex: 1,
	},
	titleBadge: {
		right: 0,
		top: 0,
		fontSize: 1,
		backgroundColor: 'red',
		position: 'absolute',
	},
	linearGradientBtnContainer: { justifyContent: 'center', paddingLeft: 10 },
	linearGradientBtn: {
		alignItems: 'center',
		borderRadius: 5,
		padding: 5,
		width: 60,
		justifyContent: 'center',
	},
	linearGradientBtnText: {
		backgroundColor: 'transparent',
		fontSize: 15,
		color: '#fff',
	},
});

export default React.memo(Near);
