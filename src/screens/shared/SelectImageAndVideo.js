import React from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { AssetsSelector } from 'expo-images-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const SelectImageAndVideo = (props) => {
	console.log('SelectImageAndVideo()', props)
	const navigation = useNavigation();
	const route = useRoute();
	let assetsType = 'PICTURE';
	let maxSelections = 9;
	let goBackRouteName = 'UserDetail';

	if (route.params?.assetsType) {
		if (route.params?.assetsType === 'PICTURE') {
			assetsType = 'photo';
		} else {
			assetsType = 'video';
		}
	}

	if (route.params?.maxSelections) {
		maxSelections = parseInt(route.params.maxSelections);
	}

	if (assetsType !== 'photo' && !route.params?.maxSelections) {
		maxSelections = 1;
	}

	if (route.params?.goBackRouteName) {
		goBackRouteName = route.params.goBackRouteName;
	}

	return (
		<SafeAreaView style={styles.container}>
			<AssetsSelector
				options={{
					assetsType,
					maxSelections,
					margin: 2,
					portraitCols: 4,
					landscapeCols: 5,
					widgetWidth: 95,
					widgetBgColor: 'white',
					videoIcon: {
						Component: Ionicons,
						iconName: 'ios-videocam',
						color: 'white',
						size: 20,
					},
					selectedIcon: {
						Component: Ionicons,
						iconName: 'ios-checkmark-circle-outline',
						color: 'white',
						bg: '#4fffc880',
						size: 26,
					},
					defaultTopNavigator: {
						continueText: '确认选择',
						goBackText: '返回',
						buttonStyle: {
							backgroundColor: 'white',
							borderWidth: 1,
							borderRadius: 5,
							borderColor: '#e5e5e5',
							backgroundColor: '#eee',
							width: 100,
						},
						textStyle: { color: 'black', fontWeight: 'bold' },
						backFunction: () => navigation.goBack(),
						doneFunction: (data) => navigation.navigate(goBackRouteName, { selectFiles: data }),
					},
					noAssets: {
						Component: () => <Text>Nothing</Text>,
					},
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
});
export default SelectImageAndVideo;
