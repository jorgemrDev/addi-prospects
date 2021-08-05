import React from "react";

export default function ClearSearchButton({ clearSearch }) {
  return (
    <div>
      <input
        className="btn btn-primary"
        value="Back To Find Lead"
        onClick={clearSearch}
      />
    </div>
  );
}
