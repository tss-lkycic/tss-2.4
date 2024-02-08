"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MovingBackground = () => {
  const [balls, setBalls] = useState([]);
  const colors = ["#EFAB9D", "#EFD19F", "#A1D6C1", "#ABB3DC"];
  const [closeToCenterPercent, setCloseToCenterPercent] = useState(10);
  const words = [
    "100 Ways",
    "to Craft your Career",
    "Re-imagine your Future",
    "a Data-Driven Method",
    "an International Edge",
    "Map to your Dream Job",
    "Strike a Well-Being balance",
  ];
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    const createBalls = () => {
      const newBalls = [];
      for (let i = 0; i < 500; i++) {
        let radius = Math.random() * 150;
        if (radius < 110) {
          radius = 110;
        }

        const shouldCreateCloseToCenter =
          Math.random() < closeToCenterPercent / 100;

        if (shouldCreateCloseToCenter) {
          radius = Math.random() * 130;
          if (radius < 110) {
            radius = 110;
          }
        }
        newBalls.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: 0,
          vy: 0,
          angle: Math.random() * 360 + Math.random() * 360,
          speed: 0.0001,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 5,
          margintop: Math.random() * 30,
          marginbot: Math.random() * 30,
          radius: radius,
        });
      }
      setBalls(newBalls);
    };

    createBalls();
  }, []);

  const updateBalls = () => {
    setBalls((prevBalls) => {
      return prevBalls.map((ball) => {
        ball.angle += ball.speed;

        ball.x =
          window.innerWidth / 2 + Math.cos(ball.angle) * ball.radius - 15;
        ball.y =
          window.innerHeight / 4 + Math.sin(ball.angle) * ball.radius - 15;

        if (ball.x > window.innerWidth) {
          ball.x = 0;
        } else if (ball.x < 0) {
          ball.x = window.innerWidth;
        }

        if (ball.y > window.innerHeight) {
          ball.y = 0;
        } else if (ball.y < 0) {
          ball.y = window.innerHeight;
        }

        return ball;
      });
    });
  };

  useEffect(() => {
    setInterval(updateBalls, 10);
  }, [balls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => {
        const nextIndex = (words.indexOf(prevText) + 1) % words.length;
        return words[nextIndex];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-[50vh] mt-[7rem] absolute flex flex-col overflow-y-hidden justify-center items-center overflow-x-hidden">
      <div>
        {balls.map((ball) => (
          <div
            key={ball.x + ball.y}
            className=""
            style={{
              position: "absolute",
              left: ball.x + "px",
              top: ball.y + "px",
              width: ball.size + "px",
              height: ball.size + "px",
              backgroundColor: ball.color,
              borderRadius: "50%",
              marginTop: ball.margintop + "px",
              marginLeft: ball.marginbot + "px",
            }}
          ></div>
        ))}
        <div className="h-[10rem] w-[10rem] flex flex-col justify-center items-center">
          <motion.h1
            className="text-[1.6rem] font-semibold italic text-center "
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {text}
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default MovingBackground;
