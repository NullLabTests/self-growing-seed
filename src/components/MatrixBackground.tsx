
import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix rain characters
    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+-=[]{}|;:,.<>/?";
    const characters = matrix.split("");
    
    // Font size for the characters
    const fontSize = 14;
    
    // Number of columns (based on canvas width and font size)
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the Y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start above the canvas
    }
    
    // Drawing function
    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 10, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;
      
      // Loop through each column
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // Alternative colors for some characters
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#77ddff"; // Blue accent
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = "#f0f055"; // Yellow accent
        } else {
          // Gradient of greens based on position
          const greenIntensity = 128 + Math.floor(Math.random() * 128);
          ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
        }
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset to top when hitting the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment Y coordinate
        drops[i]++;
      }
      
      // Reset fill style
      ctx.fillStyle = "#0f0";
    };
    
    // Animation loop
    const interval = setInterval(draw, 33); // ~30 FPS
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none"
    />
  );
};

export default MatrixBackground;
