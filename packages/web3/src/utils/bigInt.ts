// Copyright 2022 Fewcha. All rights reserved.

export const toHuman = (input: string, decimal: number, fractionDigit: number = 3, delimiter: string = ","): string => {
  if (input.length < decimal) {
    if (input.length + fractionDigit < decimal) {
      return "0";
    } else {
      return `0${delimiter}${input.slice(0, Math.min(fractionDigit, decimal))}`;
    }
  } else {
    const fractionPositon = input.length - decimal;
    const decimalNumber = `${input.slice(fractionPositon, Math.min(fractionDigit, decimal))}`;
    if (decimalNumber !== "") {
      return `${input.slice(0, fractionPositon)}${delimiter}${decimalNumber}`;
    } else {
      return `${input.slice(0, fractionPositon)}`;
    }
  }
};

export const toDecimal = (input: string, decimal: number, delimiter: string = "."): string => {
  var splitInput = input.split(delimiter);
  if (splitInput.length !== 2) {
    throw new Error("Invalid number");
  }

  // integral
  const integral = splitInput[0] === "0" ? "" : splitInput[0];
  // decimal
  const _decimal = splitInput[1].length <= decimal ? `${splitInput[1]}${"0".repeat(decimal - splitInput[1].length)}` : `${splitInput[1].slice(0, decimal)}`;

  return integral + _decimal;
};
