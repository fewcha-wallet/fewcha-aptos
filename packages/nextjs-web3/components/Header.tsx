import React from "react";
import Web3, { Web3Provider } from "@fewcha/web3";

const aptos = (window as any).aptos;
const fewcha = (window as any).fewcha;
const martian = (window as any).martian;
const hippo = (window as any).hippo;

const aptosProvider = new Web3Provider(aptos);
const fewchaProvider = new Web3Provider(fewcha);
const martianProvider = new Web3Provider(martian);

const aptosWeb3 = new Web3(aptosProvider);
const fewchaWeb3 = new Web3(fewchaProvider);
const martianWeb3 = new Web3(martianProvider);

const Header = () => {
  return (
    <div>
      <button
        onClick={() => {
          aptosWeb3.action.connect();
        }}
      >
        Connect Aptos
      </button>
      <button
        onClick={() => {
          fewchaWeb3.action.connect();
        }}
      >
        Connect Fewcha
      </button>
      <button
        onClick={() => {
          martianWeb3.action.connect();
        }}
      >
        Connect Martian
      </button>
      <button
        onClick={() => {
          hippo.action.connect();
        }}
      >
        Connect Hippo
      </button>
    </div>
  );
};

export default Header;
