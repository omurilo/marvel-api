import { useEffect, useState } from "react";

function useScreenOrientation() {
  const [orientation, setOrientation] = useState("standard");

  const updateOrientation = () => {
    if (window) {
      const { height, width } = window.screen;

      if (width < height) {
        setOrientation("portrait");
      } else {
        setOrientation("standard");
      }
    }
  };

  useEffect(() => {
    if (window) {
      updateOrientation();
      window.addEventListener("orientationchange", () => updateOrientation());
      window.addEventListener("resize", () => updateOrientation());
    }

    return () => {
      if (window) {
        window.removeEventListener("orientationchange", () =>
          updateOrientation()
        );
        window.removeEventListener("resize", () => updateOrientation());
      }
    };
  }, []);

  return orientation;
}

export default useScreenOrientation;
