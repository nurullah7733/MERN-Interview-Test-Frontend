import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios/axios";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useLoader } from "../context/loaderContext";
import {
  createWhiteboardRequest,
  getAllWhiteboardRequest,
  updateWhiteboardRequest,
} from "../APIRequest/whiteboardApi";
import generate3DigitRandomNumber from "../utils/generate3digitNumber/generate3digitNumber";
import {
  exportAsPNG,
  exportAsSVG,
} from "../utils/exportWhiteboardAsImg/exportWhiteboardAsImg";

const Whiteboard = () => {
  const { showLoader, hideLoader } = useLoader();
  const [listCanvas, setListCanvas] = useState({
    total: 0,
    rows: [],
  });
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
      activeObject.set("fill", color); // Update the fill color
      editor.canvas.renderAll(); // Re-render the canvas
    } else {
      alert("Please select an object to fill");
    }
  };

  // handle project title change
  const handleProjectTitleChange = (e) => {
    const updateCanvas = {
      ...selectedCanvas,
      title: e.target.value,
    };
    setSelectedCanvas(updateCanvas);

    const updatedList = listCanvas?.rows?.map((canvas) =>
      canvas._id === selectedCanvas?._id ? updateCanvas : canvas
    );

    setListCanvas({ total: listCanvas.total, rows: updatedList });
  };

  // export as PNG image
  const handleExportPNG = () => {
    if (editor?.canvas) {
      exportAsPNG(editor.canvas);
    }
  };
  // export as SVG image
  const handleExportSVG = () => {
    if (editor?.canvas) {
      exportAsSVG(editor.canvas);
    }
  };

  // Create new canvas and save it in the database
  const createNewCanvas = async () => {
    // Clear the current canvas
    editor.canvas.clear();

    const title = "New Drawing " + generate3DigitRandomNumber();
    // Save the new canvas in the database
    const newCanvas = await createWhiteboardRequest(title, []);

    if (newCanvas && newCanvas._id) {
      setSelectedCanvas(newCanvas);
      setListCanvas((prevList) => {
        const updateRows = [...prevList.rows, newCanvas];
        const updateTotal = prevList.total + 1;
        return { total: updateTotal, rows: updateRows };
      });
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
      showLoader();
      const data = await getAllWhiteboardRequest(`1`, `100`, `0`);
      hideLoader();
      setListCanvas({
        total: data?.total[0].count || 0,
        rows: data?.rows || [],
      });
      if (data?.rows[0]?.objects) {
        setSelectedCanvas(data.rows[0]);
      }
    })();
  }, []);

  // real time and page unload or tab close to save drawing data into database
  useEffect(() => {
    if (!editor || !editor.canvas) {
      return;
    }
    // Function to save drawing data
    const saveDrawingData = async () => {
      const jsonData = editor.canvas.toJSON();
      const title =
        selectedCanvas?.title ||
        "Untitled Drawing " + generate3DigitRandomNumber();
      const objects = jsonData.objects;

      if (!selectedCanvas?._id) {
        const newDrawing = await createWhiteboardRequest(title, objects);
        console.log(newDrawing._id, "new");
        // Check if new drawing creation was successful and save its _id
        if (newDrawing && newDrawing._id) {
          setSelectedCanvas({
            ...selectedCanvas,
            _id: newDrawing._id,
          });
        }
      } else {
        // If _id exists, update the existing drawing
        await updateWhiteboardRequest(selectedCanvas?._id, title, objects);
      }
    };

    // Save on specific events
    const handleObjectModified = () => {
      saveDrawingData();
    };

    editor.canvas.on("object:modified", handleObjectModified);
    editor.canvas.on("object:added", handleObjectModified);
    editor.canvas.on("object:removed", handleObjectModified);

    // Save on page unload
    const handleBeforeUnload = (event) => {
      // Preventing default behavior and saving data
      event.preventDefault();
      saveDrawingData();
      event.returnValue = "Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listeners on component unmount
    return () => {
      editor.canvas.off("object:modified", handleObjectModified);
      editor.canvas.off("object:added", handleObjectModified);
      editor.canvas.off("object:removed", handleObjectModified);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor, selectedCanvas]);

  console.log(listCanvas, "list canvas");

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
                value={selectedCanvas?.title || ""}
                onChange={handleProjectTitleChange}
              />
              <button
                onClick={createNewCanvas}
                className="bg-green-500 text-white p-1.5 text-sm rounded-md  mr-2"
              >
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
                onClick={handleExportPNG}
              >
                Export PNG
              </button>
              <button
                className="bg-gray-100 px-1.5 text-sm rounded-md"
                onClick={handleExportSVG}
              >
                Export SVG
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12  w-full gap-1">
        <div className="col-span-2">
          <h3 className="text-center py-0.5 font-semibold text-sm bg-yellow-500 text-white">
            Project List
          </h3>
          <ul className=" text-center ">
            {listCanvas?.rows?.map((item, index) => {
              return (
                <li
                  onClick={() => setSelectedCanvas(item)}
                  key={index}
                  className={`cursor-pointer text-sm border block my-0.5 ${
                    selectedCanvas?._id === item?._id ? "bg-gray-200" : ""
                  }`}
                >
                  {item?.title?.length > 30
                    ? item?.title?.substring(0, 30) + "..."
                    : item?.title}
                </li>
              );
            })}
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
