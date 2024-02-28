"use client";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import React, { PointerEvent } from "react";
import { COLORS } from "@/constants";
import Cursor from "./cursor/Cursor";
import OthersCursors from "./cursor/OthersCursors";

const Live = () => {
  /**
   * useMyPresence returns the presence of the current user and a function to update it.
   * updateMyPresence is different than the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence for more information
   */
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const others = useOthers();
  const onPointerMove = (event: PointerEvent) => {
    // Update the user cursor position on every pointer move
    updateMyPresence({
      cursor: {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      },
    });
  };
  const onPointerLeave = () =>
    // When the pointer goes out, set cursor to null
    updateMyPresence({
      cursor: null,
    });
  return (
    <main
      className="h-[100vh] w-full text-white flex items-center justify-center "
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div>
        {cursor
          ? `${cursor.x} × ${cursor.y}`
          : "Move your cursor to broadcast its position to other people in the room."}
      </div>

      <OthersCursors others={others} />
    </main>
  );
};

export default Live;
