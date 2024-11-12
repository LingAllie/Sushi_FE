import React, { useState, useEffect } from "react";
import { Spin } from "antd";

const Loading = () => {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    setSpinning(true);

    const timer = setTimeout(() => {
      setSpinning(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  return <Spin spinning={spinning} fullscreen />;
};

export default Loading;
