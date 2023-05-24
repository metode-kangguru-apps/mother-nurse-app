import { BabyStatus } from "./types";

export function selectBabyCurrentStatus(
  weight: number,
  prevWeight: number,
  tempt?: number,
) {
  if (prevWeight > weight) {
    const weightDiff = prevWeight - weight;
    return `${BabyStatus.WEIGHT_DECREASE} ${weightDiff}gr!`;
  } else if (tempt && (tempt < 36.5 || tempt > 37.5)) {
    return `${BabyStatus.TEMP_NOT_NORMAL} ${tempt}°C!`;
  } else if (weight > 2500) {
    return BabyStatus.FINNISH;
  } else {
    return BabyStatus.ON_PROGRESS;
  }
}
