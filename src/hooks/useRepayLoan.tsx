import { useCallback, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { abi } from "@/utils/abi";
import { MAGNIFY_PROTOCOL_ADDRESS, WORLDCOIN_TOKEN_COLLATERAL } from "@/utils/constants";

const useLoanPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeLoanPayment = useCallback(
    async (
      loanId: bigint, // uint256, use BigInt for large numbers
      amount: bigint, // uint256, use BigInt for large numbers
      resolve: boolean, // bool in Ethereum is boolean in JavaScript
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
              functionName: "makeLoanPayment",
              args: [loanId, amount, resolve],
            },
          ],
          permit2: [
            {
              permitted: {
                token: WORLDCOIN_TOKEN_COLLATERAL, // Address of the token being transferred
                amount: amount.toString(), // Convert to string for the permit
              },
              nonce: Date.now().toString(),
              deadline: deadline,
              spender: MAGNIFY_PROTOCOL_ADDRESS, // The contract address that will spend these tokens
            },
          ],
        });

        // Handle the transaction response here if needed
        console.log("Payment transaction successful:", commandPayload, finalPayload);
      } catch (err) {
        setError(`Transaction failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { makeLoanPayment, isLoading, error };
};

export default useLoanPayment;
