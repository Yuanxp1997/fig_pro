import { LiveCursorProps } from "@/types/type";
import React from "react";
import Cursor from "./Cursor";
import { COLORS } from "@/constants";

const OthersCursors = ({ others }: LiveCursorProps) => {
  /**
   * Iterate over other users and display a cursor based on their presence
   */
  const cursors = others.map(({ connectionId, presence }) => {
    if (presence?.cursor) {
      return (
        <Cursor
          key={`cursor-${connectionId}`}
          // connectionId is an integer that is incremented at every new connections
          // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
          color={COLORS[connectionId % COLORS.length]}
          x={presence.cursor.x}
          y={presence.cursor.y}
        />
      );
    }
  });
  return <>{cursors}</>;
};

export default OthersCursors;
