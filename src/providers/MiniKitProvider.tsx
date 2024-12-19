import { ReactNode, useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { toast } from "sonner";
import { WORLDCOIN_CLIENT_ID } from "@/utils/constants";

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  const initializeMiniKit = () => {
    try {
      console.log("Initializing MiniKit...");
      MiniKit.install(WORLDCOIN_CLIENT_ID);
      console.log("MiniKit initialized successfully");
    } catch (error) {
      console.error("Failed to initialize MiniKit:", error);
      toast.error("Please open this app in World App to use wallet features");
    }
  };
  useEffect(() => {
    initializeMiniKit();
  }, []);
  return <>{children}</>;
};
