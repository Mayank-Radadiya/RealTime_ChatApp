import Button from "@/components/ui/Button";
import { dbConnection } from "@/lib/database/DbConnection";
import Image from "next/image";

export default async function Home() {
  dbConnection.set("hello" , "world");
  return (
    <>
  <Button >Hello</Button>
    </>
  );
}
