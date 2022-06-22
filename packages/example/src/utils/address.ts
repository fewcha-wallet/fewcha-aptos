// Copyright 2022 Fewcha. All rights reserved.

//github.com/gpxl-dev/truncate-eth-address/blob/main/src/index.ts

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
const longTruncateRegex = /^(0x[a-zA-Z0-9]{19})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/;
const txTruncateRegex = /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */

export const truncateEthAddress = (address: string) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const longTruncateEthAddress = (address: string) => {
  const match = address.match(longTruncateRegex);
  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const txTruncateEthAddress = (address: string) => {
  const match = address.match(txTruncateRegex);
  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};
