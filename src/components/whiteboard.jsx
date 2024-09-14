import React, { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

const Whiteboard = () => {
  const { editor, onReady } = useFabricJSEditor();
  const onAddCircle = () => {
    editor.addCircle();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };

  const onAddText = () => {
    editor.addText("Hello, World!");
  };

  const onAddLine = () => {
    editor.addLine();
  };

  const onDeleteAll = () => {
    editor.deleteAll();
  };

  const exportToJson = () => {
    if (editor) {
      const jsonData = editor.canvas.toJSON();
      console.log(jsonData);
      // Save or process the JSON data as needed
    }
  };

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl  font-semibold">Whiteboard App</h1>

      <div className="grid grid-cols-12  w-full">
        <div className="col-span-2"></div>
        <div className="col-span-10 flex justify-center py-1">
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={onDeleteAll}
          >
            Erase All
          </button>
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={onAddLine}
          >
            Add Line
          </button>
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={onAddText}
          >
            Add Text
          </button>
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={onAddCircle}
          >
            Add circle
          </button>
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={onAddRectangle}
          >
            Add Rectangle
          </button>
          <button
            className="bg-gray-100 px-1.5 text-sm rounded-md"
            onClick={exportToJson}
          >
            Export Data
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12  w-full ">
        <div className="col-span-2">
          <ul>
            <li>Bangladesh</li>
            <li>Bangladesh</li>
            <li>Bangladesh</li>
          </ul>
        </div>
        <div className="col-span-10">
          <FabricJSCanvas className="  border" onReady={onReady} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
