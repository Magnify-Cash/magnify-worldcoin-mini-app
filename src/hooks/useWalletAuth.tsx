import { useState, useEffect } from "react";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { toast } from "sonner";

interface UseWalletAuthProps {
  onSignIn: () => void;
  onClose: () => void;
}

export const useWalletAuth = ({ onSignIn, onClose }: UseWalletAuthProps) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isMinikitAvailable, setIsMinikitAvailable] = useState(false);

  useEffect(() => {
    const checkMiniKit = () => {
      const isAvailable = MiniKit.isInstalled();
      console.log('MiniKit available:', isAvailable);
      setIsMinikitAvailable(isAvailable);
      
      if (!isAvailable) {
        toast.error('Please open this app in World App to use wallet features');
      }
    };

    checkMiniKit();
  }, []);

  useEffect(() => {
    if (!isMinikitAvailable) {
      console.log('MiniKit not available, skipping auth response setup');
      return;
    }

    const handleAuthResponse = async (payload: any) => {
      console.log("Auth response received:", payload);
      if (payload.status === "error") {
        console.error("Authentication failed:", payload);
        toast.error("Failed to sign in. Please try again.");
        return;
      }

      try {
        console.log("Authentication successful:", payload);
        setIsGlowing(true);
        setTimeout(() => {
          toast.success("Successfully signed in!");
          onSignIn();
          onClose();
        }, 1000);
      } catch (error) {
        console.error("Error processing auth response:", error);
        toast.error("Failed to complete authentication. Please try again.");
      }
    };

    console.log('Setting up MiniKit auth response listener');
    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleAuthResponse);

    return () => {
      console.log('Cleaning up MiniKit auth response listener');
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, [onSignIn, onClose, isMinikitAvailable]);

  return {
    isGlowing,
    setIsGlowing,
    isMinikitAvailable,
  };
};