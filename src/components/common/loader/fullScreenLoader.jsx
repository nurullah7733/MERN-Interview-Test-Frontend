import React, { Fragment } from "react";
import "./fullScreenLoader.css";
import { useLoader } from "../../../context/loaderContext";
const FullScreenLoader = () => {
  const { isLoading } = useLoader();

  return (
    <Fragment>
      <div className={`LoadingOverlay ${isLoading ? "" : "hidden"}`}>
        <div className="Line-Progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    </Fragment>
  );
};
export default FullScreenLoader;
