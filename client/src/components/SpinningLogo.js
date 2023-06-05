import { useState } from "react";

export default function SpinningLogo() {
  const [isHover, setIsHover] = useState(false);
  const imageUrl = '/images/aunties-hovel.png';
  const fileName = imageUrl.split('/').pop().split('.').shift();

  function handleHover() {
    setIsHover(!isHover);
  }

  return (
    <img onMouseEnter={handleHover} onMouseLeave={handleHover} src={imageUrl} className={isHover ? "App-logo-fast" : "App-logo"} alt={fileName} />
  );
}
