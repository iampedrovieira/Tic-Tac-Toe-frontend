import Head from "next/head";
import MainPageContainer from "../Components/MainPageContainer";

const Home = () => {
  return (
    <>
      <Head>
        <title>Trick-Tac-Toe</title>
        <meta name="description" content="A strategic twist on the classic tic-tac-toe game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContainer />
    </>
  );
};

export default Home;
