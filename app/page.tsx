import Image from "next/image";
import { Room } from "./Room";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";

import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";

export default function Home() {
  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Navbar />
      <section className="flex-1 border-2 border-white flex">
        <SidebarLeft />
        <Live />
        <SidebarRight />
      </section>
    </div>
  );
}
