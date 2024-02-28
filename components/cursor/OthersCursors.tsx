import { LiveCursorProps } from "@/types/type";
import React from "react";
import Cursor from "./Cursor";
import { COLORS } from "@/constants";

const OthersCursors = ({ others }: LiveCursorProps) => {
  /**
   * Iterate over other users and display a cursor based on their presence
   */
  const cursors = others.map(({ connectionId, presence }) => {
    if (presence == null || !presence.cursor) {
      return null;
    }

    return (
      <Cursor
        key={connectionId}
        color={COLORS[connectionId % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
      />
    );
  });
  return <>{cursors}</>;
};

export default OthersCursors;
