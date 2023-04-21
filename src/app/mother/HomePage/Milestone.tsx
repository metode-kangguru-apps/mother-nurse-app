import { StyleSheet, Text, View } from "react-native";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Stones } from "./type";
import { memo, useEffect, useState } from "react";

interface Props {
  currentWeight: number;
  stones?: number[];
}

const Milestone: React.FC<Props> = ({
  currentWeight,
  stones = [1500, 1800, 2000, 2500, 2800],
}) => {
  const [currentProgressWidth, setCurrentProgressWidth] =
    useState<string>("4%");
  useEffect(() => {
    if (currentWeight > stones[stones.length - 1]) {
      setCurrentProgressWidth("100%")
      return
    } else if (currentWeight < stones[0]) {
      setCurrentProgressWidth("0%")
      return
    }
    for (let idx = 0; idx < stones.length - 1; idx++) {
      if (currentWeight > stones[idx] && currentWeight < stones[idx + 1]) {
        const lowerLimit = currentWeight - stones[idx];
        const upperLimit = stones[idx + 1] - stones[idx];
        const percentage = (lowerLimit / upperLimit) * 25;
        const majorPercentage = (idx / (stones.length - 1)) * 100;
        setCurrentProgressWidth(`${majorPercentage + percentage}%`);
      }
    }
  }, [currentWeight]);
  return (
    <View style={style.container}>
      <View style={style.milestoneLine}>
        <View
          style={[style.progressLine, { width: currentProgressWidth }]}
        ></View>
      </View>
      <View style={[style.progressStoneWrapper, { left: "4%" }]}>
        <View style={style.progressStone}>
          {currentWeight >= stones[0] && (
            <View style={style.progressStoneDone}>
              <View style={style.progressStoneDoneInside}></View>
            </View>
          )}
        </View>
        <Text style={style.progressStoneInfo}>1500 gr</Text>
      </View>
      <View style={[style.progressStoneWrapper, { left: "25%" }]}>
        <View style={style.progressStone}>
          {currentWeight >= stones[1] && (
            <View style={style.progressStoneDone}>
              <View style={style.progressStoneDoneInside}></View>
            </View>
          )}
        </View>
        <Text style={style.progressStoneInfo}>1800 gr</Text>
      </View>
      <View style={style.progressStoneWrapper}>
        <View style={style.progressStone}>
          {currentWeight >= stones[2] && (
            <View style={style.progressStoneDone}>
              <View style={style.progressStoneDoneInside}></View>
            </View>
          )}
        </View>
        {/* <Text style={style.targetStoneInfo}>Target</Text> */}
        <Text style={style.progressStoneInfo}>2000 gr</Text>
      </View>
      <View style={[style.progressStoneWrapper, { right: "25%" }]}>
        <View style={style.progressStone}>
          {currentWeight >= stones[3] && (
            <View style={style.progressStoneDone}>
              <View style={style.progressStoneDoneInside}></View>
            </View>
          )}
        </View>
        <Text style={style.targetStoneInfo}>Target</Text>
        <Text style={[style.progressStoneInfo, style.targetStone]}>
          2500 gr
        </Text>
      </View>
      <View style={[style.progressStoneWrapper, { right: "4%" }]}>
        <View style={style.progressStone}>
          {currentWeight >= stones[4] && (
            <View style={style.progressStoneDone}>
              <View style={style.progressStoneDoneInside}></View>
            </View>
          )}
        </View>
        <Text style={style.progressStoneInfo}>2800 gr</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    padding: Spacing.base,
    display: "flex",
    alignItems: "center",
  },
  milestoneLine: {
    height: 8,
    width: "92%",
    backgroundColor: "#418780",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  progressLine: {
    height: 3,
    borderRadius: 3,
    backgroundColor: color.lightneutral,
  },
  progressStoneWrapper: {
    position: "absolute",
    top: 16,
    display: "flex",
    alignItems: "center",
  },
  progressStone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#418780",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStoneDone: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: color.lightneutral,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStoneDoneInside: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#418780",
  },
  targetStoneInfo: {
    color: color.lightneutral,
  },
  targetStone: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
  },
  progressStoneInfo: {
    fontFamily: Font.Regular,
    color: color.lightneutral,
  },
});
export default memo(Milestone);
