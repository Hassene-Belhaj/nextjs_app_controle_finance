"use client";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  const dynamicStyle = {
    width: "50px",
    height: "50px",
  };
  return (
    <div className="flex h-20 w-full items-center justify-center">
      <div className={styles.loader} style={dynamicStyle}></div>
    </div>
  );
};

export default LoadingSpinner;
