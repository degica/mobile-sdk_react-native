import { ImageSourcePropType } from "react-native";

import { PaymentType } from "../../../util/types";

const PaymentMethodImages: { [key in PaymentType]: ImageSourcePropType } = {
  [PaymentType.CREDIT]: require("./credit_card.png"),
  [PaymentType.KONBINI]: require("./konbini.png"),
  [PaymentType.PAY_PAY]: require("./paypay.png"),
  [PaymentType.LINE_PAY]: require("./linepay.png"),
  [PaymentType.MER_PAY]: require("./merpay.png"),
  [PaymentType.BANK_TRANSFER]: require("./bank_transfer.png"),
  [PaymentType.PAY_EASY]: require("./pay_easy.png"),
  [PaymentType.WEB_MONEY]: require("./web_money.png"),
  [PaymentType.BIT_CASH]: require("./bit_cash.png"),
  [PaymentType.NET_CASH]: require("./net_cash.png"),
  [PaymentType.PAIDY]: require("./paidy.png"),
  [PaymentType.RAKUTEN]: require("./rakutenpay.png"),
  [PaymentType.AU_PAY]: require("./aupay.png"),
  [PaymentType.ALI_PAY]: require("./alipay.png"),
};

export default PaymentMethodImages;
