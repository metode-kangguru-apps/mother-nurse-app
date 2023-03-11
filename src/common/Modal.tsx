import { StyleSheet, Text, Modal, View, Pressable} from "react-native"

export type Props = {
    children?: React.ReactNode
    visible: boolean,
    onModalClose: Function
}

const CustomModal: React.FC<Props> = ({
    children,
    visible,
    onModalClose
}) => {
    return (
        <Modal 
            transparent={true} 
            visible={visible}
            animationType='fade'
        >
            <View style={style.modalContainer}>
                <Pressable 
                    style={style.overlay}
                    onPress={() => {
                        onModalClose()
                    }}
                >
                </Pressable>
                <View style={style.modalContent}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    modalContainer: {
        width: "100%",
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
    },
    modalContent: {
        position: 'relative',
        zIndex: 2
    }
})

export default CustomModal