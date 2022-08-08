import {
  chromeStoreExtURL,
  discordURL,
  firefoxStoreExtURL,
  mediumURL,
} from "config/config";

export const MENUS = [
  {
    href: "/",
    name: "Overview",
  },
  {
    href: "/#roadmap",
    name: "Roadmap",
  },
  {
    external: mediumURL,
    name: "Blog",
  },
  {
    external: discordURL,
    name: "Support",
  },
];

export const BROWSERS = [
  {
    label: "Chrome",
    url: "/svgs/chrome.svg",
    href: chromeStoreExtURL,
  },
  {
    label: "Brave",
    url: "/svgs/brave.svg",
    href: chromeStoreExtURL,
  },
  {
    label: "Firefox",
    url: "/svgs/firefox.svg",
    href: firefoxStoreExtURL,
  },
  {
    label: "Microsoft Edge",
    url: "/svgs/microsoft-edge.svg",
    href: chromeStoreExtURL,
  },
];

export const ROADMAPS = [
  {
    label: (
      <div className="flex gap-2">
        <div>✅</div>
        <div className="ml-4">Completed</div>
      </div>
    ),
    cards: [
      {
        title: "Wallet Prototype 0.1.0",
        date: "May 16,2022",
        tasksLabel: "board 0.2",
        tasks:
          "https://fewcha.notion.site/03f9e71b1b8a47f3a2710569fcbdff3e?v=eaa14054915f4cca8d39b25e6d295379",
        list: [
          "Chrome, Brave, Edge",
          "Create wallet",
          "Wallet management",
          "Send, receive APT balance",
          "Custom network URL",
          "Contact addresses book",
          "Devnet faucet",
        ],
      },
      {
        title: "Wallet Prototype 0.2.0",
        tasksLabel: "board 0.2",
        tasks:
          "https://fewcha.notion.site/292cc51ece26427baa9ec9f40ffb32c7?v=2565438f74104092ac33f07c3c32399c",
        date: "May 28, 2022",
        list: ["NFTs listings", "Improve lock timer"],
      },
    ],
  },
  {
    label: (
      <div className="flex">
        <div>⏱</div>
        <div className="ml-4">In progress</div>
      </div>
    ),
    cards: [
      {
        title: "Aptos Web3 0.1",
        date: "Est. June, 2022",
        list: [
          "Integrate w/ Aptos Web3.js",
          "Websites that can connect",
          "Make transactions",
          "Confirm transactions flow",
        ],
      },
      {
        date: "Est. July, 2022",
        title: "Wallet Prototype 0.3.0",
        tasksLabel: "board 0.3",
        tasks:
          "https://fewcha.notion.site/0aad5119bdb54d9485ada38c68aa4710?v=c8a1b2c9130c422e9d3ef4f0c4406e00",
        list: [
          "Send and receive NFTs",
          "Token listings",
          "Send and receive Token",
          "Change theme",
          "Change language",
        ],
      },
    ],
  },
  {
    label: (
      <div className="flex gap-2">
        <div>💭</div>
        <div className="ml-4">Planned</div>
      </div>
    ),
    cards: [
      {
        title: "Release version 1.0.0",
        date: "EST. September 2022",
        list: ["Update to official design", "Become a validator node!!!"],
      },
      {
        title: "Release version 1.1.0",
        date: "EST. Q4 2022",
        list: ["More fetures", "Connect with ledger wallet"],
      },
      {
        title: "Multiplatform",
        date: "EST. Q4 2022",
        list: ["Firefox version", "iOS version", "Android version"],
      },
      {
        title: "Ecosystem",
        date: "EST. Q1 2023",
        list: ["Token swap", "NFTs marketplace"],
      },
    ],
  },
];

export const FOOTER_MENU = [
  {
    title: "Product",
    list: [
      {
        external: "/",
        label: "Overview",
      },
      {
        external: "/",
        label: "Download",
      },
      {
        external: discordURL,
        label: "Support",
      },
      {
        external: discordURL,
        label: "Feature Requests",
      },
    ],
  },
  {
    title: "Resources",
    list: [
      {
        external: mediumURL,
        label: "Blog",
      },
      {
        label: "Docs (Building)",
      },
      {
        href: "",
        label: "Status",
      },
      {
        href: "/terms",
        label: "Terms",
      },
      {
        href: "/privacy",
        label: "Privacy",
      },
    ],
  },
  {
    title: "Company",
    list: [
      {
        href: mediumURL,
        label: "About",
      },
      {
        label: "Jobs",
      },
      {
        label: "Press Kit",
      },
    ],
  },
];
