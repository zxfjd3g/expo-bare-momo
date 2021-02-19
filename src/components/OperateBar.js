import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';
const OperateBar = ({
	id,
	commentCount,
	isPraise,
	praiseCount,
	seeCount,
	fileUrls,
	thumbnails,
	ideas,
	nickName,
	type,
}) => {
	const navigation = useNavigation();
	const route = useRoute();
	const [currentIsPraise, setCurrentIsPraise] = useState(isPraise);
	const [currentPraiseCount, setCurrentPraiseCount] = useState(praiseCount);
	const [disableToggle, setDisableToggle] = useState(false);

	const [{ data: praiseData, loading: praiseLoading, error: praiseError }, getPraise] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	const togglePraise = async () => {
		setDisableToggle(true);
		let oldIsPraise = await currentIsPraise; // 旧的点赞值
		let praiseRes = await getPraise({
			url: requestApi.getPraise + '/' + id,
		});
		await setCurrentIsPraise(!oldIsPraise);
	};

	useEffect(() => {
		if (disableToggle) {
			if (currentIsPraise) {
				setCurrentPraiseCount((count) => count + 1);
			} else {
				if (currentPraiseCount > 0) {
					setCurrentPraiseCount((count) => count - 1);
				}
			}
		}
	}, [currentIsPraise]);

	return (
		<View style={styles.operate}>
			<View style={styles.operateItem}>
				<Feather name='eye' size={24} color='grey' style={styles.operateItemIcon} />
				<Text style={styles.operateItemText}>{seeCount}</Text>
			</View>

			<TouchableOpacity style={styles.operateItem} onPress={togglePraise}>
				<Feather name='thumbs-up' size={24} color='grey' style={styles.operateItemIcon} />
				<Text style={styles.operateItemText}>{currentPraiseCount}</Text>
			</TouchableOpacity>

			<View style={styles.operateItem}>
				<Feather name='edit-3' size={24} color='grey' style={styles.operateItemIcon} />
				<Text style={styles.operateItemText}>{commentCount}</Text>
			</View>

			<TouchableOpacity
				style={styles.operateItem}
				onPress={() => {
					navigation.navigate('Journal', {
						forwardFileUrl: type === 'VIDEO' ? thumbnails : fileUrls,
						forwardPostId: id,
						forwardContent: ideas,
						forwardNickName: nickName,
					});
				}}
			>
				<Feather name='share' size={24} color='grey' style={styles.operateItemIcon} />
				<Text style={styles.operateItemText}>转发</Text>
			</TouchableOpacity>

			<View style={styles.operateItem}>
				<FontAwesome name='comment-o' size={24} color='grey' style={styles.operateItemIcon} />
				<Text style={styles.operateItemText}>打招呼</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	// 操作
	operate: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	operateItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	operateItemIcon: {
		marginRight: 5,
		color: '#adaeaf',
	},
	operateItemText: { color: '#adaeaf' },
});

export default OperateBar;
