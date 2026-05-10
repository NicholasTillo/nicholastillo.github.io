// src/components/GameOfLifeBackground.js
import React, { useEffect, useRef } from 'react';
import './GameOfLifeBackground.css';

export default function GameOfLifeBackground() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rows = 160;
    const cols = 240;
    let grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0)
    );

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }
    resize();
    window.addEventListener('resize', resize);

    function step() {
      const next = grid.map((row, y) =>
        row.map((cell, x) => {
          const neighbors = [
            [-1,-1],[-1,0],[-1,1],
            [0,-1],       [0,1],
            [1,-1],[1,0],[1,1]
          ].reduce((sum, [dy, dx]) => {
            const ny = y + dy;
            const nx = x + dx;
            return sum + ((grid[ny]?.[nx] || 0) ? 1 : 0);
          }, 0);

          return cell
            ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
            : (neighbors === 3 ? 1 : 0);
        })
      );

      grid = next;
      draw();
    }

    function draw() {
      const cellW = canvas.width / cols;
      const cellH = canvas.height / rows;
      ctx.fillStyle = '#1F2245';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6A4A79';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[y][x]) {
            ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
          }
        }
      }
    }

    const intervalId = setInterval(step, 1000);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="game-of-life-bg" />;
}