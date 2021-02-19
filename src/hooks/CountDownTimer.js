import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Text, View } from 'react-native';

const CountDownTimer = forwardRef((props, ref) => {
	// 总时间（秒数)
	const [timeStamp, setTimeStamp] = useState(props.timestamp ? props.timestamp : 59);
	// 延时
	const [delay, setDelay] = useState(props.delay ? props.delay : 1000);

	// 显示时间
	const [onlySecond, setOnlySecond] = useState(props.onlySecond ? props.onlySecond : true);

	// 日、小时、分、秒
	const [days, setDays] = useState(props.days ? props.days : 0);
	const [hours, setHours] = useState(props.hours ? props.hours : 0);
	const [minutes, setMinutes] = useState(props.minutes ? props.minutes : 0);
	const [seconds, setSeconds] = useState(props.seconds ? props.seconds : 0);

	// 计时器结束时通知父组件的标志
	const [sendOnce, setSendOnce] = useState(true);

	// 最终显示时间格式的标志
	const [finalDisplayTime, setFinalDisplayTime] = useState('');

	useInterval(() => {
		if (timeStamp > 0) {
			setTimeStamp(timeStamp - 1);
		} else if (sendOnce) {
			if (props.timerCallback) {
				props.timerCallback(true);
			} else {
				console.log('CountDownTimer 请传递一个cb回调函数');
			}
			setSendOnce(false);
		}

		let delta = timeStamp;

		// 计算（并减去）整天
		let days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// 计算（并减去）整小时数
		let hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// 计算（并减去）整分钟
		let minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		// 剩下的是秒
		let seconds = delta % 60;

		setDays(days);
		setHours(hours);
		setMinutes(minutes);
		setSeconds(seconds);

		// 格式化显示时间
		const hr = hours < 10 ? `0${hours}` : hours;
		const min = minutes < 10 ? `0${minutes}` : minutes;
		const sec = seconds < 10 ? `0${seconds}` : seconds;

		let displayTime = '';

		if (days !== 0) {
			displayTime = `${days}:${hr}:${min}:${sec}`;
		}

		if (days === 0 && hours !== 0) {
			displayTime = `${hr}:${min}:${sec}`;
		}

		if (hours === 0 && minutes !== 0) {
			displayTime = `${min}:${sec}`;
		}

		if (minutes === 0 && seconds !== 0) {
			displayTime = `${min}:${sec}`;
		}

		if (onlySecond) {
			if (seconds !== 0) {
				displayTime = `(${sec})`;
			} else {
				displayTime = ``;
			}
		}

		setFinalDisplayTime(displayTime);
	}, delay);

	const refTimer = useRef();
	useImperativeHandle(ref, () => ({
		resetTimer: () => {
			// 清除天、时、分、秒
			setDays(props.days);
			setHours(props.hours);
			setMinutes(props.minutes);
			setSeconds(props.seconds);
			// 清除时间戳
			setTimeStamp(props.timestamp);
			setSendOnce(true);
		},
	}));

	return (
		<View ref={refTimer} style={props.containerStyle}>
			<Text style={props.textStyle}>{finalDisplayTime}</Text>
		</View>
	);
});

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// 记住最新的函数
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// 定时器
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => {
				clearInterval(id);
			};
		}
	}, [delay]);
}

export default CountDownTimer;
