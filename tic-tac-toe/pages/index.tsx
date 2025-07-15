import Head from "next/head";
import MainPageContainer from "../Components/MainPageContainer";

const Home = () => {
  return (
    <>
      <Head>
        <title>Trick-Tac-Toe</title>
        <meta name="description" content="A strategic twist on the classic tic-tac-toe game" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#252525" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContainer />
    </>
  );
};

export default Home;
