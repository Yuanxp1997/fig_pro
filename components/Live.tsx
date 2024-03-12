"use client";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import React, {
  MutableRefObject,
  PointerEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import OthersCursors from "./cursor/OthersCursors";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import useInterval from "@/hooks/useInterval";
import ReactionSelector from "./reaction/ReactionSelector";
import CursorChat from "./cursor/CursorChat";
import Cursor from "./cursor/Cursor";
import Reactions from "./reaction/Reactions";
import ReactionIndicator from "./reaction/ReactionIndicator";
import InteractionInstructions from "./InteractionInstructions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Comments } from "./comments/Comments";
import { shortcuts } from "@/constants";

const Live = ({
  canvasRef,

  undo,
  redo,
}: {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;

  undo: () => void;
  redo: () => void;
}) => {
  /**
   * useMyPresence returns the presence of the current user and a function to update it.
   * updateMyPresence is different than the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence for more information
   */
  const [{ cursor }, updateMyPresence] = useMyPresence();

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const others = useOthers();

  //Broadcast event hook for emotions
  const broadcast = useBroadcastEvent();

  // Cursor state that will be used to display the cursor and the reaction selector
  const [state, setState] = useState<CursorState>({
    mode: CursorMode.Hidden,
    message: "",
    previousMessage: null,
    reaction: "",
    isPressed: false,
  });

  // Reactions array that will be used to display the reactions
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // Set the cursor state to the reaction selector mode
  const setReaction = useCallback((reaction: string) => {
    setState((prev) => ({
      ...prev,
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false,
    }));
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
        setState((prev) => ({
          ...prev,
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        }));
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setState((prev) => ({ ...prev, mode: CursorMode.Hidden }));
      } else if (e.key === "e") {
        setState((prev) => ({ ...prev, mode: CursorMode.ReactionSelector }));
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
  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      // Prevent the default behavior of the pointer event to avoid scrolling
      event.preventDefault();
      // If the cursor is not in reaction selector mode, update the cursor position
      if (state.mode !== CursorMode.ReactionSelector) {
        updateMyPresence({
          cursor: {
            x: Math.round(
              event.clientX - event.currentTarget.getBoundingClientRect().left
            ),
            y: Math.round(
              event.clientY - event.currentTarget.getBoundingClientRect().top
            ),
          },
        });
      }
    },
    [updateMyPresence, state.mode]
  );
  // When the pointer leaves the window
  const onPointerLeave = useCallback(() => {
    // set the cursor mode to hidden
    setState({
      mode: CursorMode.Hidden,
      message: "",
      previousMessage: null,
      reaction: "",
      isPressed: false,
    });
    // set cursor to null
    updateMyPresence({
      cursor: null,
      message: "",
    });
  }, [updateMyPresence]);

  // When the pointer is pressed
  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      // Update my cursor position
      updateMyPresence({
        cursor: {
          x: Math.round(
            event.clientX - event.currentTarget.getBoundingClientRect().left
          ),
          y: Math.round(
            event.clientY - event.currentTarget.getBoundingClientRect().top
          ),
        },
      });
      // If the cursor is in reaction mode, set isPressed to true to start adding reactions
      setState((state) =>
        state.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [updateMyPresence]
  );

  // When the pointer is released
  const onPointerUp = useCallback(() => {
    // If the cursor is in reaction mode, set isPressed to false to stop adding reactions
    setState((state) =>
      state.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    );
  }, []);

  // Listen to reaction events broadcasted by other users and add them to the reactions array
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });
  const handleContextMenuClick = useCallback(
    (key: string) => {
      switch (key) {
        case "Chat":
          setState((state) => ({
            ...state,
            mode: CursorMode.Chat,
            previousMessage: null,
            message: "",
          }));
          break;

        case "Reactions":
          setState((state) => ({
            ...state,
            mode: CursorMode.ReactionSelector,
            previousMessage: null,
            message: "",
          }));
          break;

        case "Undo":
          undo();
          break;

        case "Redo":
          redo();
          break;

        default:
          break;
      }
    },
    [redo, undo]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger
        id="canvas"
        className="relative h-full w-full flex-1 flex items-center justify-center"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <canvas ref={canvasRef} />
        {
          /* show my custom cursor */
          // cursor && (
          //   <Cursor color="black" x={cursor.x} y={cursor.y} z={100} message="" />
          // )
        }

        {
          /* display the chat input next to the user's cursor */
          cursor && state.mode === CursorMode.Chat && (
            <CursorChat
              cursor={cursor}
              state={state}
              updateMyPresence={updateMyPresence}
              setState={setState}
            />
          )
        }
        {
          /* display the reaction selector at the user's cursor */
          cursor && state.mode === CursorMode.ReactionSelector && (
            <ReactionSelector
              cursor={cursor}
              setReaction={(reaction) => {
                setReaction(reaction);
              }}
            />
          )
        }
        {
          /* display the reaction next to the user's cursor after it's selected from reaction selector */
          cursor && state.mode === CursorMode.Reaction && (
            <ReactionIndicator cursor={cursor} reaction={state.reaction} />
          )
        }

        {/* show other people's cursors */}
        <OthersCursors others={others} />

        {
          /* show reactions on the screen */
          <Reactions reactions={reactions} />
        }
        <InteractionInstructions />
      </ContextMenuTrigger>
      <ContextMenuContent className="right-menu-content">
        {shortcuts.map((shortcut) => (
          <ContextMenuItem
            key={shortcut.key}
            onClick={() => handleContextMenuClick(shortcut.name)}
            className="right-menu-item"
          >
            {shortcut.name} : {shortcut.shortcut}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Live;
