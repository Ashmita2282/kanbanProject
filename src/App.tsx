import React from "react";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Board />
    </div>
  );
};

export default App;
