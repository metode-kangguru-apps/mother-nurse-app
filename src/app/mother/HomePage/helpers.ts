
// idx 1 is 28 week gestation age
// < 37 week 3%, 10%, 50%, 2,5kg, 90%

import { Gender } from "../ProfilePage/BabyCard";

// need to ask for laki laki
export const MILESTONE_CRITERIA = {
    "laki-laki": [
        [600, 790, 1090, 1350, 2500],
        [680, 860, 1220, 1520, 2500],
        [790, 990, 1490, 1720, 2500],
        [900, 1120, 1590, 1990, 2500],
        [1040, 1300, 1800, 2210, 2500],
        [1250, 1500, 2000, 2400, 2500],
        [1490, 1710, 2260, 2500, 2750],
        [1700, 1950, 2500, 2605, 3010],
        [1910, 2180, 2500, 2710, 3290],
        [2140, 2390, 2500, 2950, 3510],
    ],
    perempuan: [
        [550, 700, 1010, 1290, 2500],
        [680, 790, 1150, 1520, 2500],
        [700, 890, 1390, 1690, 2500],
        [810, 1100, 1495, 1900, 2500],
        [995, 1220, 1640, 2170, 2500],
        [1160, 1395, 1895, 2400, 2500],
        [1390, 1600, 2105, 2500, 2640],
        [1600, 1730, 2340, 2500, 2910],
        [1825, 2050, 2500, 2600, 3100],
        [2070, 2390, 2500, 2850, 3470],
    ]
}

export function helperMilstoneSelectionWeek(
    gender: "laki-laki" | "perempuan", week: number
): number[] {
    if (week < 28) {
        return MILESTONE_CRITERIA[gender][0]
    } else if (week > 37) {
        const lastIndex =  MILESTONE_CRITERIA[gender].length - 1
        return MILESTONE_CRITERIA[gender][lastIndex]
    } else {
        const indexWeek = week - 28
        return MILESTONE_CRITERIA[gender][indexWeek]
    }
}