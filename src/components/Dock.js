import React, { useState } from "react";
import { Howl } from "howler";

const Dock = ({ apps, onAppClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sound configuration for click
  const clickSound = new Howl({
    src: ["/click.mp3"],
    volume: 0.5,
    format: ['mp3'],
    html5: true,
    onload: () => {
      console.log("Click sound loaded successfully");
    },
    onloaderror: (id, error) => {
      console.log("Click sound load error:", error);
    }
  });

  // Sound configuration for hover
  const hoverSound = new Howl({
    src: ["/whoosh.wav"],
    volume: 0.3,
    format: ['wav'],
    html5: true,
    onload: () => {
      console.log("Hover sound loaded successfully");
    },
    onloaderror: (id, error) => {
      console.log("Hover sound load error:", error);
    }
  });

  const handleAppClick = (app) => {
    console.log("Dock icon clicked - attempting to play click sound");
    try {
      clickSound.play();
    } catch (error) {
      console.log("Click sound error:", error);
    }
    // Only trigger for non-resume apps on single click
    if (app.name !== "My Resume") {
      onAppClick(app);
    }
  };

  const handleAppDoubleClick = (app) => {
    console.log("Dock icon double-clicked");
    if (app.name === "My Resume") {
      // Open resume in new tab for double-click
      window.open('https://flowcv.com/resume/u2ckr5r2ktsk', '_blank');
    } else {
      // For other apps, trigger normal window opening
      onAppClick(app);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    console.log("Dock icon hovered - attempting to play hover sound");
    try {
      hoverSound.play();
    } catch (error) {
      console.log("Hover sound error:", error);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      className="dock"
      style={{
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.6)", // Slightly more opaque for better readability while staying semitransparent
        backdropFilter: "blur(10px)",
        padding: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      {apps.map((app, index) => (
        <div
          key={index}
          className="dock-icon-container"
          onClick={() => handleAppClick(app)} // Use the handleAppClick function
          onDoubleClick={() => handleAppDoubleClick(app)} // Handle double-click events
          onMouseEnter={() => handleMouseEnter(index)} // Trigger hover sound
          onMouseLeave={handleMouseLeave} // Reset hover state
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 15px",
            cursor: "pointer",
          }}
        >
          <div
            className="dock-icon"
            style={{
              margin: "0",
              cursor: "pointer",
              fontSize: app.icon.includes("img") ? "0px" : "35px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: hoveredIndex === index ? "scale(1.2)" : "scale(1)",
              textShadow:
                hoveredIndex === index
                  ? "0 0 20px rgba(255, 255, 255, 0.8)"
                  : "none",
            }}
          >
            {typeof app.icon === "string" ? (
              app.icon
            ) : (
              <img
                src={app.icon.props.src}
                alt={app.icon.props.alt}
                style={{
                  width: "35px",
                  height: "45px",
                  borderRadius: "50%",
                  imageRendering: "optimizeQuality",
                  filter: "contrast(1.02) brightness(1.02)",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              />
            )}
          </div>
          <span
            style={{
              color: "white",
              fontSize: "17px",
              marginTop: "5px",
              opacity: hoveredIndex === index ? 1 : 0.7,
              transition: "opacity 0.3s ease",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              fontFamily: "'Inter', 'Montserrat', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: "300",
              letterSpacing: "0.4px",
            }}
          >
            {app.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Dock;
