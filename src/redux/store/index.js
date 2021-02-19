import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '@/redux/reducers';

const persistConfig = {
	key: 'root_2',
	storage: AsyncStorage,
	blacklist: ['badge'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

export { store, persistor };
