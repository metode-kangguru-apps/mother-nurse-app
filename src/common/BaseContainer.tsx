import { View, StyleSheet, Platform, SafeAreaView } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useMemo, useState } from 'react'
import { DefaultWidthSize } from './types'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/types'
import { useAppDispatch } from '@redux/hooks'
import { setDateTimePickerValue } from '@redux/actions/global'
import Moment from 'moment';

const createStyle = () => {
    return StyleSheet.create({
        main: {
            flex: 1,
            alignItems: "center",
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
                }
            })
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
            {showDateTimePicker && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    onChange={(_, selectedDate) => dispatch(
                        setDateTimePickerValue({ dateTimePicker: Moment(selectedDate).format("DD/MM/YYYY") })
                    )}
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                />
            )}
        </SafeAreaView>
    )
}

export default BaseContainer