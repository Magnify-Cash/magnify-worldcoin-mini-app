import { readContract } from "@wagmi/core";
import { magnifyworldabi } from "@/utils/magnifyworldabi";
import { MAGNIFY_WORLD_ADDRESS } from "@/utils/constants";
import { config } from "@/providers/Wagmi"; // Assuming this is where your Wagmi config lives
import { useEffect, useState } from "react";

// Define types for better type-safety
interface Tier {
  loanAmount: bigint;
  interestRate: bigint;
  loanPeriod: bigint;
}

interface Loan {
  amount: bigint;
  startTime: bigint;
  isActive: boolean;
  interestRate: bigint;
  loanPeriod: bigint;
}

interface LoanInfo {
  amountBorrowed: bigint;
  dueDate: bigint;
  totalDue: bigint;
}

interface ContractData {
  loanToken: string | null;
  tierCount: number | null;
  nftInfo: {
    hasNFT: boolean | null;
    tokenId: bigint | null;
    tier: Tier | null;
  };
  loans: Loan[] | null;
  allTiers: Record<number, Tier> | null;
}

export function useMagnifyWorld(walletAddress: `0x${string}`): {
  data: ContractData | null;
  isLoading: boolean;
  isError: boolean;
} {
  const [data, setData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Basic contract information
        const loanToken = await readContract(config, {
          address: MAGNIFY_WORLD_ADDRESS,
          abi: magnifyworldabi,
          functionName: "loanToken",
        });

        const tierCount = await readContract(config, {
          address: MAGNIFY_WORLD_ADDRESS,
          abi: magnifyworldabi,
          functionName: "tierCount",
        });

        const hasNFT = await readContract(config, {
          address: MAGNIFY_WORLD_ADDRESS,
          abi: magnifyworldabi,
          functionName: "hasNFT",
          args: [walletAddress],
        });

        let tokenId: bigint | null = null;
        let nftTier: Tier | null = null;
        if (hasNFT) {
          tokenId = await readContract(config, {
            address: MAGNIFY_WORLD_ADDRESS,
            abi: magnifyworldabi,
            functionName: "nftToTier",
            args: [BigInt(Number(hasNFT))],
          });

          const tierData = await readContract(config, {
            address: MAGNIFY_WORLD_ADDRESS,
            abi: magnifyworldabi,
            functionName: "tiers",
            args: [tokenId],
          });

          if (tierData) {
            nftTier = {
              loanAmount: tierData[0],
              interestRate: tierData[1],
              loanPeriod: tierData[2],
            };
          }
        }

        const loansArray = await readContract(config, {
          address: MAGNIFY_WORLD_ADDRESS,
          abi: magnifyworldabi,
          functionName: "fetchLoansByAddress",
          args: [walletAddress],
        });

        const loans = await Promise.all(
          ((loansArray as bigint[]) || []).map(async (loanId) => {
            const loanData = await readContract(config, {
              address: MAGNIFY_WORLD_ADDRESS,
              abi: magnifyworldabi,
              functionName: "loans",
              args: [loanId],
            });
            return {
              amount: loanData[0],
              startTime: loanData[1],
              isActive: loanData[2],
              interestRate: loanData[3],
              loanPeriod: loanData[4],
            };
          }),
        );

        const allTiers = await fetchAllTiers(Number(tierCount));

        setData({
          loanToken: String(loanToken),
          tierCount: Number(tierCount),
          nftInfo: {
            hasNFT: Boolean(hasNFT),
            tokenId,
            tier: nftTier,
          },
          loans,
          allTiers,
        });
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { data, isLoading, isError };
}

// Helper function to fetch all tiers
async function fetchAllTiers(tierCount: number): Promise<Record<number, Tier> | null> {
  const allTiers: Record<number, Tier> = {};
  for (let i = 0; i < tierCount; i++) {
    const tierData = await readContract(config, {
      address: MAGNIFY_WORLD_ADDRESS,
      abi: magnifyworldabi,
      functionName: "tiers",
      args: [BigInt(i)],
    });
    if (tierData) {
      allTiers[i] = {
        loanAmount: tierData[0],
        interestRate: tierData[1],
        loanPeriod: tierData[2],
      };
    }
  }
  return allTiers;
}
