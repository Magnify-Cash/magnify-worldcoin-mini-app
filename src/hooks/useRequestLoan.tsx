import { useCallback, useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { abi } from "@/utils/abi";
import { MAGNIFY_PROTOCOL_ADDRESS, WORLDCOIN_CLIENT_ID, WORLDCOIN_NFT_COLLATERAL } from "@/utils/constants";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "wagmi/chains";

const useInitializeNewLoan = () => {
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  // Use the hook at the top level of your custom hook
  const { isLoading: isConfirmingTransaction, isSuccess: isTransactionConfirmed } =
    useWaitForTransactionReceipt({
      client: client,
      transactionId: transactionId || "",
      appConfig: {
        app_id: WORLDCOIN_CLIENT_ID,
      },
    });

  useEffect(() => {
    setIsConfirming(isConfirmingTransaction);
    setIsConfirmed(isTransactionConfirmed);
  }, [isConfirmingTransaction, isTransactionConfirmed]);

  const initializeNewLoan = useCallback(
    async (
      lendingDeskId: number,
      nftCollection: string,
      nftId: bigint,
      duration: number,
      amount: bigint,
      maxInterestAllowed: number,
    ) => {
      if (!MiniKit.isInstalled()) {
        setError("Worldcoin MiniKit is not installed");
        return;
      }

      setError(null);
      setTransactionId(null);
      setIsConfirming(false);
      setIsConfirmed(false);

      try {
        const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString();

        const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
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
                token: WORLDCOIN_NFT_COLLATERAL,
                amount: "1",
              },
              nonce: Date.now().toString(),
              deadline: deadline,
              spender: MAGNIFY_PROTOCOL_ADDRESS,
            },
          ],
        });

        if (finalPayload.status == "success") {
          setTransactionId(finalPayload.transaction_id);
          console.log("Loan initialization transaction sent:", finalPayload.transaction_id);
        } else {
          console.error("Error sending transaction", finalPayload);
          setError(`Transaction failed: ${finalPayload.details}`);
        }
      } catch (err) {
        setError(`Transaction failed: ${(err as Error).message}`);
      }
    },
    [], // Empty array since we're not using any state or props directly in the useCallback dependency array
  );

  return { initializeNewLoan, error, transactionId, isConfirming, isConfirmed };
};

export default useInitializeNewLoan;
