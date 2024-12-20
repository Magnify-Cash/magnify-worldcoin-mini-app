import { useCallback, useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { MAGNIFY_PROTOCOL_ADDRESS, WORLDCOIN_CLIENT_ID, WORLDCOIN_DESK_INFO } from "@/utils/constants";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "wagmi/chains";

type LoanDetails = {
  amount: number;
  duration: number;
  transactionId: string;
};

const useRequestLoan = () => {
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

  const requestNewLoan = useCallback(async (nftId: bigint) => {
    setError(null);
    setTransactionId(null);
    setIsConfirming(false);
    setIsConfirmed(false);
    setLoanDetails(null);

    try {
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: MAGNIFY_PROTOCOL_ADDRESS,
            abi: [
              {
                inputs: [
                  {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                  },
                ],
                name: "requestLoan",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ],
            functionName: "requestNewLoan",
            args: [nftId],
          },
        ],
      });

      if (finalPayload.status === "success") {
        setTransactionId(finalPayload.transaction_id);
        console.log("Loan initialization transaction sent:", finalPayload.transaction_id);
      } else {
        console.error("Error sending transaction", finalPayload, commandPayload);
        setError(`Transaction failed`);
      }
    } catch (err) {
      console.error("Error sending transaction", err);
      setError(`Transaction failed: ${(err as Error).message}`);
    }
  }, []);

  return { requestNewLoan, error, transactionId, isConfirming, isConfirmed, loanDetails };
};

export default useRequestLoan;
