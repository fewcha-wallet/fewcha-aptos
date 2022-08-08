import styled, { css } from "styled-components";

// popup background
export const PopupBackground = styled.div`
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
`;

export const PopupBackgroundScreen = styled.div`
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 5rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  @media (min-width: 640px) {
    display: block;
    padding: 0;
  }
`;

export const PopupBackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition-property: opacity;
`;

export const PopupBackgroundBackground = styled.div`
  background: rgba(255, 227, 227, 0.1) !important;
  backdrop-filter: blur(3px) !important;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

// button

export const ConnectWalletButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  gap: 10px;

  background: #14161a;

  border-radius: 100px;

  flex: none;
  order: 0;
  flex-grow: 0;

  cursor: pointer;

  line-height: 120%;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;

  outline: 0;

  border: none;

  &:hover {
    background-color: #2a2c33;
  }

  transition: background-color 0.2s ease-in-out;
`;

// popup
export const Popup = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  display: inline-block;
  overflow: hidden;
  z-index: 50;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: #ffffff;
  transition-property: all;
  text-align: left;
  vertical-align: bottom;
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (min-width: 640px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    vertical-align: middle;
    max-width: 480px;
  }

  background-color: #050507;
  border-radius: 40px;
`;

export const PopupTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 120%;

  text-align: center;
  letter-spacing: 0.02em;

  color: #ffffff;

  max-width: 70%;
  margin: 36px auto 60px;
`;

export const PopupClose = styled.div`
  display: flex;
  background-color: #000000;
  justify-content: flex-end;
  cursor: pointer;
`;

// wallet list
export const WalletList = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        `
      : css`
          flex-direction: column;
        `}
`;

export const WalletItem = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          flex-direction: column;
          display: flex;
          border-radius: 16px;
          border-width: 1px;
          background: #201e28;
          margin-bottom: 16px;
        `
      : css`
          display: flex;
          border-radius: 16px;
          border-width: 1px;
          background: #201e28;
          margin-bottom: 16px;
        `}
  align-items: center;
  cursor: pointer;
`;

export const WalletTitleWrapper = styled.div<{ grid: boolean }>`
  ${(props) =>
    props.grid
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `}
  display: flex;
  padding: 24px 16px;
`;

export const WalletIcon = styled.div<{ grid: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.grid
      ? css`
          margin-bottom: 12px;
        `
      : css`
          margin-right: 16px;
        `}
`;

export const WalletTitle = styled.div`
  color: #ffffff;

  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 120%;
`;

export const WalletDetected = styled.div<{ grid: boolean }>`
  color: #3b82f6;
  font-size: 24px;

  ${(props) =>
    props.grid
      ? css`
          margin-bottom: 15px;
        `
      : css`
          margin-left: auto;
          margin-right: 24px;
        `}
`;
