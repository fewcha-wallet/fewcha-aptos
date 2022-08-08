import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const Header = dynamic(
  () => {
    return import("../components/Header");
  },
  { ssr: false },
);

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to example of <a href="https://npmjs.com/@fewcha/web3">@fewcha/web3</a> for nextjs
        </h1>
      </main>
    </div>
  );
};

export default Home;
