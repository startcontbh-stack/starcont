"use client";

import * as React from "react";
import { useEffect, useState } from "react";

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  // Validate and process input text
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  // Maior palavra do array — usada para reservar a largura e impedir que a
  // linha quebre de forma diferente conforme o texto digita/apaga (o que faria
  // o título encolher e empurrar a dobra pra cima).
  const longest = textArray.reduce(
    (a, b) => (b.length > a.length ? b : a),
    "",
  );

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
    textArray.length,
  ]);

  return (
    <span className={`relative inline-block align-baseline ${className ?? ""}`}>
      {/* Placeholder invisível: reserva a largura da maior palavra (+ cursor)
          para a quebra de linha nunca mudar e a altura ficar travada. */}
      <span aria-hidden className="invisible">
        {longest}
        {cursor}
      </span>
      <span className="absolute left-0 top-0">
        {displayText}
        <span className="animate-pulse">{cursor}</span>
      </span>
    </span>
  );
}
