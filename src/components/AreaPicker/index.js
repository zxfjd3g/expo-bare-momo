import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import areaData from './areaHelper.json';

const AreaPicker = (props) => {
	const refPicker = useRef(null);
	const [provinceList, setProvinceList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [areaList, setAreaList] = useState([]);

	const [selectProvince, setSelectProvince] = useState(null);
	const [selectCity, setSelectCity] = useState(null);
	const [selectArea, setSelectArea] = useState(null);

	// 获取省份
	const _getProvince = () => {
		const data = [];
		const len = areaData.length;
		for (let i = 0; i < len; i++) {
			data.push({ name: areaData[i].name, id: areaData[i].id });
		}
		return data;
	};

	// 获取城市
	const _getCity = (select_Province, select_City) => {
		const province = areaData.find((item) => item.id === select_Province);
		const cities = province.city;
		const data = [];
		const len = cities.length;
		for (let i = 0; i < len; i++) {
			data.push({ name: cities[i].name, id: cities[i].id });
		}
		return data;
	};

	// 获取地区
	const _getArea = (select_Province, select_City, select_Area) => {
		const province = areaData.find((item) => item.id === select_Province);
		const cities = province.city;
		const city = cities.find((city) => city.id === select_City);
		const data = (city && city.area) || [];
		return data;
	};

	// 初始化地区信息
	useEffect(() => {
		const initArea = async () => {
			const provinceList = _getProvince();
			if (props.province) {
				// 如果有传递属性值

				const cityList = _getCity(props.province, props.city);
				const areaList = _getArea(props.province, props.city, props.area);
				Promise.all([
					setProvinceList(provinceList),
					setCityList(cityList),
					setAreaList(areaList),
					setSelectProvince(props.province),
					setSelectCity(props.city),
					setSelectArea(props.area),
				]);
			} else {
				// 省
				const province = areaData[0].id;

				// 市
				const city = areaData[0].city[0].id;
				const cityList = _getCity(province, city);

				// 区
				const area = areaData[0].city[0].area;
				const areaList = _getArea(province, city, area);

				setSelectCity(city),
					Promise.all([
						setProvinceList(provinceList),
						setSelectProvince(province),
						setCityList(cityList),
						setSelectCity(city),
						setAreaList(areaList),
						setSelectArea(area),
					]);
			}
		};
		initArea();
		return initArea;
	}, [props.province, props.city, props.area]);

	// 渲染省份
	const _renderProvince = () => {
		const provinceListPickerItem = [];
		provinceList.forEach((item, index) => {
			provinceListPickerItem.push(<Picker.Item label={item.name} value={item.id} key={index} />);
		});
		return provinceListPickerItem;
	};

	// 渲染城市
	const _renderCity = () => {
		const cityListPickerItem = [];
		cityList.forEach((item, index) => {
			cityListPickerItem.push(<Picker.Item label={item.name} value={item.id} key={index} />);
		});
		return cityListPickerItem;
	};

	// 渲染地区
	const _renderArea = () => {
		const areaListPickerItem = [];
		areaList.forEach((item, index) => {
			areaListPickerItem.push(<Picker.Item label={item.name} value={item.id} key={index} />);
		});
		return areaListPickerItem;
	};

	const changeSelectProvince = (province, index) => {
		// province获取到的就是id值
		const provinceList = _getProvince();

		const city = areaData[index].city[0].id;
		const cityList = _getCity(province, city);

		const area = areaData[index].city[0].area[0].id;
		const areaList = _getArea(province, city, area);

		Promise.all([
			setProvinceList(provinceList),
			setSelectProvince(province),
			setCityList(cityList),
			setSelectCity(city),
			setAreaList(areaList),
			setSelectArea(area),
		]);
	};

	// 修改城市
	const changeSelectCity = (city, index) => {
		const province = areaData.find((item) => item.id === selectProvince);
		const areaList = province.city[index].area;
		Promise.all([setSelectCity(city), setAreaList(areaList), setSelectArea(areaList[0].id)]);
	};

	// 修改地区
	const changeSelectArea = (area, index) => {
		setSelectArea(area);
	};

	// 将数据返回给父组件
	useEffect(() => {
		props.getData({
			province: selectProvince,
			city: selectCity,
			area: selectArea,
		});
	}, [selectProvince, selectCity, selectArea]);

	return (
		<View style={{ flexDirection: 'row' }}>
			<View style={{ flex: 1 }}>
				<Picker
					selectedValue={selectProvince}
					onValueChange={(itemValue, itemIndex) => changeSelectProvince(itemValue, itemIndex)}
				>
					{_renderProvince()}
				</Picker>
			</View>
			<View style={{ flex: 1 }}>
				<Picker
					selectedValue={selectCity}
					onValueChange={(itemValue, itemIndex) => changeSelectCity(itemValue, itemIndex)}
				>
					{_renderCity()}
				</Picker>
			</View>
			<View style={{ flex: 1 }}>
				<Picker
					selectedValue={selectArea}
					onValueChange={(itemValue, itemIndex) => changeSelectArea(itemValue, itemIndex)}
				>
					{_renderArea()}
				</Picker>
			</View>
		</View>
	);
};

export default AreaPicker;
