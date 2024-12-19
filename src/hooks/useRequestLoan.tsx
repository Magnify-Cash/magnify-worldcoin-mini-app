import { useCallback, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { abi } from "@/utils/abi";
import { MAGNIFY_PROTOCOL_ADDRESS, WORLDCOIN_NFT_COLLATERAL } from "@/utils/constants";

const useInitializeNewLoan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeNewLoan = useCallback(
    async (
      lendingDeskId: number, // uint64, but number for simplicity in JavaScript
      nftCollection: string, // address in Ethereum is string
      nftId: bigint, // uint256, use BigInt for large numbers
      duration: number, // uint32
      amount: bigint, // uint256, use BigInt for large numbers
      maxInterestAllowed: number, // uint32
    ) => {
      if (!MiniKit.isInstalled()) {
        setError("Worldcoin MiniKit is not installed");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString();

        const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
          transaction: [
            {
              address: MAGNIFY_PROTOCOL_ADDRESS,
              abi: abi,
              functionName: "initializeNewLoan",
              args: [lendingDeskId, nftCollection, nftId, duration, amount, maxInterestAllowed],
            },
          ],
          permit2: [
            {
              permitted: {
                token: WORLDCOIN_NFT_COLLATERAL, // Address of the NFT contract
                amount: "1", // For NFTs, amount is usually 1 since you're transferring one token
              },
              nonce: Date.now().toString(),
              deadline: deadline,
              spender: MAGNIFY_PROTOCOL_ADDRESS, // The contract address that will spend this NFT
            },
          ],
        });
        console.log("Loan initialization successful:", commandPayload, finalPayload);
      } catch (err) {
        setError(`Transaction failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { initializeNewLoan, isLoading, error };
};

export default useInitializeNewLoan;
