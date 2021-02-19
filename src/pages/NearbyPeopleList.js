import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';

import NearbyPeopleItem from '@/components/NearbyPeopleItem';

import useAxios from '@/api/request';
import requestApi from '@/api/requestApi';

const limit = 5

function NearbyPeopleList() {

	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(0);

	const [refreshing, setRefreshing] = useState(false);
	const [reset, setReset] = useState(false);


	const [{ data, loading, error }, getList] = useAxios(
		{
			method: 'GET',
		},
		{ manual: true }
	);

	useEffect(() => {
		const getListData = async () => {
			if (reset) {
				let { code, data, message, ok } = await getList({
					url: requestApi.getNearPeopleList + `/1/${limit}`,
				});
				console.log('------NearbyPeopleList', data)
				const {records, pages} = data
				setPages(pages)
				await setList((list) => {
					return records;
				});
				setPage(1);
				setReset(false);
			} else {
				let { code, data, message, ok } = await getList({
					url: requestApi.getNearPeopleList + `/${page}/${limit}`,
				});
				console.log('------ else NearbyPeopleList', data.records)
				const {records, pages} = data
				setPages(pages)
				setList((list) => {
					return [...list, ...records];
				})
			}
		};
		getListData();
	}, [page]);

	const onRefreshData = async () => {
		await setReset(true);
		setPage((page) => page + 1);
	};

	const onLoadMoreData = async () => {
		await setPage((page) => page + 1);
	};

	const renderListFooterComponent = () => {
		return (
			<TouchableOpacity
				style={{ height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
				onPress={onLoadMoreData}
			>
				{loading && <ActivityIndicator style={{ marginRight: 10 }} />}
				{!loading && page<pages && <Text>点击加载更多数据</Text>}
			</TouchableOpacity>
		);
	};

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

	if (error) {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Text>{error}</Text>
			</View>
		);
	}

	if (list && list.length > 0) {
		return (
			<>
				<FlatList
					ListEmptyComponent={renderListEmptyComponent}
					ListFooterComponent={renderListFooterComponent}
					refreshing={refreshing}
					onRefresh={onRefreshData}
					data={list}
					keyExtractor={(item, index) => item.userBaseInfo ? item.userBaseInfo.userId : index}
					renderItem={({ item, index }) => {
						return <NearbyPeopleItem {...item} index={index} />;
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

export default NearbyPeopleList;
