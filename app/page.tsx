import { GetServerSideProps } from "next";

export default function Home() {
  return <div className="w-screen h-screen bg-background"></div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/app",
      permanent: false,
    },
  };
};
