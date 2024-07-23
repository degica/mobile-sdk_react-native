import { ImageSourcePropType } from "react-native";

import { CardTypes } from "@util/types";

import CVC from "./credit_card_cvc.png";
import DEFAULT from "./credit_card_number.png";

const CardImages: { [key in CardTypes]: ImageSourcePropType } = {
  [CardTypes.VISA]: require("./visa_card.png"),
  [CardTypes.MASTER]: require("./master_card.png"),
  [CardTypes.JCB]: require("./jcb_card.png"),
  [CardTypes.AMEX]: require("./amex_card.png"),
  [CardTypes.DINERS_CLUB]: require("./diners_club_card.png"),
  [CardTypes.DISCOVER]: require("./discover_card.png"),
};

export default CardImages;
export { DEFAULT, CVC };
