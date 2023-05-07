import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, PanResponder, Animated, Dimensions } from "react-native";
import { Spacing } from "src/lib/ui/spacing";
import CustomModal from "./Modal";

interface Props {
  visible: boolean;
  onCloseModal: () => void;
  children: React.ReactNode;
  height?: number | string
}

const BottomSheet: React.FC<Props> = ({ visible, onCloseModal, children, height }) => {
  const screenHeight = Dimensions.get("window").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const style = useMemo(() => createStyle(height), [height])

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
        if (gs.moveY > screenHeight - 20) {
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

const createStyle = (height?: number | string) =>
  StyleSheet.create({
    modalContainer: {
      width: "100%",
      height: height,
      minHeight: 200,
      maxHeight: "100%",
      backgroundColor: "white",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: Spacing.base,
    },
  });

export default BottomSheet;
