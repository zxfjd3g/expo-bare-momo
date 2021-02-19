import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LikePeopleItem from '@/components/LikePeopleItem'

import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

const limit = 5

function LikeList(props) {

	const navigation = useNavigation();
	const route = useRoute();

	const {isMyLike} = route.params

  const [list, setList] = useState([]);

	const [{ data, loading, error }, fetchData] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {

		const getLikeList = async () => {
			const {code,data} = await fetchData({
				url: isMyLike ? requestApi.getMyLikeList : requestApi.getLikeMyList
			})
			console.log('----Home getLikeList', code, data)
			setList(data)
		}

		getLikeList()
	}, [isMyLike])

	const renderListEmptyComponent = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Text>暂无数据，请稍后...</Text>
			</View>
		);
	};

	if (list && list.length > 0) {
		return (
			<>
				<FlatList
					ListEmptyComponent={renderListEmptyComponent}
					data={list}
					keyExtractor={(item) => item.userId+''}
					renderItem={({ item, index }) => {
						return <LikePeopleItem {...item} index={index} />;
					}}
				/>
			</>
		);
	} else {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Text> 数据加载中...</Text>
			</View>
		);
	}
	
	
}

export default LikeList;

/* 
	{
    "age": 10,
    "avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    "isVip": 0,
    "nickName": "晴天_34",
    "pictures": Array [
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
      "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    ],
    "sex": "WOMAN",
    "signature": "爱拼才会赢",
    "userId": 46,
  }
*/