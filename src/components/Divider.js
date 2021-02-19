import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Divider = (props) => {
	const { text, color, marginTop, marginBottom, borderBottomWidth, borderBottomColor } = props;

	const renderDivider = () => {
		let renderElement = null;
		if (text) {
			renderElement = (
				<View style={styles.dividerContainer}>
					<View
						style={[
							styles.dividerLeftAndRigth,
							styles.divider,
							,
							{ marginTop, marginBottom, borderBottomWidth, borderBottomColor },
						]}
					></View>
					<Text style={{ color }}>{text}</Text>
					<View
						style={[
							styles.dividerLeftAndRigth,
							styles.divider,
							,
							{ marginTop, marginBottom, borderBottomWidth, borderBottomColor },
						]}
					></View>
				</View>
			);
		} else {
			renderElement = (
				<View
					style={[styles.divider, { marginTop, marginBottom, borderBottomWidth, borderBottomColor }]}
				></View>
			);
		}
		return renderElement;
	};

	return renderDivider();
};

Divider.propTypes = {
	text: PropTypes.string,
	color: PropTypes.string,
	marginTop: PropTypes.number,
	marginBottom: PropTypes.number,
	borderBottomWidth: PropTypes.number,
	borderBottomColor: PropTypes.string,
};

Divider.defaultProps = {
	text: null,
	color: '#c7c8c9',
	marginTop: 10,
	marginBottom: 10,
	borderBottomWidth: 0.5,
	borderBottomColor: '#c7c8c9',
};

const styles = StyleSheet.create({
	dividerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
	dividerLeftAndRigth: {
		flex: 1,
	},
	divider: {
		width: '100%',
	},
});
export default Divider;
