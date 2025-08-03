import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import GlassSurface from './GlassSurface/GlassSurface';
import Particles from './Particles/Particles'; // Import the Particles component

function App() {
  const scrollRef = useRef(null);
  const videoRef = useRef(null);
  const images = [
    "/friends2.jpeg",
    "/friends.jpeg",
    "/friends3.jpeg",
    "/friends4.jpeg"
  ];
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [hasFirstVideoPlayed, setHasFirstVideoPlayed] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("/fun.mp4");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollRef.current?.scrollTop;
      if (scrollTop !== undefined && !isTimerActive) {
        if (scrollTop >= 1000 && scrollTop <= 1500) {
          setIsVideoVisible(true);
        } else {
          setIsVideoVisible(false);
        }
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isTimerActive]);

  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      // Set muted to true initially for autoplay compatibility
      videoRef.current.muted = true;
      
      videoRef.current.play().then(() => {
        // Attempt to unmute after playback starts
        videoRef.current.muted = false;
      }).catch(error => {
        console.error("Video play failed:", error);
      });
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isVideoVisible]);

  const handleVideoReady = () => {
    if (isVideoVisible && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
  };

  const handleVideoEnd = () => {
    setIsVideoVisible(false);
    if (!hasFirstVideoPlayed) {
      setHasFirstVideoPlayed(true);
      setIsTimerActive(true);
      setCurrentVideo("/fun.mp4"); // Using same video for both, update path if needed
      console.log("First video ended. Starting 5-minute timer.");
      setTimeout(() => {
        console.log("5-minute timer finished. You can play the next video now.");
        setIsTimerActive(false);
      }, 300000);
    }
  };

  const animationStyles = `
    @keyframes slideIn {
      from {
        transform: translate(-100vw, -50%);
      }
      to {
        transform: translate(-50%, -50%);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>

      {/* Particles Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div
        ref={scrollRef}
        className="scroll-wrapper"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
          color: 'white',
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          filter: isVideoVisible ? 'blur(8px)' : 'none',
          transition: 'filter 0.5s ease-out',
        }}
      >
        <div
          className="maincontainer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            padding: '4rem 0',
          }}
        >
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h1 style={{ color: 'white', scrollSnapAlign: 'center' }}>Happy Friendship Day Preet 💕</h1>
            <h2 style={{ color: 'white', scrollSnapAlign: 'center' }}>scroll down to find something cool</h2>
          </div>
          
          <GlassSurface
            width={400}
            height={100}
            borderRadius={24}
            style={{ position: 'absolute', zIndex: 1, top: "40%" }}
          />

          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Friend ${index + 1}`}
              className="glass-img"
              style={{
                borderRadius: '20px',
                scrollSnapAlign: 'center',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.1)',
                width: '80%',
                maxWidth: '500px',
                height: 'auto'
              }}
            />
          ))}
        </div>
      </div>

      {isVideoVisible && (
        <div
          className="video-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <video
            ref={videoRef}
            src={currentVideo}
            onEnded={handleVideoEnd}
            controls
            onCanPlay={handleVideoReady}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              maxWidth: '80vw',
              maxHeight: '80vh',
              borderRadius: '16px',
              animation: 'slideIn 1s ease-out forwards',
            }}
          />
        </div>
      )}
    </>
  );
}

export default App;