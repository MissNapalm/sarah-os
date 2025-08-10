import React, { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import Dock from "./components/Dock";
import Window from "./components/Window";
import DesktopIcon from "./components/DesktopIcon";
import HackerTerminal from "./components/HackerTerminal";
import Calculator from "./components/Calculator";
import Arkanoid from "./components/Arkanoid"; // if your game component is actually named Ultranoid, switch this import too
import PipesScreensaver from "./components/PipesScreensaver";
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
  const [activeWindow, setActiveWindow] = useState("");
  const [showHackerTerminal, setShowHackerTerminal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showArkanoid, setShowArkanoid] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [audio, setAudio] = useState(true); // Audio enabled by default
  const [icons, setIcons] = useState([
    { id: 1, name: "Hacker Typer Game", icon: "💻", content: "Documents Content", position: { x: 20, y: 130 } },
    { id: 2, name: "Calculator", icon: "🧮", content: "Projects Content", position: { x: 20, y: 230 } },
    // Renamed Arkanoid -> Ultranoid
    { id: 3, name: "Ultranoid", icon: "🧱", content: "Arkanoid Content", position: { x: 20, y: 330 } },
    { id: 4, name: "3D Pipes Screensaver", icon: "�", content: "Screensaver Content", position: { x: 20, y: 430 } },
  ]);
  const [booted, setBooted] = useState(false);
  const [fadeInStage, setFadeInStage] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [blackScreenOpacity, setBlackScreenOpacity] = useState(1);

  // Sounds
  const bootSound = new Howl({
    src: ["/bootup.mp3"],
    volume: 0.5,
    format: ['mp3'],
    html5: false,
    preload: true,
    onload: () => { console.log("Boot sound loaded successfully"); },
    onloaderror: (id, error) => { console.log("Boot sound load error:", error); },
    onplay: () => { console.log("Boot sound playing"); },
    onplayerror: (id, error) => { console.log("Boot sound play error:", error); }
  });

  const whooshSound = new Howl({
    src: ["/whoosh.wav"],
    volume: 0.3,
    format: ['wav'],
    html5: false,
    preload: true,
    onloaderror: (id, error) => { console.log("Whoosh sound load error:", error); }
  });

  const openWindow = (itemName) => {
    if (audio) {
      const whooshSound = new Howl({ src: ["/whoosh.wav"], volume: 0.9 });
      whooshSound.play();
    }

    // Close any existing windows first
    setActiveWindow("");
    setWindows([]);
    setShowHackerTerminal(false);
    setShowCalculator(false);
    setShowArkanoid(false);
    setShowScreensaver(false);

    if (itemName === "Terminal") {
      setShowHackerTerminal(true);
    } else if (itemName === "Calculator") {
      setShowCalculator(true);
    // Change trigger to "Ultranoid"
    } else if (itemName === "Ultranoid") {
      setShowArkanoid(true); // this still renders your Arkanoid/Ultranoid component
    } else if (itemName === "3D Pipes Screensaver") {
      setShowScreensaver(true);
    } else {
      // Create window for standard dock items
      let content;
      switch (itemName) {
        case "About Me":
          content = <AboutMeContent />;
          break;
        case "Skills":
          content = <SkillsContent />;
          break;
        case "Software":
          content = <EthicalHacksContent />;
          break;
        case "Security":
          content = <NonprofitContent />;
          break;
        case "Resume":
          content = <SettingsContent />;
          break;
        default:
          content = <div>Content not found</div>;
      }
      
      // 30% bigger (520x480 → 676x624)
      setWindows([{
        id: Date.now(),
        title: itemName,
        content: content,
        width: 676,
        height: 624
      }]);
      setActiveWindow(itemName);
    }
  };

  const closeWindow = (id) => setWindows((prev) => prev.filter((win) => win.id !== id));
  const closeCalculator = () => setShowCalculator(false);
  const closeArkanoid = () => setShowArkanoid(false);
  const closeScreensaver = () => setShowScreensaver(false);

  const handleIconDrag = (id, e) => {
    const iconIndex = icons.findIndex((icon) => icon.id === id);
    if (iconIndex === -1) return;

    const newIcons = [...icons];
    const newX = newIcons[iconIndex].position.x + e.movementX;
    const newY = newIcons[iconIndex].position.y + e.movementY;

    if (newY < dockHeight) {
      newIcons[iconIndex].position.x = newX;
    } else {
      newIcons[iconIndex].position.x = newX;
      newIcons[iconIndex].position.y = newY;
    }
    setIcons(newIcons);
  };

  const handleBoot = () => {
    console.log("Boot button clicked - attempting to play sound");
    try { bootSound.play(); } catch (error) { console.log("Boot sound immediate play error:", error); }

    setFadeInStage(1);
    setTimeout(() => setFadeInStage(2), 600);
    setTimeout(() => setFadeInStage(3), 1200);

    setTimeout(() => setBlackScreenOpacity(0), 200);
    setTimeout(() => setButtonVisible(false), 100);
    setTimeout(() => setBooted(true), 2900);
  };

  return (
    <div 
      className="desktop" 
      style={{ 
        backgroundImage: `url(${wallpaperImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
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
          transition: "none",
          zIndex: 40,
        }}
      >
        <h1 className="text-white font-bold text-center" style={{
          fontSize: "4rem",
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: "700",
          letterSpacing: "-0.02em",
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
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            onMouseDown={(e) => {
              const onDrag = (event) => handleIconDrag(icon.id, event);
              const onDragEnd = () => {
                document.removeEventListener("mousemove", onDrag);
                document.removeEventListener("mouseup", onDragEnd);
              };
              document.addEventListener("mousemove", onDrag);
              document.addEventListener("mouseup", onDragEnd);
              e.preventDefault();
            }}
            onMouseEnter={() => {
              try { whooshSound.play(); } catch (error) { console.log("Whoosh sound play error:", error); }
            }}
          >
            <DesktopIcon
              name={icon.name}
              icon={icon.icon}
              onDoubleClick={() => openWindow(icon.name)}
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
            { name: "Resume", icon: "🌐", content: "Resume Content" },
          ]}
          onAppClick={openWindow}
        />
      </div>

      {/* Windows */}
      {fadeInStage >= 2 &&
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

      {/* Calculator */}
      {showCalculator && <Calculator onClose={closeCalculator} />}

      {/* Ultranoid (uses your Arkanoid component unless you rename/import Ultranoid) */}
      {showArkanoid && <Arkanoid onClose={closeArkanoid} />}

      {/* 3D Pipes Screensaver */}
      {showScreensaver && <PipesScreensaver onClose={closeScreensaver} />}
    </div>
  );
};

export default App;
