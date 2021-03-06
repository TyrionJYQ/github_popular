import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, DeviceInfo } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/timeSpan';


export const TimeSpans = [new TimeSpan('今 天', 'since=daily'),
new TimeSpan('本 周', 'since=weekly'),
new TimeSpan('本 月', 'since=monthly')]

export default class TrendingDialog extends Component {
    state = {
        visible: false
    }

    show() {
        this.setState({ visible: true })
    }

    dismiss() {
        this.setState({ visible: false })
    }

    render() {
        const { onClose, onSelect } = this.props;
        const { visible } = this.state;
        return (<Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <TouchableOpacity 
                onPress={() => this.dismiss()}
                style={styles.container}>
                <MaterialIcons
                    name={'arrow-drop-up'}
                    size={36}
                    style={styles.arrow}
                />
                <View style={styles.content}>
                    {
                        TimeSpans.map((time, i, arr, ) => {
                            return <TouchableOpacity
                                onPress={() => onSelect(time)}
                                underlayColor='transparent'
                                key={i}
                            >
                                <View style={styles.text_container}>
                                    <Text style={styles.text}>{arr[i].showText}</Text>
                                    {
                                        i !== arr.length - 1 ? <View style={styles.line} /> : null
                                    }
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </View>
            </TouchableOpacity>
        </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        alignItems: 'center',
        paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    },
    arrow: {
        marginTop: 40,
        color: 'white',
        padding: 0,
        margin: -15
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3,
    },
    text_container: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray',
    },
});