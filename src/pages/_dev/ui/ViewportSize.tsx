import { useEffect, useState } from "react";

export function ViewportSize() {
  const [innerSize, setInnerSize] = useState<string | null>(null);
  const [docHeight, setDocHeight] = useState<string | null>(null);
  const [visualViewport, setVisualViewport] = useState<string | null>(null);
  useEffect(() => {
    const updateViewportInfo = () => {
      setInnerSize(getWindowInnerSize());
      setDocHeight(getDocumentSize());
      setVisualViewport(getVisualViewportSize());
    };

    // Hook into visual viewport events
    window.visualViewport?.addEventListener("resize", updateViewportInfo);
    window.visualViewport?.addEventListener("scroll", updateViewportInfo);

    // Run once on mount
    updateViewportInfo();

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewportInfo);
      window.visualViewport?.removeEventListener("scroll", updateViewportInfo);
    };
  }, []);

  const getWindowInnerSize = () =>
    `${window.innerWidth} x ${window.innerHeight}`;
  const getDocumentSize = () =>
    `${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`;
  const getVisualViewportSize = () =>
    `${window.visualViewport?.width} x ${window.visualViewport?.height}`;

  const handleViewport = () => {
    setInnerSize(getWindowInnerSize);
    setDocHeight(getDocumentSize);
    setVisualViewport(getVisualViewportSize);
  };

  setInterval(handleViewport, 200);

  return (
    <div>
      <p>visual viewport: {visualViewport}</p>
      <p>document height: {docHeight}</p>
      <p>WindowInnerSize: {innerSize}</p>
      <input onClick={handleViewport} autoFocus={true}></input>
    </div>
  );
}
