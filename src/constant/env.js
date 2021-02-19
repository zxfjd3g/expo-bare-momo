import { Platform } from 'react-native';
import Toast from 'react-native-root-toast';

import Constants from 'expo-constants';
// export const REQUEST_BASE_URL = 'http://shejiao.free.idcfengye.com/api';
export const REQUEST_BASE_URL = 'http://shejiao.cn.utools.club/api';

export const IMAGE_URL_PREFIX = 'http://192.168.155.3:5000/';
export const IMAGE_LOADING_PLACEHOLDER = {
	uri:
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
};

export const IS_IOS = Platform.OS === 'ios' ? true : false;
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight || 0;

export const TOAST_INITIAL_OPTIONS = {
	duration: Toast.durations.SHORT,
	position: Toast.positions.BOTTOM,
	shadow: true,
	animation: true,
	hideOnPress: true,
	delay: 100,
};

export const UPLOAD_IMAGE_WIDTH = 200;

export const UPLOAD_IMAGE_COMPRESS = 0.8;
