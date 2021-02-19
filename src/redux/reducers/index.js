import { combineReducers } from 'redux';
import count from './count';
import user from './user';
import dict from './dict';
import badge from './badge';
import chat from './chat';
import pay from "./pay";

export default combineReducers({
	count,
	user,
	dict,
	badge,
	chat,
	pay,
});
