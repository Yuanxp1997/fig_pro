"use client";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import React, { PointerEvent, useCallback, useEffect, useState } from "react";
import { COLORS } from "@/constants";
import Cursor from "./cursor/Cursor";
import OthersCursors from "./cursor/OthersCursors";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import useInterval from "@/hooks/useInterval";
import FlyingReaction from "./reaction/FlyingReactions";
import ReactionSelector from "./reaction/ReactionSelector";

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

  //Broadcast event hook for emotions
  const broadcast = useBroadcastEvent();

  // Cursor state that will be used to display the cursor and the reaction selector
  const [state, setState] = useState<CursorState>({ mode: CursorMode.Hidden });

  // Reactions array that will be used to display the reactions
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // Set the cursor state to the reaction selector mode
  const setReaction = useCallback((reaction: string) => {
    setState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  // If the cursor is in reaction mode and the mouse is pressed,
  // add a reaction to the reactions array and broadcast it to the other users every 100ms
  useInterval(() => {
    if (state.mode === CursorMode.Reaction && state.isPressed && cursor) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: state.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: state.reaction,
      });
    }
  }, 100);

  // Keyboard event listeners to change the cursor state
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "/") {
        setState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setState({ mode: CursorMode.ReactionSelector });
      }
    }
    window.addEventListener("keyup", onKeyUp);
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  // When the pointer moves
  const onPointerMove = (event: PointerEvent) => {
    // Prevent the default behavior of the pointer event to avoid scrolling
    event.preventDefault();
    // If the cursor is not in reaction selector mode, update the cursor position
    if (cursor == null || state.mode !== CursorMode.ReactionSelector) {
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY),
        },
      });
    }
  };

  // When the pointer leaves the window
  const onPointerLeave = () => {
    // set the cursor mode to hidden
    setState({
      mode: CursorMode.Hidden,
    });
    // set cursor to null
    updateMyPresence({
      cursor: null,
    });
  };

  // When the pointer is pressed
  const onPointerDown = (event: PointerEvent) => {
    // Update my cursor position
    updateMyPresence({
      cursor: {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      },
    });
    // If the cursor is in reaction mode, set isPressed to true to start adding reactions
    setState((state) =>
      state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
    );
  };

  // When the pointer is released
  const onPointerUp = () => {
    // If the cursor is in reaction mode, set isPressed to false to stop adding reactions
    setState((state) =>
      state.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    );
  };
  return (
    <main
      className="h-[100vh] w-full text-white flex items-center justify-center "
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {reactions.map((reaction) => {
        return (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        );
      })}

      {cursor && (
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
          }}
        >
          {state.mode === CursorMode.ReactionSelector && (
            <ReactionSelector
              setReaction={(reaction) => {
                setReaction(reaction);
              }}
            />
          )}
          {state.mode === CursorMode.Reaction && (
            <div className="pointer-events-none absolute top-3.5 left-1 select-none">
              {state.reaction}
            </div>
          )}
        </div>
      )}

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
