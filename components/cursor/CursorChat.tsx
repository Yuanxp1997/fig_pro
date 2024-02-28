import { CursorChatProps, CursorMode, CursorState } from "@/types/type";
import React from "react";

const CursorChat = ({ state, updateMyPresence, setState }: CursorChatProps) => {
  return (
    <>
      <div
        className="absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white"
        onKeyUp={(e) => e.stopPropagation()}
        style={{
          borderRadius: 20,
        }}
      >
        {state.previousMessage && <div>{state.previousMessage}</div>}
        <input
          className="w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
          autoFocus={true}
          onChange={(e) => {
            updateMyPresence({ message: e.target.value });
            setState({
              ...state,
              mode: CursorMode.Chat,
              previousMessage: null,
              message: e.target.value,
            });
          }}
          onKeyDown={(e) => {
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
          }}
          placeholder={state.previousMessage ? "" : "Say something…"}
          value={state.message}
          maxLength={50}
        />
      </div>
    </>
  );
};

export default CursorChat;
