import Moment from 'moment';
import { useSelector } from 'react-redux'
import React, { useMemo, useState } from 'react'

import { DefaultWidthSize } from './types'

import { RootState } from '@redux/types'
import { useAppDispatch } from '@redux/hooks'

import { View, StyleSheet, Platform, SafeAreaView } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker"
import DatePicker from 'react-native-modern-datepicker';

import { setDateTimePickerValue, setShowDateTimePicker } from '@redux/actions/global'

import Modal from './Modal';

const createStyle = () => {
    return StyleSheet.create({
        main: {
            flex: 1,
            alignItems: "center"
        },
        container: {
            flex: 1,
            ...Platform.select({
                web: {
                    width: "100%",
                    maxWidth: DefaultWidthSize.mobile,
                },
                native: {
                    width: "100%",
                    height: "100%"
                }
            })
        },
        modalContentContainer: {
            width: 350,
            height: 350
        }
    })
}

export type Props = {
    children?: React.ReactNode
}

const BaseContainer: React.FC<Props> = ({
    children
}) => {
    // create default style
    const style = useMemo(() => createStyle(), [])
    const dispatch = useAppDispatch()
    const [date, setDate] = useState(new Date());
    const showDateTimePicker = useSelector((state: RootState) => state.global.showDateTimePicker)

    return (
        <SafeAreaView style={style.main}>
            <View style={style.container}>
                {children}
            </View>
            {showDateTimePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    onChange={(_, selectedDate) => dispatch(
                        setDateTimePickerValue({ dateTimePicker: Moment(selectedDate).format("DD/MM/YYYY") })
                    )}
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                />
            )}

            <Modal
                visible={showDateTimePicker && Platform.OS === 'web'}
                onModalClose={() => {
                    dispatch(setShowDateTimePicker({
                        showDateTimePicker: false,
                    }))
                }}
            >
                <View style={style.modalContentContainer}>
                    <DatePicker
                        style={{ borderRadius: 20 }}
                        mode="calendar"
                        onDateChange={(dateString) =>
                            dispatch(
                                setDateTimePickerValue(
                                    { dateTimePicker: Moment(new Date(dateString)).format("DD/MM/YYYY") }
                                )
                            )
                        }
                    ></DatePicker>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default BaseContainer