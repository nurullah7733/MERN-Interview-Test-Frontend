import React, { useState, useEffect } from "react";
import "./App.css";
import Whiteboard from "./components/whiteboard";
import { LoaderProvider } from "./context/loaderContext";
import FullScreenLoader from "./components/common/loader/fullScreenLoader";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <LoaderProvider>
      <Whiteboard />
      <FullScreenLoader />
      <Toaster position="top-center" reverseOrder={false} />
    </LoaderProvider>
  );
};

export default App;
