"use client";

import React, { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

// Tonalidade base de cada cor (HSL hue) usada para a luz das bordas.
const glowHueMap = {
  blue: 220,
  purple: 280,
  green: 140,
  red: 355,
  orange: 30,
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const hue = glowHueMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ""; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = (): React.CSSProperties => {
    const baseStyles: Record<string, string | number> = {
      "--hue": hue,
      "--radius": "16",
      "--border-size": "1.5px",
      backgroundColor: "hsl(0 0% 60% / 0.12)",
      position: "relative",
      touchAction: "pan-y",
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles as React.CSSProperties;
  };

  // Luz fixa nas bordas — sem seguir o dedo/cursor.
  const borderGlowStyles = `
    [data-glow]::before {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: 0;
      padding: var(--border-size);
      border-radius: calc(var(--radius) * 1px);
      background: linear-gradient(
        140deg,
        hsl(var(--hue, 210) 90% 70% / 0.9),
        hsl(var(--hue, 210) 70% 55% / 0.15) 40%,
        transparent 70%,
        hsl(var(--hue, 210) 90% 75% / 0.6)
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: borderGlowStyles }} />
      <div
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? "aspect-[3/4]" : ""}
          rounded-2xl
          relative
          grid
          grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4
          gap-4
          backdrop-blur-[5px]
          ${className}
        `}
      >
        {children}
      </div>
    </>
  );
};

export { GlowCard };
