import { useState, useEffect } from 'react'
import './App.css'
import BeemiProvider from './components/BeemiProvider'
import CommentList from './components/CommentList'
import ApunchVideo from './assets/A_punch.mp4'
import BpunchVideo from './assets/B_dpunch.mp4'
import PauseVideo from './assets/pause.mp4'
import EntranceVideo from './assets/entrance.mp4'
import { LinearProgress, Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

function App() {
  const [gifts, setGifts] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [videoUrl, setVideoUrl] = useState(EntranceVideo)
  const [health, setHealth] = useState(100);
  const [playerAHealth, setPlayerAHealth] = useState(100);
  const [playerBHealth, setPlayerBHealth] = useState(100);

  const setupEventListeners = () => {
    const { streams, multiplayer } = window.beemi;

    streams.onViewerJoin((data) => {
      console.log("Viewer joined:", data);
      setViewers(prev => [...prev, data.user]);
    });

    streams.onChat((data) => console.log("Chat:", data));
    streams.onGift((data) => console.log("Gift:", data));
    streams.onLike((data) => console.log("Like:", data));
    streams.onFollow((data) => console.log("Follow:", data));

    // Optional multiplayer
    multiplayer.crdt.watch("gameState", (value, oldValue) => {
      console.log("CRDT gameState changed:", oldValue, "->", value);
    });
  };

  // 2️⃣ Initialize SDK
  useEffect(() => {
    const initializeBeemiSDK = () => {
      if (window.beemi && window.beemi.isReady()) {
        console.log("✅ Beemi SDK is ready");
        setupEventListeners(); // ✅ now defined
      } else {
        console.log("⏳ Waiting for Beemi SDK...");
        setTimeout(initializeBeemiSDK, 100);
      }
    };
    initializeBeemiSDK();
  }, []);

  // handle players health
  const handleClickA = () => {
    // Player A attacks → Player B loses 5 HP
    setPlayerBHealth(prev => Math.max(prev - 5, 0));
    console.log(`Player A attacks Player B`, playerBHealth);
    setVideoUrl(ApunchVideo);
  };

  const handleClickB = () => {
    // Player B attacks → Player A loses 5 HP
    setPlayerAHealth(prev => Math.max(prev - 5, 0));
    setVideoUrl(BpunchVideo);
  };


  // Utility function to pick color based on health %
  const getHealthColor = (value) => {
    if (value > 85) return "#4caf50";     // Green (Full Health)
    if (value > 70) return "#8bc34a";     // Light Green
    if (value > 55) return "#ffeb3b";     // Yellow
    if (value > 40) return "#ff9800";     // Orange
    if (value > 20) return "#ff5722";     // Deep Orange
    return "#f44336";                         // Critical
  };

  const handleVideoOne = () => {
    setVideoUrl(ApunchVideo)
  }
  const handleVideoTwo = () => {
    setVideoUrl(BpunchVideo)
  }
  const handleVideoThree = () => {
    setVideoUrl(EntranceVideo)
  }

  return (
    <BeemiProvider>
      <div className="app">
        {/*  useEffect(() => {
    // Listen for gift events
    window.beemi.streams.onGift((event) => {
      console.log("Gift received:", event);

      try {
        const data = event.data || event; // sometimes wrapped inside .data

        // simple check
        if (!data.user || !data.gift) {
          console.warn("Invalid gift event:", data);
          return;
        }

        const username = data.user.username || "Anonymous";
        const giftName = data.gift.name || "Unknown Gift";
        const emoji = data.gift.emoji || "🎁";
        const count = data.gift.count || 1;
        const value = data.gift.value || 0;

        // build simple string
        const giftText = `${emoji} Sending ${giftName} gift: ${username} x${count} (${value * count} coins)`;

        // update array
        setGifts((prev) => [...prev, giftText]);
      } catch (err) {
        console.error("Error handling gift:", err);
      }
    });
  }, []); */}
        <div className="header">
          <h1>Street Fighter</h1>
        </div>

        <div className="game-container">
          <div className="video-container">
            <div className="health-containers">
              <div className="left-health">
                <Box sx={{ width: "100%", maxWidth: 300, position: "relative", p: 1 }}>
                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={playerAHealth}
                    sx={{
                      height: 20,
                      borderRadius: 5,
                      backgroundColor: "#333", // Empty bar color
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getHealthColor(playerAHealth),
                        transition: "background-color 0.3s ease, width 0.5s ease",
                      },
                    }}
                  />

                  {/* Heart icon inside progress bar */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 10,
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        color: "#f44336",
                        fontSize: 20,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: "#fff", fontWeight: "bold" }}
                    >
                      {playerAHealth}%
                    </Typography>
                  </Box>
                </Box>
              </div>
              <div className="right-health">
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 300,
                    position: "relative",
                    p: 1,
                    transform: "scaleX(-1)", // flip bar direction
                  }}
                >
                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={playerBHealth}
                    sx={{
                      height: 20,
                      borderRadius: 5,
                      backgroundColor: "#333", // Empty bar color
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getHealthColor(playerBHealth),
                        transition: "background-color 0.3s ease, width 0.5s ease",
                      },
                    }}
                  />

                  {/* Heart icon + % (flipped back so text isn’t mirrored) */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right:110,
                      transform: "translateY(-50%) scaleX(-1)", // re-flip content
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        color: "#f44336",
                        fontSize: 20,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: "#fff", fontWeight: "bold" }}
                    >
                      {playerBHealth}%
                    </Typography>
                  </Box>
                </Box>
              </div>

            </div>
            <video className='game-video' src={videoUrl} muted loop autoPlay></video>
          </div>
          <button onClick={() => { handleVideoOne(); handleClickA(); }}>A</button>
          <button onClick={() => { handleVideoTwo(); handleClickB(); }}>B</button>
          <button onClick={handleVideoThree}>C</button>
        </div>
      </div>
    </BeemiProvider>
  )
}

export default App 