"use client";
import React from "react";
import LiveAvatars from "./avatar/LiveAvatars";
import Image from "next/image";
import { navElements } from "@/constants";
import { Button } from "./ui/button";
import { ActiveElement, NavbarProps } from "@/types/type";
import ShapesMenu from "./ShapesMenu";
import { NewThread } from "./comments/NewThread";

const Navbar = ({
  activeElement,
  handleActiveElement,
  imageInputRef,
  handleImageUpload,
}: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) => {
    return (
      (activeElement && activeElement.value === value) ||
      (Array.isArray(value) &&
        value.some((val) => val?.value === activeElement?.value))
    );
  };
  const handleClick = (item: any) => {
    if (item.name !== "Rectangle") {
      handleActiveElement(item);
    }
  };
  return (
    <nav className="w-full flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
      <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20} />
      <ul className="flex items-center">
        {navElements.map((item) => (
          <li
            key={item.name}
            className={`group h-14 w-12 my-2  flex justify-center items-center cursor-pointer 
            ${
              isActive(item.value)
                ? "bg-primary-green"
                : "hover:bg-primary-grey-200"
            }
            `}
            onClick={() => handleClick(item)}
          >
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={{
                  ...item,
                  value: Array.isArray(item.value) ? item.value : [item.value],
                }}
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
                imageInputRef={imageInputRef}
                handleImageUpload={handleImageUpload}
              />
            ) : item.name === "Comments" ? (
              <NewThread>
                <Button className="relative w-5 h-5 object-contain">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className={isActive(item.value) ? "invert" : ""}
                  />
                </Button>
              </NewThread>
            ) : (
              <Button
                className={
                  item.name === "Reset"
                    ? "relative w-4 h-5 object-contain"
                    : Array.isArray(item.value)
                    ? "relative w-5 h-5 object-contain"
                    : "relative w-5 h-5 object-contain"
                }
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={isActive(item.value) ? "invert" : ""}
                />
              </Button>
            )}
          </li>
        ))}
      </ul>
      <LiveAvatars />
    </nav>
  );
};

export default Navbar;
