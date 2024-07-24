import { ImageSourcePropType } from "react-native";

import { KonbiniType } from "@util/types";

const KonbiniImages: { [key in KonbiniType]: ImageSourcePropType } = {
  [KonbiniType.SEVEN_ELEVEN]: require("./seven-eleven.png"),
  [KonbiniType.LAWSON]: require("./lawson.png"),
  [KonbiniType.FAMILY_MART]: require("./family-mart.png"),
  [KonbiniType.MINI_stop]: require("./ministop.png"),
  [KonbiniType.DAILY_YAMAZAKI]: require("./daily-yamazaki.png"),
  [KonbiniType.SEICOMART]: require("./seicomart.png"),
};

export default KonbiniImages;
