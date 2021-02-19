import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import PersonItem from '@/components/PersonItem';
import { FriendListData } from '@/data/friendList';

function PersonList({personList=FriendListData.docs}) {

	console.log('--PersonList')
	if (personList.length===0) {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Text>数据加载中...</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={personList}
			keyExtractor={(item, index) => item.userId.toString()}
			renderItem={({ item, index }) => {
				return <PersonItem userInfo={item} />;
			}}
		/>
	);
}

export default PersonList;
