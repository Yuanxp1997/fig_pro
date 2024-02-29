import React from "react";
type Props = {
  cursor: { x: number; y: number };
  reaction: string;
};

const ReactionIndicator = ({ cursor, reaction }: Props) => {
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      <div className="pointer-events-none absolute top-3.5 left-1 select-none">
        {reaction}
      </div>
    </div>
  );
};

export default ReactionIndicator;
