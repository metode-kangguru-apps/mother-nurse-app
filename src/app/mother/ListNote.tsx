import { RootState } from "@redux/types"
import { useSelector } from "react-redux"
import { Button, StyleSheet, Text, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"
import { MotherStackParamList } from "src/router/types"

interface Props extends NativeStackScreenProps<MotherStackParamList, 'list-note'> { }

const ListNote: React.FC<Props> = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.user)
    if(userState.loading) return <Text>Loading...</Text>
    return (
        <View style={style.container}>
            <Text style={style.title}>List Note</Text>
            
            <Button title="Pergi Ke Menulis Note" onPress={() => navigation.navigate('add-note')}></Button>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        textAlign: "center",
        marginBottom: Spacing.extratiny
    },
})

export default ListNote