import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { DefaultWidthSize } from "src/common/types";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { AntDesign } from "@expo/vector-icons";
import { MotherStackParamList } from "src/router/types";
import { ONBOARDING } from "./constant";
import { Platform } from "react-native";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "onboarding"> {}

interface Onboarding {
  image: string;
  content: string;
}
interface CarouselItemProps {
  item: Onboarding;
  index: number;
}

const OnboardingPage: React.FC<Props> = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileWidth, setMobileWidth] = useState(DefaultWidthSize.mobile);
  const scrollRef = useRef<ScrollView>(null);

  const styles = useMemo(() => createStyle(mobileWidth), [mobileWidth]);

  const handleNext = () => {
    const nextIndex =
      activeIndex === ONBOARDING.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = activeIndex - 1;
    setActiveIndex(previousIndex);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: activeIndex * mobileWidth,
      animated: true,
    });
  }, [activeIndex]);

  useEffect(() => {
    if (Dimensions.get("window").width < DefaultWidthSize.mobile) {
      setMobileWidth(Dimensions.get("window").width);
    } else {
      setMobileWidth(DefaultWidthSize.mobile);
    }
  }, [Dimensions.get("window").width]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        scrollEnabled={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container]}
      >
        {ONBOARDING.map((item, index) => (
          <View style={styles.carouselItem} key={index}>
            <Text style={styles.carouselText}>{index}</Text>
          </View>
        ))}
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
          {ONBOARDING.map((_, index) => (
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

const createStyle = (mobileWidth: number) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: color.primary,
      position: "relative",
    },
    container: {
      width: mobileWidth * ONBOARDING.length,
      height: "100%",
    },
    carouselItem: {
      width: mobileWidth,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
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
