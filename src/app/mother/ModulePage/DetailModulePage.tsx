import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";

import Markdown from "react-native-markdown-display";
import { AntDesign } from "@expo/vector-icons";
import { DefaultWidthSize } from "src/common/types";
import { MotherStackParamList } from "src/router/types";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MODULE_ITEM_LIST } from "../constant";
import { StackActions } from "@react-navigation/native";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "detail-module"> {}

const DetailModulePage: React.FC<Props> = ({ navigation, route }) => {
  const { key } = route.params;
  if (!Object.keys(MODULE_ITEM_LIST).includes(key)) {
    navigation.dispatch(StackActions.popToTop());
    return null;
  }
  const scrollRef = useRef<ScrollView>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileWidth, setMobileWidth] = useState(DefaultWidthSize.mobile);

  const styles = useMemo(
    () => createStyle(mobileWidth, key),
    [mobileWidth, key]
  );

  const handleNext = () => {
    if (activeIndex == MODULE_ITEM_LIST[key].content.length - 1) {
      navigation.pop();
    }

    const nextIndex = activeIndex + 1;
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
        {MODULE_ITEM_LIST[key].content.map((item, index) => (
          <View style={styles.carouselItem} key={index}>
            <View style={styles.contentImageContainer}>
              <Image style={styles.contentImage} source={item.image} />
            </View>
            <View style={styles.contentWrapper}>
              {item.title && (
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              )}
              {
                // @ts-ignore
                <Markdown
                  style={{
                    strong: styles.contentBold,
                    text: styles.contentText,
                    ordered_list: { flex: 1, width: "100%" },
                    list_item: { width: "100%" },
                    ordered_list_icon: styles.contentOrderedList,
                  }}
                >
                  {item.content}
                </Markdown>
              }
            </View>
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
          {MODULE_ITEM_LIST[key].content.map((_, index) => (
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

const createStyle = (mobileWidth: number, key: string) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: color.primary,
      position: "relative",
    },
    container: {
      height: "100%",
      width: mobileWidth * MODULE_ITEM_LIST[key].content.length,
    },
    carouselItem: {
      flex: 1,
      width: mobileWidth,
      paddingVertical: Spacing.xlarge,
      paddingHorizontal: Spacing.xlarge / 2,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    contentImageContainer: {
      flex: 0.4,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    contentImage: {
      width: "80%",
      height: "80%",
      resizeMode: "contain",
    },
    contentWrapper: {
      flex: 0.6,
      marginTop: Spacing.base,
      alignItems: "center",
    },
    titleContainer: {
      paddingHorizontal: Spacing.tiny,
      paddingVertical: Spacing.extratiny,
      backgroundColor: color.accent1,
      marginBottom: Spacing.base,
    },
    title: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
      color: color.lightneutral,
    },
    contentOrderedList: {
      backgroundColor: color.primary,
      color: color.lightneutral,
      fontFamily: Font.Medium,
      fontSize: TextSize.title,
    },
    contentText: {
      color: color.lightneutral,
      fontFamily: Font.Medium,
      fontSize: TextSize.title,
    },
    contentBold: {
      color: color.lightneutral,
      backgroundColor: color.accent1,
      fontFamily: Font.Bold,
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

export default DetailModulePage;
