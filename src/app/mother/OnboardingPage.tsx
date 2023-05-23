import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DefaultWidthSize } from "src/common/types";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { AntDesign } from "@expo/vector-icons";
import { MotherStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "onboarding"> {}

interface CarouselItemProps {
  index: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ index }) => {
  return (
    <View style={styles.carouselItem}>
      <Text style={styles.carouselText}>Page {index}</Text>
    </View>
  );
};

const OnboardingPage: React.FC<Props> = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const carouselData = [0, 1, 2, 3];

  const handleNext = () => {
    const nextIndex =
      activeIndex === carouselData.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = activeIndex - 1;
    setActiveIndex(previousIndex);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: activeIndex * DefaultWidthSize.mobile,
      animated: true,
    });
  }, [activeIndex]);

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <View style={styles.carousel}>
          {carouselData.map((item, index) => (
            <CarouselItem key={index} index={index} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.indicatorContainerWrapper}>
        <TouchableOpacity
          disabled={activeIndex === 0}
          style={[
            styles.button,
            activeIndex === 0 ? styles.buttonNotActive : undefined,
          ]}
          onPress={handlePrevious}
        >
          <AntDesign
            name="arrowleft"
            size={28}
            color={activeIndex === 0 ? color.primary : color.accent3}
          />
        </TouchableOpacity>
        <View style={styles.indicatorContainer}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeIndex === index ? styles.activeIndicator : null,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <AntDesign name="arrowright" size={28} color={color.accent3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: color.primary,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carousel: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
  },
  carouselItem: {
    flex: 1,
    width: "100%",
    minWidth: DefaultWidthSize.mobile,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  indicatorContainerWrapper: {
    width: "100%",
    position: "absolute",
    bottom: Spacing.base,
    padding: Spacing.base,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: Spacing.tiny,
    height: Spacing.tiny,
    borderRadius: Spacing.extratiny,
    marginHorizontal: Spacing.extratiny,
    backgroundColor: color.lightneutral,
  },
  activeIndicator: {
    backgroundColor: color.accent3,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    width: (Spacing.xlarge * 2) / 3,
    height: (Spacing.xlarge * 2) / 3,
    borderRadius: (Spacing.xlarge * 2) / 3,
    backgroundColor: color.lightneutral,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonNotActive: {
    backgroundColor: color.accent3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingPage;
