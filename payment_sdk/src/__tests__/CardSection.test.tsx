import React from "react";
import { render } from "@testing-library/react-native";

import CardSection from "../components/sections/CardSection";

test("Cardholder name should be  initially rendered", () => {
  const { getByText } = render(<CardSection />);
  expect(getByText("Cardholder name")).toBeTruthy();
});
