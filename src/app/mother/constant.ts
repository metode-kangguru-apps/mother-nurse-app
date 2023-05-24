import BabyFaceIcon from "src/lib/ui/icons/BabyFace";
import { Onboarding } from "./OnboardingPage";

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

export const MODULE_ITEM_LIST = [
  {
    icon: BabyFaceIcon,
    title: "Parent Component",
  },
  {
    icon: BabyFaceIcon,
    title: "Definisi Bayi Berat Lahir Rendah (BBLR)",
  },
  {
    icon: BabyFaceIcon,
    title: "Definisi Perawatan Metode Kanguru (PMK)",
  },
  {
    icon: BabyFaceIcon,
    title: "Manfaat PMK",
  },
  {
    icon: BabyFaceIcon,
    title: "Siapakah yang bisa melakukan PMK?",
  },
  {
    icon: BabyFaceIcon,
    title: "Kapan dan di mana PMK dilakukan?",
  },
  {
    icon: BabyFaceIcon,
    title: "Persiapan Melakukan PMK",
  },
  {
    icon: BabyFaceIcon,
    title: "Cara Melakukan PMK",
  },
  {
    icon: BabyFaceIcon,
    title: "Tanda kewaspadaan",
  },
  {
    icon: BabyFaceIcon,
    title: "Frekuensi napas normal",
  },
  {
    icon: BabyFaceIcon,
    title: "Suhu tubuh normal",
  },
];

export const ONBOARDING: Onboarding[] = [
  {
    image: require("../../../assets/onboard/B01.png"),
    title: "Apa itu BBLR?",
    content: `**Bayi Berat Lahir Rendah (BBLR)** adalah bayi dengan berat kurang dari 2,5kg ketika lahir yang disebabkan oleh kelahiran prematur atau kondisi pertumbuhan janin yang kurang memadai. \n\n**Perawatan Metode Kanguru (PMK)** yang dilakukan dengan kontak langsung kulit bayi dan ibu, terbukti dapat meningkatkan berat badan bayi.`,
  },
  {
    image: require("../../../assets/onboard/B02.png"),
    title: "Tidak hanya ibu!",
    content: `Selain ibu, PMK juga dapat dilakukan oleh ayah, nenek, atau anggota keluarga lain di rumah sakit maupun di rumah, dengan anjuran **minimal 8 jam perhari.**`,
  },
  {
    image: require("../../../assets/onboard/B03.png"),
    title: "Banyak manfaatnya, lho!",
    content: `PMK memiliki banyak manfaat lain, diantaranya mencegah bayi kedinginan, meningkatkan kemampuan menyusu bayi, menurunkan nyeri ketika dilakukan tindakan medis pada bayi, juga meningkatkan ikatan antara ibu dan bayi.`,
  },
  {
    image: require("../../../assets/onboard/M02.png"),
    title: "Yuk, disiapkan!",
    content: `Persiapan Melakukan PMK:
    - Gendongan bayi
    - Topi bayi
    - Popok
    - Ibu yang sudah dalam keadaan bersih`,
  },
];
