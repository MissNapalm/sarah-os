import React, { useState } from "react";
import { Howl } from "howler";
import Dock from "./components/Dock";
import Window from "./components/Window";
import DesktopIcon from "./components/DesktopIcon";
import HackerTerminal from "./components/HackerTerminal";
import {
  AboutMeContent,
  SkillsContent,
  EthicalHacksContent,
  NonprofitContent,
  SettingsContent,
} from "./components/WindowContent";
import wallpaperImage from "./wallpaper.jpg";
import "./App.css";

const App = () => {
  const dockHeight = 90;
  const [windows, setWindows] = useState([]);
  const [icons, setIcons] = useState([
    { id: 1, name: "Hacker Typer Game", icon: "💻", content: "Documents Content", position: { x: 20, y: 130 } },
    { id: 2, name: "My Resume", icon: "🌐", content: "Projects Content", position: { x: 20, y: 230 } },
    { id: 3, name: "Downloads", icon: "⬇️", content: "Downloads Content", position: { x: 20, y: 330 } },
    { id: 4, name: "Recycle Bin", icon: "🗑️", content: "I'm out of cute easter egg ideas...for now. Until then, enjoy this empty space XD", position: { x: 20, y: 430 } },
  ]);
  const [booted, setBooted] = useState(false); // Controls the boot sequence - RESTORED
  const [fadeInStage, setFadeInStage] = useState(0); // Tracks which elements are fading in - START FROM BEGINNING
  const [buttonVisible, setButtonVisible] = useState(true); // Controls the button visibility - SHOW BOOT BUTTON
  const [blackScreenOpacity, setBlackScreenOpacity] = useState(1); // Controls the black screen fade-out - START WITH BLACK SCREEN
  // Sound configurations
  const bootSound = new Howl({
    src: ["/bootup.mp3"],
    volume: 0.5,
    format: ['mp3'],
    html5: false, // Use Web Audio API instead of HTML5 for better compatibility
    preload: true,
    onload: () => {
      console.log("Boot sound loaded successfully");
    },
    onloaderror: (id, error) => {
      console.log("Boot sound load error:", error);
    },
    onplay: () => {
      console.log("Boot sound playing");
    },
    onplayerror: (id, error) => {
      console.log("Boot sound play error:", error);
    }
  });

  const whooshSound = new Howl({
    src: ["/whoosh.wav"],
    volume: 0.3,
    format: ['wav'],
    html5: false,
    preload: true,
    onloaderror: (id, error) => {
      console.log("Whoosh sound load error:", error);
    }
  });

  // const music = new Howl({
  //   src: ["/music.mp3"],
  //   volume: 0.65, // 65% volume
  //   loop: true,
  // });

  const openWindow = (app) => {
    let content = app.content;
    let width = 625;
    let height = 600;

    if (app.name === "About Me") {
      content = <AboutMeContent />;
    } else if (app.name === "Skills") {
      content = <SkillsContent />;
    } else if (app.name === "Software") {
      content = <EthicalHacksContent />;
    } else if (app.name === "Security") {
      content = <NonprofitContent />;
    } else if (app.name === "Settings") {
      content = <SettingsContent />;
    } else if (app.name === "Hacker Typer Game") {
      // EASTER EGG: Hacker Terminal
      content = (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Type fast to hack! (This is really how it works btw)</h2>
          <HackerTerminal />
        </div>
      );
    } else if (app.name === "My Resume") {
      // Open resume in new tab
      window.open('https://flowcv.com/resume/u2ckr5r2ktsk', '_blank');
      return; // Don't create a window, just open the link
    } else if (app.name === "Downloads") {
      // EASTER EGG: "The Game" joke with fake files
      content = (
        <div style={{ padding: "20px" }}>
          <h2>Downloads</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            marginTop: "15px"
          }}>
            {["You.txt", "Have", "Just", "Lost.txt", "The.txt", "Game.txt"].map((file, index) => (
              <div key={index} style={{
                padding: "10px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                textAlign: "center",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)"
              }}
              onClick={() => alert("You lost The Game.")}
              >
                📄 {file}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    setWindows((prev) => [
      ...prev,
      { id: Date.now(), title: app.name, content: content, width: width, height: height },
    ]);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  };

  const handleIconDrag = (id, e) => {
    const iconIndex = icons.findIndex((icon) => icon.id === id);
    if (iconIndex === -1) return;

    const newIcons = [...icons];
    const newX = newIcons[iconIndex].position.x + e.movementX;
    const newY = newIcons[iconIndex].position.y + e.movementY;

    if (newY < dockHeight) {
      // Don't move the icon into the dock area - keep Y position unchanged
      newIcons[iconIndex].position.x = newX;
    } else {
      newIcons[iconIndex].position.x = newX;
      newIcons[iconIndex].position.y = newY;
    }

    setIcons(newIcons);
  };

  const handleBoot = () => {
    console.log("Boot button clicked - attempting to play sound");
    
    // Immediately try to play the sound when user clicks (user interaction)
    try {
      console.log("Playing boot sound immediately...");
      bootSound.play();
    } catch (error) {
      console.log("Boot sound immediate play error:", error);
    }

    // Start fade-in sequence
    setTimeout(() => setFadeInStage(1), 500); // Fade in SarahOS text after 500ms
    setTimeout(() => setFadeInStage(2), 2500); // Fade in desktop icons after 2500ms (2 seconds after text)
    setTimeout(() => setFadeInStage(3), 4500); // Fade in dock after 4500ms (2 seconds after icons)

    // Fade out the black screen and make the button disappear
    setTimeout(() => setBlackScreenOpacity(0), 800); // Start fading out the black screen
    setTimeout(() => setButtonVisible(false), 100); // Hide the button visually
    setTimeout(() => setBooted(true), 6000); // Remove the black screen after dock animation completes
  };

  return (
    <div className="desktop" style={{ backgroundImage: `url(${wallpaperImage})` }}>
      {/* Boot Screen */}
      {!booted && (
        <div
          className="fixed inset-0 bg-black flex justify-center items-center"
          style={{
            zIndex: 1000,
            opacity: blackScreenOpacity,
            transition: "opacity 2s ease-in-out",
          }}
        >
          {buttonVisible && (
            <button
              onClick={handleBoot}
              style={{
                padding: "20px 50px",
                fontSize: "24px",
                color: "white",
                backgroundColor: "#1a73e8",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease, opacity 1s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Click to Boot Up My Portfolio
            </button>
          )}
        </div>
      )}

      {/* Persistent OS Text */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          opacity: fadeInStage >= 1 ? 1 : 0,
          transition: "opacity 2s ease-in-out",
          zIndex: 40,
        }}
      >
        <h1 className="text-white font-bold text-center" style={{
          fontSize: "4rem", // More controlled size
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: "700",
          letterSpacing: "-0.02em", // Tighter letter spacing for premium look
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
        }}>
          <span>Sarah</span>
          <span style={{ 
            fontSize: "1.3em", 
            display: "inline-block", 
            marginLeft: "0.15em",
            fontWeight: "800",
            color: "white"
          }}>OS</span>
        </h1>
        <p className="text-white text-center" style={{
          fontSize: "1.1rem",
          fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: "400",
          letterSpacing: "0.02em",
          opacity: "0.9",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
          marginTop: "0.5rem"
        }}>Frontend Design and Cybersecurity</p>
      </div>

      {/* Desktop Icons */}
      <div
        className="desktop-icons"
        style={{
          opacity: fadeInStage >= 2 ? 1 : 0,
          transition: "opacity 2s ease-in-out",
        }}
      >
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="absolute cursor-pointer"
            style={{
              left: `${icon.position.x}px`,
              top: `${icon.position.y}px`,
            }}
            onMouseDown={(e) => {
              const onDrag = (event) => handleIconDrag(icon.id, event);
              const onDragEnd = () => {
                document.removeEventListener("mousemove", onDrag);
                document.removeEventListener("mouseup", onDragEnd);
              };
              document.addEventListener("mousemove", onDrag);
              document.addEventListener("mouseup", onDragEnd);
            }}
            onMouseEnter={() => {
              try {
                whooshSound.play();
              } catch (error) {
                console.log("Whoosh sound play error:", error);
              }
            }}
          >
            <DesktopIcon
              name={icon.name}
              icon={icon.icon}
              onDoubleClick={() => openWindow(icon)}
            />
          </div>
        ))}
      </div>

      {/* Dock */}
      <div
        className="dock-slide"
        style={{
          transform: fadeInStage >= 3 ? 'translateY(0)' : 'translateY(-90px)',
          opacity: fadeInStage >= 3 ? 1 : 0,
          transition: 'transform 1.2s ease-out, opacity 1s ease-in-out',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        <Dock
          apps={[
            { name: "About Me", icon: "📜", content: "About Me Content" },
            { name: "Skills", icon: "📂", content: "Skills Content" },
            { name: "Software", icon: "💻", content: "Software Content" },
            { name: "Security", icon: "🛡️", content: "Security Content" },
            { name: "Settings", icon: "⚙️", content: "Settings Content" },
          ]}
          onAppClick={openWindow}
        />
      </div>

      {/* Windows */}
      {fadeInStage >= 3 &&
        windows.map((win) => (
          <Window
            key={win.id}
            title={win.title}
            content={win.content}
            width={win.width}
            height={win.height}
            onClose={() => closeWindow(win.id)}
          />
        ))}
    </div>
  );
};

export default App;
