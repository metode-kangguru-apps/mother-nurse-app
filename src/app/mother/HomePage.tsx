import { RootState } from "@redux/types"
import { useSelector } from "react-redux"
import { Button, StyleSheet, Text, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"
import { MotherStackParamList } from "src/router/types"

interface Props extends NativeStackScreenProps<MotherStackParamList, 'home'> { }

const HomePage: React.FC<Props> = ({ navigation }) => {
    const { user } = useSelector((state: RootState) => state.authentication)
    return (
        <View style={style.container}>
            <Text style={style.title}>Hello {user?.displayName}</Text>
            <Button 
                title="mantap"
            ></Button>
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

export default HomePage