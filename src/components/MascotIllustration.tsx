import React from 'react';

type MascotIllustrationProps = {
  step: 1 | 2 | 3;
};

export const MascotIllustration = ({ step }: MascotIllustrationProps) => {
  const illustrations = {
    1: "/lovable-uploads/316b6a12-c382-4fe2-8141-951582eb5fc9.png", // Mascot on dock
    2: "/lovable-uploads/3022d548-0603-4325-969e-a50b99e94a73.png", // Mascot on bench
    3: "/lovable-uploads/1e198544-a9e7-43e1-b1ef-60ee86aa3ba8.png"  // Mascot with staff
  };

  const altTexts = {
    1: "MAGBot mascot standing on a dock, welcoming you to the app",
    2: "MAGBot mascot sitting on a bench, showing how gas-free loans work",
    3: "MAGBot mascot celebrating with a magical staff, representing successful loan completion"
  };

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gradient-to-r from-worldcoin-primary/10 to-worldcoin-secondary/10">
      <img
        src={illustrations[step]}
        alt={altTexts[step]}
        className="w-full h-full object-contain animate-fade-up rounded-lg shadow-lg animate-pulse-glow"
        style={{
          animation: 'pulse-glow 2s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
          }
          100% {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
};