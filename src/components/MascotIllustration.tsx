import React from 'react';

type MascotIllustrationProps = {
  step: 1 | 2 | 3;
};

export const MascotIllustration = ({ step }: MascotIllustrationProps) => {
  const illustrations = {
    1: "/placeholder.svg", // Replace with actual mascot images
    2: "/placeholder.svg",
    3: "/placeholder.svg"
  };

  const altTexts = {
    1: "MAGBot mascot welcoming you to the app",
    2: "MAGBot mascot showing gas-free loans",
    3: "MAGBot mascot celebrating successful loan completion"
  };

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gradient-to-r from-worldcoin-primary/10 to-worldcoin-secondary/10">
      <img
        src={illustrations[step]}
        alt={altTexts[step]}
        className="w-full h-full object-contain animate-fade-up"
      />
    </div>
  );
};