import React from "react";

export const GradientProgressBar = ({
  percentage = 0,
  height = "20px",
  backgroundColor = "#e0e0e0",
  startColor = "#5474FD", // Start of gradient
  endColor = "#8854FC", // End of gradient
  borderRadius = "10px",
}) => {
  const progressStyle = {
    height: "100%",
    width: `${percentage}%`,
    backgroundImage: `linear-gradient(to right, ${startColor}, ${endColor})`,
    borderRadius: borderRadius,
    transition: "width 0.4s ease-in-out",
  };

  const containerStyle = {
    height,
    width: "100%",
    backgroundColor,
    borderRadius: borderRadius,
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      <div style={progressStyle}></div>
    </div>
  );
};
