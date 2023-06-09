import { color } from "src/lib/ui/color";
import { ImageSourcePropType } from "react-native";

import WindIcon from "src/lib/ui/icons/Wind";
import HouseIcon from "src/lib/ui/icons/House";
import FamilyIcon from "src/lib/ui/icons/Family";
import MotherIcons from "src/lib/ui/icons/Mother";
import PMKCareIcon from "src/lib/ui/icons/PMKCare";
import WarningIcon from "src/lib/ui/icons/Warning";
import BabyFaceIcon from "src/lib/ui/icons/BabyFace";
import TemperatureIcon from "src/lib/ui/icons/Temperature";
import PMKDefinitionIcon from "src/lib/ui/icons/PMKDefinition";

export const BABY_CARE_LIST: string[] = [
  "Semakin sering ibu menyusui bayi, produksi ASI akan terus bertambah.",
  "Memberikan ASIi, artinya memberikan nutrisi terbaik bagi bayi.",
  "Bayi yang dilakukan PMK memiliki durasi menyusu yang lebih lama.",
  "Melalui perawatan metode kanguru, ikatan batin ibu dengan bayi menjadi semakin erat.",
  "Kontak kulit ibu ke kulit bayi bisa menyalurkan kehangatan sehingga bayi tidak mudah kedinginan.",
  "Saat melakukan PMK, kehangatan tubuh ibu bisa tersalur ke tubuh bayi, sehingga bayi tidak mudah kedinginan.",
  "Perawatan Metode Kanguru terbukti memberikan dampak positif bagi frekuensi napas bayi.",
  "Melakukan PMK pada bayi bermanfaat untuk menurunkan rasa nyeri.",
  "Riset membuktikan bahwa bayi yang dilakukan PMK memiliki frekuensi pernapasan lebih stabil.",
  "Mengajak bicara bayi sejak dini berarti melatih bayi berkomunikasi.",
];

export interface Subject {
  image: ImageSourcePropType;
  title?: string;
  content: string;
}
export interface Module {
  icon: JSX.Element;
  title: string;
  content: Subject[];
}

type ModuleData = {
  [key: string]: Module;
};

export const MODULE_ITEM_LIST: ModuleData = {
  "definisi-bblr": {
    icon: BabyFaceIcon({}),
    title: "Definisi Bayi Berat Lahir Rendah (BBLR)",
    content: [
      {
        image: require("../../../assets/module/M03.png"),
        title: "Apa itu BBLR?",
        content: `BBLR adalah bayi yang dilahirkan dengan berat badan kurang dari 2.500 gram (2,5 kg). `,
      },
      {
        image: require("../../../assets/module/A02.png"),
        title: "Apa itu BBLR?",
        content: `BBLR bisa disebabkan oleh kelahiran prematur maupun kondisi pertumbuhan janin yang kurang memadai selama di dalam rahim. `,
      },
    ],
  },
  "definisi-pmk": {
    icon: MotherIcons({ color: color.primary, width: 20, height: 26, viewBox: "0 0 28 34" }),
    title: "Definisi Perawatan Metode Kanguru (PMK)",
    content: [
      {
        image: require("../../../assets/module/M03.png"),
        title: "PMK untuk BBLR",
        content: `Perawatan Metode Kanguru (PMK) atau Kangaroo Mother Care (KMC) merupakan perawatan pada BBLR dengan cara kontak langsung kulit bayi dengan kulit ibu.`,
      },
    ],
  },
  "manfaat-pmk": {
    icon: PMKCareIcon({}),
    title: "Manfaat PMK",
    content: [
      {
        image: require("../../../assets/module/M02.png"),
        title: "Banyak manfaatnya, lho!",
        content: `PMK memiliki banyak manfaat bagi bayi, ibu, dan rumah sakit.`,
      },
      {
        image: require("../../../assets/module/M01.png"),
        title: "Banyak manfaatnya, lho!",
        content: `1. Meningkatkan suhu tubuh bayi sehingga tidak kedinginan (hipotermi)\n2. Meningkatkan berat badan bayi\n3. Menurunkan angka kematian bayi
        `,
      },
      {
        image: require("../../../assets/module/M06.png"),
        title: "Banyak manfaatnya, lho!",
        content: `4. Menurunkan kejadian infeksi pada bayi\n5. Meningkatkan kemampuan menyusu bayi\n6. Meningkatkan durasi/lama waktu menyusu`,
      },
      {
        image: require("../../../assets/module/A12.png"),
        title: "Banyak manfaatnya, lho!",
        content: `7. Menurunkan nyeri ketika bayi dilakukan tindakan medis\n8. Menurunkan lama rawat inap di rumah sakit\n9. Meningkatkan ikatan antara ibu dan bayi
        `,
      },
    ],
  },
  "actor-pmk": {
    icon: FamilyIcon({}),
    title: "Siapakah yang bisa melakukan PMK?",
    content: [
      {
        image: require("../../../assets/module/B02.png"),
        title: "Tidak hanya ibu!",
        content: `PMK bisa dilakukan oleh ibu maupun ayah bahkan nenek, kakek, paman, atau anggota keluarga yang lain.`,
      },
    ],
  },
  "pmk-waktu": {
    icon: HouseIcon({}),
    title: "Kapan dan di mana PMK dilakukan?",
    content: [
      {
        image: require("../../../assets/module/A02.png"),
        title: "Kapan bisa mulai PMK?",
        content: `PMK dapat dilakukan seawal mungkin (sejak 24 jam pertama kelahiran).`,
      },
      {
        image: require("../../../assets/module/A02.png"),
        title: "Berapa lama?",
        content: `Berdasarkan anjuran dari WHO, PMK dilakukan selama 8 sampai dengan 24 jam per hari.`,
      },
      {
        image: require("../../../assets/module/A02.png"),
        title: "Tidak hanya di rumah sakit.",
        content: `PMK bisa dilakukan di rumah sakit dan berlanjut sampai di rumah.`,
      },
    ],
  },
  "tutorial-pmk": {
    icon: PMKDefinitionIcon({}),
    title: "Cara Melakukan PMK",
    content: [
      {
        image: require("../../../assets/module/M07.png"),
        title: "Yuk, disiapkan!",
        content: `Perlu disiapkan beberapa hal sebelum melakukan PMK`,
      },
      {
        image: require("../../../assets/module/B03.png"),
        title: "Yuk, disiapkan!",
        content: `1. Gendongan bayi\n2. Topi bayi\n3. Popok\n4. Ibu yang sudah dalam keadaan bersih`,
      },
      {
        image: require("../../../assets/module/G01.gif"),
        title: "Perhatikan!",
        content: `1. Cuci tangan dengan sabun dan air mengalir\n2. Lepaskan pakaian atas`,
      },
      {
        image: require("../../../assets/module/G02.gif"),
        title: "Perhatikan!",
        content: `3. Memegang bayi dengan satu tangan diletakkan di belakang leher sampai punggung bayi.  Menopang bagian bawah rahang bayi dengan ibu jari dan jari-jari lainnya serta menempatkan tangan yang lain di bawah pantat bayi
        `,
      },
      {
        image: require("../../../assets/module/G03.gif"),
        title: "Perhatikan!",
        content: `4. Meletakkan bayi dalam gendongan kanguru`,
      },
      {
        image: require("../../../assets/module/G04.gif"),
        title: "Perhatikan!",
        content: `5. Meletakkan bayi tegak lurus di dada ibu\n6. Dada bayi menempel dengan dada ibu (kulit bayi menempel dengan kulit ibu)\n7. Kepala bayi dipalingkan ke arah kanan atau kiri dengan sedikit tengadah`,
      },
      {
        image: require("../../../assets/module/M06.png"),
        title: "Perhatikan!",
        content: `8. Memeriksa jalan napas bayi tidak terganggu ketika bayi berada pada posisi tegak`,
      },
      {
        image: require("../../../assets/module/G05.gif"),
        title: "Perhatikan!",
        content: `9. Memposisikan tangan bayi dalam keadaan terbuka, sedangkan pangkal paha bayi diposisikan seperti katak`,
      },
      {
        image: require("../../../assets/module/G06.gif"),
        title: "Perhatikan!",
        content: `10. Memastikan bahwa kain gendongan diikatkan cukup kuat, namun tidak terlalu ketat dan tidak terlalu longgar\n11. Leher bayi ditopang menggunakan kain gendongan dengan cara tepi atas gendongan berada di batas bawah telinga bayi`,
      },
      {
        image: require("../../../assets/module/G07.gif"),
        title: "Perhatikan!",
        content: `12. Ibu mengenakan pakaian luar`,
      },
    ],
  },
  "warning-sign": {
    icon: WarningIcon({}),
    title: "Tanda kewaspadaan",
    content: [
      {
        image: require("../../../assets/module/M04.png"),
        title: "Hati-hati!",
        content: `Selama melakukan PMK, perhatikan adanya tanda bahaya pada bayi!`,
      },
      {
        image: require("../../../assets/module/A04.png"),
        title: "Hati-hati!",
        content: `Napas bayi terlalu pelan, terlalu cepat, atau henti napas (bayi tidak bernapas)`,
      },
    ],
  },
  "breath-freq": {
    icon: WindIcon({}),
    title: "Frekuensi napas normal",
    content: [
      {
        image: require("../../../assets/module/M03.png"),
        title: "Yuk, perhatikan!",
        content: `Bayi baru lahir sampai dengan usia 40 hari (neonatus) dikatakan memiliki frekuensi napas normal jika berada dalam rentang 40 sampai 60 kali/menit`,
      },
      {
        image: require("../../../assets/module/M05.png"),
        title: "Yuk, perhatikan!",
        content: `Apabila frekuensi napasnya kurang dari 40 x/menit, bayi bernapas lambat, sedangkan jika lebih dari 60 kali/menit, disebut napas cepat`,
      },
    ],
  },
  "body-temp": {
    icon: TemperatureIcon({}),
    title: "Suhu tubuh normal",
    content: [
      {
        image: require("../../../assets/module/A09.png"),
        title: "Bayi demam?",
        content: `Suhu tubuh normal yaitu **36,5°C sampai dengan 37,5°C**. Suhu tubuh di bawah 36,5°C disebut hipotermi (suhu tubuh rendah), sedangkan suhu tubuh di atas 37,5°C disebut hipertermi (demam).`,
      },
    ],
  },
};

export const ONBOARDING: Subject[] = [
  {
    image: require("../../../assets/module/B01.png"),
    title: "Apa itu BBLR?",
    content: `**Bayi Berat Lahir Rendah (BBLR)** adalah bayi dengan berat kurang dari 2,5kg ketika lahir yang disebabkan oleh kelahiran prematur atau kondisi pertumbuhan janin yang kurang memadai. \n\n**Perawatan Metode Kanguru (PMK)** yang dilakukan dengan kontak langsung kulit bayi dan ibu, terbukti dapat meningkatkan berat badan bayi.`,
  },
  {
    image: require("../../../assets/module/B02.png"),
    title: "Tidak hanya ibu!",
    content: `Selain ibu, PMK juga dapat dilakukan oleh ayah, nenek, atau anggota keluarga lain di rumah sakit maupun di rumah, dengan anjuran **minimal 8 jam perhari.**`,
  },
  {
    image: require("../../../assets/module/M02.png"),
    title: "Banyak manfaatnya, lho!",
    content: `PMK memiliki banyak manfaat lain, diantaranya mencegah bayi kedinginan, meningkatkan kemampuan menyusu bayi, menurunkan nyeri ketika dilakukan tindakan medis pada bayi, juga meningkatkan ikatan antara ibu dan bayi.`,
  },
  {
    image: require("../../../assets/module/B03.png"),
    title: "Yuk, disiapkan!",
    content: `Persiapan Melakukan PMK:
    - Gendongan bayi
    - Topi bayi
    - Popok
    - Ibu yang sudah dalam keadaan bersih`,
  },
];
