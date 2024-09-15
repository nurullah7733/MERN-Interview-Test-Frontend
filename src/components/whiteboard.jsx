import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios/axios";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

const Whiteboard = () => {
  const [listCanvas, setListCanvas] = useState([]);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#35363a");

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

  // Remove Selected Object
  const removeSelectedObject = () => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      editor.canvas.remove(activeObject);
    } else {
      alert("Please select an object to remove");
    }
  };

  // Erase All Objects
  const onEraseAll = () => {
    editor.deleteAll();
  };

  // Handle Fill Color Change for Selected Object
  const handleFillColorChange = () => {
    const activeObject = editor.canvas.getActiveObject(); // Get the selected object
    if (activeObject) {
      activeObject.set({ fill: color }); // Update the fill color
      editor.canvas.renderAll(); // Re-render the canvas
    } else {
      alert("Please select an object to fill");
    }
  };

  const exportToJson = () => {
    if (editor) {
      const jsonData = editor.canvas.toJSON();
      console.log(jsonData);
      // Save or process the JSON data as needed
    }
  };

  // Load the initial last drawing file from database & set the canvas height
  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.canvas.setHeight(450);

    //  initial data involved in the whiteboard
    editor.canvas.loadFromJSON(selectedCanvas?.objects, () => {
      editor.canvas.renderAll();
    });
  }, [editor, selectedCanvas]);

  // set color
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  // mouse wheel , ctrl + mouse move, for zoom and history save & redo, undo, clear etc function
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }
  }, [editor]);

  // Fetch the list of canvas from the database and set the selected canvas
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/get-all-drawing/1/100/0");
        setListCanvas(response?.data?.data);
        if (response?.data?.data[0]?.total?.[0].count > 0) {
          setSelectedCanvas(response?.data?.data[0]?.rows[0]);
        }
      } catch (error) {
        console.error("Error fetching canvas data", error);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto py-2">
      <div className="grid grid-cols-12  w-full">
        <div className="col-span-2"></div>
        <div className="col-span-10 flex justify-center py-1">
          <div>
            {/* project name */}
            <div className="text-center">
              <h1 className="text-2xl pb-2 uppercase font-semibold">
                Whiteboard App
              </h1>
              <label>Project Name:</label>{" "}
              <input
                type="text"
                className="border w-56 px-0.5 mr-2"
                value={selectedCanvas?.title}
              />
              <button className="bg-green-500 text-white p-1.5 text-sm rounded-md  mr-2">
                New Project
              </button>
              <button className="bg-red-500 text-white p-1.5 text-sm rounded-md">
                Delete Selected Project
              </button>
            </div>
            {/* action button */}
            <div>
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
                Add Circle
              </button>
              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={onAddRectangle}
              >
                Add Rectangle
              </button>
              <label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>

              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={handleFillColorChange}
              >
                Fill Selected Object
              </button>

              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={removeSelectedObject}
              >
                Erase
              </button>
              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={onEraseAll}
              >
                Erase All
              </button>
              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={exportToJson}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12  w-full gap-1">
        <div className="col-span-2">
          <h3 className="text-center border border-r-0 border-l-0 font-semibold text-sm bg-yellow-500 text-white">
            Project List
          </h3>
          <ul>
            <li>Bangladesh</li>
            <li>Bangladesh</li>
            <li>Bangladesh</li>
          </ul>
        </div>
        <div className="col-span-10">
          <FabricJSCanvas className="border " onReady={onReady} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
