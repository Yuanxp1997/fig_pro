import Image from "next/image";
import { Room } from "./Room";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Live />
      <Navbar />
    </div>
  );
}
