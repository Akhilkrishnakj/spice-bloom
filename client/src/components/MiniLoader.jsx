import React from "react";

const MiniLoader = ({ size = 24 }) => (
  <span
    className="inline-block align-middle animate-spin border-4 border-green-500 border-t-white rounded-full shadow"
    style={{ width: size, height: size }}
    aria-label="Loading..."
  />
);

export default MiniLoader; 