import Image from "next/image";
import { Room } from "./Room";
import Live from "@/components/Live";

export default function Home() {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Live />
    </div>
  );
}
