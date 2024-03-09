"use client";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";

import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleImageUpload } from "@/lib/shapes";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element);

    switch (element?.value) {
      case "reset":
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      case "delete":
        setActiveElement(defaultNavElement);
        break;
      case "image":
        imageInputRef.current?.click();
        /**
         * set drawing mode to false
         * If the user is drawing on the canvas, we want to stop the
         * drawing mode when clicked on the image item from the dropdown.
         */
        isDrawing.current = false;
        if (fabricRef.current) {
          // disable the drawing mode of canvas
          fabricRef.current.isDrawingMode = false;
        }
        break;

      // for comments, do nothing
      case "comments":
        break;

      default:
        // set the selected shape to the selected element
        selectedShapeRef.current = element?.value as string;
        break;
    }
  };

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
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
      />
      <section className="flex-1  flex">
        <SidebarLeft />
        <Live canvasRef={canvasRef} />
        <SidebarRight />
      </section>
    </div>
  );
}
