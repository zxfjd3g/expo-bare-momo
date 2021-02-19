import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

import { getAstro } from '@/utils/util';

/* 
注册后完善用户信息界面
*/
const UserInfo = (props) => {
	const navigation = useNavigation();
	const route = useRoute();

	const [nickName, setNickName] = useState('chinavane');
	const [birthday, setBirthday] = useState('');
	const [birthdayAstro, setBirthdayAstro] = useState('');
	const [sex, setSex] = useState('');
	const [disableNextBtn, setDisableNextBtn] = useState(true);

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [userMobile] = useState(route.params?.userMobile);
	const [token] = useState(route.params?.token);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		const birthday = dayjs(date).format('YYYY-MM-DD');
		const astro = getAstro(dayjs(date).format('MM'), dayjs(date).format('DD'));
		setBirthday(date);
		setBirthdayAstro(birthday + `(${astro})`);
		hideDatePicker();
	};

	const onChangeNickName = (text) => {
		setNickName(text);
	};

	const onChangeSex = (sex) => {
		setSex(sex);
	};

	const onNextSubmit = () => {
		navigation.navigate('UploadPhoto', { userMobile, token, nickName, sex, birthday });
	};

	useEffect(() => {
		if (nickName.length > 0 && sex.length > 0 && birthday.toString().length > 0) {
			setDisableNextBtn(false);
		} else {
			setDisableNextBtn(true);
		}
	}, [nickName, sex, birthday]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.loginContainer}>
				<Text style={styles.loginTitleText}>填写资料</Text>
				<Text style={styles.loginTitleText}>提升自身魅力</Text>

				<View style={styles.textInputContainer}>
					<TextInput
						style={styles.nickName}
						placeholder='填写昵称'
						value={nickName}
						onChangeText={onChangeNickName}
						clearButtonMode='while-editing'
						placeholderTextColor='gray'
					/>
				</View>

				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					mode='date'
					locale='zh_CN'
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
					cancelTextIOS='取消'
					confirmTextIOS='确认'
					headerTextIOS='选择生日'
				/>

				<TouchableOpacity style={styles.textInputContainer} onPress={showDatePicker}>
					<Text style={[styles.birthday, { color: birthday.length > 0 ? 'black' : 'gray' }]}>
						{birthday.length === 0 ? '选择生日' : birthdayAstro}
					</Text>
					<FontAwesome
						name='angle-down'
						size={24}
						color='gray'
						style={[styles.inputTextIconContainer, { color: birthday.length > 0 ? 'black' : 'gray' }]}
					/>
				</TouchableOpacity>

				<View style={styles.sexContainer}>
					<TouchableOpacity
						style={[
							styles.sexIconAndTextContainer,
							{ borderBottomColor: sex === 'WOMAN' ? '#f8425b' : 'gray' },
						]}
						onPress={() => onChangeSex('WOMAN')}
					>
						<FontAwesome name='female' size={24} style={{ color: sex === 'WOMAN' ? '#f8425b' : 'gray' }} />
						<Text style={[styles.sexTexT, { color: sex === 'WOMAN' ? '#f8425b' : 'gray' }]}>女生</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.sexIconAndTextContainer,
							{ borderBottomColor: sex === 'MAN' ? '#76daf6' : 'gray' },
						]}
						onPress={() => onChangeSex('MAN')}
					>
						<FontAwesome name='male' size={24} style={{ color: sex === 'MAN' ? '#76daf6' : 'gray' }} />
						<Text style={[styles.sexTexT, { color: sex === 'MAN' ? '#76daf6' : 'gray' }]}>男生</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.sexTip}>注册成功后，性别不可修改</Text>

				<TouchableOpacity
					style={[styles.loginBtnContainer, { backgroundColor: !disableNextBtn ? '#55d8f1' : '#d6d7d8' }]}
					onPress={onNextSubmit}
					disabled={disableNextBtn}
				>
					<Text style={styles.loginBtn}>下一步</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	loginContainer: {
		margin: 30,
		flexDirection: 'column',
	},
	// 登录标题
	loginTitleText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#3a3b3c',
		marginTop: 10,
	},
	loginContentText: {
		marginTop: 10,
	},
	// 登录按钮容器
	loginBtnContainer: {
		marginTop: 30,
		backgroundColor: '#d6d7d8',
		padding: 20,
		borderRadius: 30,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	// 登录按钮
	loginBtn: {
		color: '#fbfcfc',
	},
	// 输入框容器
	textInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomColor: '#bdd6d8',
		borderBottomWidth: 0.5,
		height: 65,
	},
	// 输入框后面功能图标容器
	inputTextIconContainer: {
		marginLeft: 5,
		marginTop: 10,
		width: 20,
	},
	// 用户名
	nickName: {
		flex: 1,
		marginTop: 20,
		height: 50,
		fontSize: 18,
		color: '#111',
	},
	birthday: {
		flex: 1,
		marginTop: 20,
		height: 30,
		fontSize: 18,
		color: '#111',
	},
	sexContainer: {
		flexDirection: 'row',
		height: 50,
		marginTop: 20,
	},
	sexIconAndTextContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		borderBottomWidth: 3,
		borderBottomColor: 'gray',
	},
	sexTexT: {
		color: 'gray',
		fontSize: 18,
		marginLeft: 10,
	},
	sexTip: {
		marginTop: 10,
		color: 'gray',
	},
});
export default UserInfo;
