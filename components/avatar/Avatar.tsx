import React, { useMemo } from "react";
import Image from "next/image";
import classNames from "classnames";
import { getContrastingColor } from "@/utils/getContrastingColor";
import styles from "./Avatars.module.css";

// This component was created by the Liveblocks team
// These are properties for the avatars
// most of these are not used in this app
// but can be helpful if you want to use this component in another app
type BothProps = {
  variant?: "avatar" | "more";
  size?: number;
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
  className?: string;
  style?: Record<string, string>;
};

type PictureProps = BothProps & {
  variant?: "avatar";
  name?: string;
  src?: string;
  color: [string, string];
  statusColor?: string;
  count?: never;
};

type MoreProps = BothProps & {
  variant: "more";
  count: number;
  src?: never;
  name?: never;
  statusColor?: never;
  color?: never;
};

type AvatarProps = PictureProps | MoreProps;

/**
 * Can present avatars as gradients with letters, as pictures, or as a count (e.g +3)
 * Size, outline color, color, radius can all be changed, a status circle can be added
 */
export function Avatar({
  variant = "avatar",
  src = "",
  name = "",
  color = ["", ""],
  size = 52,
  statusColor = "",
  outlineColor = "",
  outlineWidth = 3,
  borderRadius = 9999,
  className = "",
  style = {},
  count = 0,
}: AvatarProps) {
  // if the variant is avatar and there is no src, use the letter variant
  const innerVariant = variant === "avatar" && !src ? "letter" : variant;
  // the size of the avatar without the outline, not used in this app
  const realSize = size - outlineWidth * 2;

  return (
    <div
      style={{
        height: realSize,
        width: realSize,
        boxShadow: `${outlineColor} 0 0 0 ${outlineWidth}px`,
        margin: outlineWidth,
        borderRadius,
        ...style,
      }}
      className={classNames(styles.avatar, className)}
      data-tooltip={name}
    >
      {/* if the variant is more, display the more circle with the count */}
      {innerVariant === "more" ? (
        <MoreCircle count={count} borderRadius={borderRadius} />
      ) : null}
      {/* if the variant is avatar, display the picture circle, not used in this app */}
      {innerVariant === "avatar" ? (
        <PictureCircle
          name={name}
          src={src}
          size={realSize}
          borderRadius={borderRadius}
        />
      ) : null}
      {/* if the variant is letter, display the letter circle */}
      {innerVariant === "letter" ? (
        <LetterCircle name={name} color={color} borderRadius={borderRadius} />
      ) : null}
      {/* if the status color is set, display the status circle not used in this app*/}
      {statusColor ? (
        <span
          style={{ backgroundColor: statusColor }}
          className={styles.status}
        />
      ) : null}
    </div>
  );
}

// This returns the letter circle component
function LetterCircle({
  name,
  color,
  borderRadius,
}: Pick<PictureProps, "name" | "color" | "borderRadius">) {
  const textColor = useMemo(
    () => (color ? getContrastingColor(color[1]) : undefined),
    [color]
  );
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
        borderRadius,
      }}
      className={styles.letter}
    >
      <div className={styles.letterCharacter} style={{ color: textColor }}>
        {name == "You" ? name : name ? name.charAt(0) : null}
      </div>
    </div>
  );
}

// This returns the picture circle component
function PictureCircle({
  name,
  src = "",
  size,
  borderRadius,
}: Pick<PictureProps, "name" | "src" | "size" | "borderRadius">) {
  return (
    <Image
      alt={name ?? ""}
      src={src}
      height={size}
      width={size}
      style={{ borderRadius }}
    />
  );
}

// This returns the more circle component
function MoreCircle({
  count,
  borderRadius,
}: Pick<MoreProps, "count" | "borderRadius">) {
  return (
    <div style={{ borderRadius }} className={styles.more}>
      +{count}
    </div>
  );
}
