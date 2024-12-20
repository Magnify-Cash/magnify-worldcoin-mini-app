import { useCallback } from "react";
import { useReadContract } from "wagmi";
import { magnifyworldabi } from "@/utils/magnifyworldabi";
import { MAGNIFY_WORLD_ADDRESS } from "@/utils/constants";

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

export function useMagnifyWorld() {
  // Basic contract information
  const { data: loanToken } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "loanToken",
  });

  const { data: tierCount } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "tierCount",
  });

  // Hook for getting tier information
  const { data: tierData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "tiers",
  });

  // Hook for getting NFT tier
  const { data: nftTierData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "nftToTier",
  });

  // Hook for getting loan information
  const { data: loanData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "loans",
  });

  // Hook for checking if address has NFT
  const { data: hasNFTData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "hasNFT",
  });

  // Hook for checking NFT ownership
  const { data: ownershipData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "checkOwnership",
  });

  // Hook for fetching loans by address
  const { data: loansByAddressData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "fetchLoansByAddress",
  });

  // Hook for fetching loan info
  const { data: loanInfoData } = useReadContract({
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "fetchLoanInfo",
  });

  // Wrapper functions that use the hook data
  const getTier = useCallback(
    (tierId: number) => {
      if (!tierData) return null;
      return tierData[BigInt(tierId)] as Tier;
    },
    [tierData],
  );

  const getNFTTier = useCallback(
    (tokenId: number) => {
      if (!nftTierData) return null;
      return nftTierData[BigInt(tokenId)] as bigint;
    },
    [nftTierData],
  );

  const getLoan = useCallback(
    (tokenId: number) => {
      if (!loanData) return null;
      return loanData[BigInt(tokenId)] as Loan;
    },
    [loanData],
  );

  const checkHasNFT = useCallback(
    (address: `0x${string}`) => {
      if (!hasNFTData) return false;
      return hasNFTData[address] as boolean;
    },
    [hasNFTData],
  );

  const checkOwnership = useCallback(
    (owner: `0x${string}`, tokenId: number) => {
      if (!ownershipData) return false;
      return ownershipData[owner]?.[BigInt(tokenId)] as boolean;
    },
    [ownershipData],
  );

  const fetchLoansByAddress = useCallback(
    (wallet: `0x${string}`) => {
      if (!loansByAddressData) return [];
      return loansByAddressData[wallet] as bigint[];
    },
    [loansByAddressData],
  );

  const fetchLoanInfo = useCallback(
    (tokenId: number): LoanInfo | null => {
      if (!loanInfoData) return null;
      const info = loanInfoData[BigInt(tokenId)];
      if (!info) return null;

      return {
        amountBorrowed: info[0],
        dueDate: info[1],
        totalDue: info[2],
      };
    },
    [loanInfoData],
  );

  const getAllTiers = useCallback(() => {
    if (!tierCount) return [];
    return Array.from({ length: Number(tierCount) }, (_, i) => getTier(i + 1)).filter(Boolean);
  }, [tierCount, getTier]);

  return {
    // Contract info
    loanToken,
    tierCount,

    // Getter functions
    getTier,
    getNFTTier,
    getLoan,
    checkHasNFT,
    checkOwnership,

    // View functions
    fetchLoansByAddress,
    fetchLoanInfo,
    getAllTiers,
  };
}
