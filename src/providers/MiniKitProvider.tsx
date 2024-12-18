import { ReactNode, useEffect, useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { toast } from 'sonner';

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMiniKit = async () => {
      try {
        console.log('Initializing MiniKit...');
        await MiniKit.install('magbot-mini-app');
        console.log('MiniKit initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
        toast.error('Please open this app in World App to use wallet features');
        setIsInitialized(false);
      }
    };

    initializeMiniKit();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
};