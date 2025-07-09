import Head from "next/head";
import { useRouter } from 'next/router';
import MainPageContainer from "../../Components/MainPageContainer";

const RoomPage = () => {
  const router = useRouter();
  const { roomName } = router.query;

  // Don't render until we have the room name
  if (!roomName || typeof roomName !== 'string') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Trick-Tac-Toe - Room {roomName}</title>
        <meta name="description" content={`Join room ${roomName} for a strategic tic-tac-toe game`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContainer roomName={roomName} />
    </>
  );
};

export default RoomPage;
