import React, { useCallback, useMemo, useRef } from "react";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";
import { Button } from "./ui/button";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
  undo,
  redo,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = useCallback(
    (property: string, value: string) => {
      if (!isEditingRef.current) isEditingRef.current = true;

      setElementAttributes((prev) => ({ ...prev, [property]: value }));

      modifyShape({
        canvas: fabricRef.current as fabric.Canvas,
        property,
        value,
        activeObjectRef,
        syncShapeInStorage,
      });
    },
    [
      activeObjectRef,
      fabricRef,
      isEditingRef,
      setElementAttributes,
      syncShapeInStorage,
    ]
  );

  // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
  const memoizedContent = useMemo(
    () => (
      <section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky right-0 h-full max-sm:hidden select-none">
        <h3 className=" px-5 pt-4 text-xs uppercase">Design</h3>
        <span className="text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4">
          Make changes to canvas as you like
        </span>
        <div className="flex justify-around  px-5 border-b border-primary-grey-200  py-3">
          <Button
            className="no-ring rounded-sm border border-primary-grey-200 hover:bg-primary-green hover:text-primary-black"
            onClick={undo}
          >
            Undo
          </Button>
          <Button
            className="no-ring rounded-sm border border-primary-grey-200 hover:bg-primary-green hover:text-primary-black"
            onClick={redo}
          >
            Redo
          </Button>
        </div>

        <Dimensions
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
          height={elementAttributes.height}
          handleInputChange={handleInputChange}
        />

        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          placeholder="color"
          attributeType="fill"
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          placeholder="stroke"
          attributeType="stroke"
          handleInputChange={handleInputChange}
        />

        <Export />
      </section>
    ),
    [elementAttributes, handleInputChange, isEditingRef, redo, undo]
  ); // only re-render when elementAttributes or isEditingRef changes

  return memoizedContent;
};

export default RightSidebar;
