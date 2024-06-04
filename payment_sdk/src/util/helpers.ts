export const formatExpiry = (expiry: string, previousString: string) => {
  let constructedExpiry = expiry.replace("/", "");
  const seperatorAppended = previousString?.includes("/");
  if (constructedExpiry?.length >= 2 && !seperatorAppended) {
    const arrayOfChars = constructedExpiry.split("");
    arrayOfChars.splice(2, 0, "/");
    console.log(arrayOfChars.join(""), expiry);
    return arrayOfChars.join("");
  }
  return expiry;
};

export const getMonthYearFromExpiry = (expiry: string) => {
  const splitValues = expiry.split("/");

  return { month: splitValues[0], year: splitValues[1] };
};

export const formatCrediCardNumber = (cardNumber: string) => {
  const formatCardNumberArray = [];
  const cardNumberArray = cardNumber.replaceAll("-", "").split("");
  let startOffset = 0;
  let loopCounter = 4;
  const totalNumberOfIterations = Math.ceil(cardNumberArray.length / 4) * 4;

  while (totalNumberOfIterations >= loopCounter) {
    const subArray = cardNumberArray.slice(startOffset, loopCounter);
    formatCardNumberArray.push(subArray);
    startOffset += 4;
    loopCounter += 4;
  }
  return formatCardNumberArray.map((el) => el.join("")).join("-");
};
