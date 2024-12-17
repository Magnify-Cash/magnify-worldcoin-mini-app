import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    MiniKit.install('magbot-mini-app');
  }, []);

  return <>{children}</>;
};