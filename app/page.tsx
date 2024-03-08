"use client";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";

import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");
  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });
    window.addEventListener("resize", () => {
      handleResize({ canvas });
    });
  }, []);
  return (
    <div className="h-[100vh] flex flex-col w-full">
      <Navbar />
      <section className="flex-1  flex">
        <SidebarLeft />
        <Live canvasRef={canvasRef} />
        <SidebarRight />
      </section>
    </div>
  );
}
