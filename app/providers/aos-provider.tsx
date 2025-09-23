"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,  // Длительность анимации (мс)
      offset: 50,     // Отступ для триггера
      once: true,     // Анимация запускается один раз
      // easing: "ease-in-out", // при желании можете задать плавность
    });
  }, []);

  return <>{children}</>;
}
