// Copyright 2022 Fewcha. All rights reserved.

export const toHuman = (input: string, decimal: number, fractionDigit: number = 3, delimiter: string = ",") : string => {
  if (input.length < decimal) {
    if (input.length < decimal + fractionDigit){
      return "0";
    } else {
      return `0${delimiter}${input.slice(0, Math.min(fractionDigit, decimal))}`
    }
  } else {
    const fractionPositon = input.length - decimal;
    const decimalNumber = `${input.slice(fractionPositon, Math.min(fractionDigit, decimal))}`;
    if (decimalNumber !== ''){
      return `${input.slice(0, fractionPositon)}${delimiter}${decimalNumber}`;
    } else {
      return `${input.slice(0, fractionPositon)}`;
    }
  }
};
