import { useEffect, useRef } from "react";
import { StyleSheet, PanResponder, Animated, Dimensions } from "react-native";
import { Spacing } from "src/lib/ui/spacing";
import CustomModal from "./Modal";

interface Props {
  visible: boolean;
  onCloseModal: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<Props> = ({ visible, onCloseModal, children }) => {
  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const startPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  });

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 500,
    useNativeDriver: true,
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, 1],
  });

  const handleDismiss = () => {
    closeAnim.start(onCloseModal);
  };

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.moveY > Dimensions.get("window").height - 20) {
          return handleDismiss();
        }
        return resetPositionAnim.start();
      },
    })
  ).current;

  useEffect(() => {
    if (!visible) {
      handleDismiss();
    }
  }, [visible]);

  return (
    <CustomModal
      visible={visible}
      onModalClose={handleDismiss}
      vertical="flex-end"
      onCompletelyShow={startPositionAnim.start}
    >
      <Animated.View
        style={[
          style.modalContainer,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponders.panHandlers}
      >
        {children}
      </Animated.View>
    </CustomModal>
  );
};

const style = StyleSheet.create({
  modalContainer: {
    width: "100%",
    minHeight: 200,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.base,
  },
});

export default BottomSheet;
