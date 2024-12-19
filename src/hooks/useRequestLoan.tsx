import { useCallback, useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { abi } from "@/utils/abi";
import { MAGNIFY_PROTOCOL_ADDRESS, WORLDCOIN_CLIENT_ID, WORLDCOIN_DESK_INFO } from "@/utils/constants";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "wagmi/chains";
import { toast } from "sonner";

type LoanDetails = {
  amount: number;
  duration: number;
  transactionId: string;
};

const useInitializeNewLoan = () => {
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);

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
    async (nftId: bigint, duration: number, amount: bigint, maxInterestAllowed: number) => {
      if (!MiniKit.isInstalled()) {
        setError("Worldcoin MiniKit is not installed");
        return;
      }

      setError(null);
      setTransactionId(null);
      setIsConfirming(false);
      setIsConfirmed(false);
      setLoanDetails(null);

      try {
        const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString();

        const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
          transaction: [
            {
              address: MAGNIFY_PROTOCOL_ADDRESS,
              abi: abi,
              functionName: "initializeNewLoan",
              args: [
                WORLDCOIN_DESK_INFO.lending_desk_id,
                WORLDCOIN_DESK_INFO.nft_collection_address,
                nftId,
                duration,
                amount,
                maxInterestAllowed,
              ],
            },
          ],
          permit2: [
            {
              permitted: {
                token: WORLDCOIN_DESK_INFO.nft_collection_address,
                amount: "1",
              },
              nonce: Date.now().toString(),
              deadline: deadline,
              spender: MAGNIFY_PROTOCOL_ADDRESS,
            },
          ],
        });

        if (finalPayload.status === "success") {
          setTransactionId(finalPayload.transaction_id);
          console.log("Loan initialization transaction sent:", finalPayload.transaction_id);

          // Convert bigint to number for amount and duration
          setLoanDetails({
            amount: Number(amount), // Assuming amount is in smallest unit, convert to readable number
            duration: duration, // Assuming duration is already in days or whatever unit you want to display
            transactionId: finalPayload.transaction_id,
          });
        } else {
          console.error("Error sending transaction", finalPayload);
          setError(`Transaction failed`);
        }
      } catch (err) {
        console.error("Error sending transaction", err);
        setError(`Transaction failed: ${(err as Error).message}`);
      }
    },
    [], // Empty array for simplicity, consider adding state setters if needed
  );

  return { initializeNewLoan, error, transactionId, isConfirming, isConfirmed, loanDetails };
};

export default useInitializeNewLoan;
