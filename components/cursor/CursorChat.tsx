import { CursorChatProps, CursorMode, CursorState } from "@/types/type";
import Image from "next/image";
import React from "react";

const CursorChat = ({
  cursor,
  state,
  updateMyPresence,
  setState,
}: CursorChatProps) => {
  // Update the message in the presence object when the input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setState({
      ...state,
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };
  // Handle the keydown event to send the message or close the chat
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setState({
        ...state,
        mode: CursorMode.Chat,
        previousMessage: state.message,
        message: "",
      });
    } else if (e.key === "Escape") {
      setState({
        mode: CursorMode.Hidden,
        message: "",
        previousMessage: null,
        reaction: "",
        isPressed: false,
      });
    }
  };
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      <div
        className="absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white"
        onKeyUp={(e) => e.stopPropagation()}
        style={{
          borderRadius: 20,
        }}
      >
        {/* if there is a previous message, display it */}
        {state.previousMessage && <div>{state.previousMessage}</div>}
        {/* input to type the message is under the previous message */}
        <input
          className="w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
          autoFocus={true}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={state.previousMessage ? "" : "Say something…"}
          value={state.message}
          maxLength={50}
        />
      </div>
    </div>
  );
};

export default CursorChat;
