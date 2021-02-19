- @react-native-async-storage/async-storage
  - import AsyncStorage from '@react-native-async-storage/async-storage';
  - await AsyncStorage.removeItem('token');
  - const showGuide = await AsyncStorage.getItem('showGuide');

- @react-navigation/native

  - import { NavigationContainer } from '@react-navigation/native';

  - import { useNavigation, useRoute } from '@react-navigation/native';

    ```js
    const route = useRoute();
    const { images, index, userMsg, operate, cacheImage = true } = route.params;
    
    const navigation = useNavigation();
    
    navigation.setOptions({
        header: () => header界面
    })
    navigation.goBack();
    ```

    
- @react-navigation/stack
  - import { createStackNavigator, CardStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
  
    ```js
    const Stack = createStackNavigator();
    
    function MyStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      );
    }
    ```
  
    

- @react-navigation/bottom-tabs   TAB导航
  - import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



- @expo/react-native-action-sheet   底部弹出内容
  - import { ActionSheetProvider } from '@expo/react-native-action-sheet';



"expo-image-picker": "^9.2.1",



