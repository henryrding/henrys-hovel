import { useState } from "react";

export default function ToggleLamberto() {
  const [isHover, setIsHover] = useState(false);

  function handleHover() {
    setIsHover(!isHover);
  }

  return (
    <img onMouseEnter={handleHover} onMouseLeave={handleHover} src="/images/Lamberto.jpg" className={isHover ? "App-logo-fast" : "App-logo"} alt="Lamberto" />
  );
}
