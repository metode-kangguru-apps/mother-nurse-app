import { useMemo } from "react";
import { StyleSheet, Modal, View, Pressable, Platform } from "react-native";
import { DefaultWidthSize } from "./types";

export type Props = {
  children?: React.ReactNode;
  visible: boolean;
  modalClosable?: boolean;
  onModalClose?: () => void;
  onCompletelyShow?: () => void;
  vertical?: "flex-end" | "center" | "flex-start";
  horizontal?: "flex-end" | "center" | "flex-start";
};

const CustomModal: React.FC<Props> = ({
  children,
  visible,
  onModalClose,
  onCompletelyShow,
  modalClosable = true,
  vertical = "center",
  horizontal = "center",
}) => {
  const style = useMemo(
    () => createStyle(horizontal, vertical),
    [horizontal, vertical]
  );
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onShow={() => onCompletelyShow && onCompletelyShow()}
      hardwareAccelerated={false}
    >
      <View style={style.modalContainer}>
        {modalClosable ? (
          <Pressable
            style={style.overlay}
            onPress={() => {
              onModalClose && onModalClose();
            }}
          />
        ) : (
          <View style={style.overlay} />
        )}

        <View style={style.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const createStyle = (
  contentHPoss: "flex-end" | "center" | "flex-start",
  contentVPoss: "flex-end" | "center" | "flex-start"
) =>
  StyleSheet.create({
    modalContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: contentVPoss,
      alignItems: contentHPoss,
    },
    overlay: {
      flex: 1,
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
    },
    modalContent: {
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      width: "100%",
      zIndex: 2,
      ...Platform.select({
        web: {
          maxWidth: DefaultWidthSize.mobile,
        },
      }),
    },
  });

export default CustomModal;
