import React from "react";

export const GridSection = ({
  setGridCols,
  setGridRows,
  gridCols,
  gridRows,
  generateGridImageWithWorker,
  showGrid,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generate Grid</h2>

      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="gridCols" className="w-20 font-medium">
            Columns:
          </label>
          <input
            id="gridCols"
            type="number"
            min={1}
            value={gridCols}
            onChange={(e) =>
              setGridCols(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="flex-1 border rounded px-3 py-2"
            placeholder="Enter number of columns"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="gridRows" className="w-20 font-medium">
            Rows:
          </label>
          <input
            id="gridRows"
            type="number"
            min={1}
            value={gridRows}
            onChange={(e) =>
              setGridRows(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="flex-1 border rounded px-3 py-2"
            placeholder="Enter number of rows"
          />
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={generateGridImageWithWorker}
      >
        Generate Grid
      </button>

      <div className="mt-6">{showGrid()}</div>
    </div>
  );
};
