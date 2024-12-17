import { FC } from "react";

interface pageProps {
  params: {
    chatId: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  return <div>{params.chatId} </div>;
};

export default page;
