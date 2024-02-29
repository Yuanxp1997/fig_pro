import React from "react";
import FlyingReaction from "./FlyingReactions";
import { Reaction } from "@/types/type";

const Reactions = ({ reactions }: { reactions: Reaction[] }) => {
  const reactionElements = reactions.map((reaction) => {
    return (
      <FlyingReaction
        key={reaction.timestamp.toString()}
        x={reaction.point.x}
        y={reaction.point.y}
        timestamp={reaction.timestamp}
        value={reaction.value}
      />
    );
  });
  return <>{reactionElements}</>;
};

export default Reactions;
