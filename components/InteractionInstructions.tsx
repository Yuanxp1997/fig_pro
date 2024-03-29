import React from "react";

const InteractionInstructions = () => {
  return (
    <div className="fixed bottom-8 w-full flex select-none items-center justify-center">
      <div className="max-w-sm text-center">
        <ul className="mt-4 flex items-center justify-center  space-x-2">
          <li className="flex items-center space-x-2 rounded-md border border-gray-300 bg-slate-800 py-2 px-3 text-sm">
            <span className="text-white">Reactions</span>
            <span className="block rounded border border-gray-300 px-1 text-xs font-medium uppercase text-white">
              E
            </span>
          </li>

          <li className="flex items-center space-x-2 rounded-md border border-gray-300 bg-slate-800 py-2 px-3 text-sm">
            <span className="text-white">Chat</span>
            <span className="block rounded border border-gray-300 px-1 text-xs font-medium  uppercase text-white">
              /
            </span>
          </li>

          <li className="flex items-center space-x-2 rounded-md border border-gray-300 py-2 bg-slate-800 px-3 text-sm">
            <span className="text-white">Escape</span>
            <span className="block rounded border border-gray-300 px-1 text-xs font-medium uppercase text-white">
              esc
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InteractionInstructions;
