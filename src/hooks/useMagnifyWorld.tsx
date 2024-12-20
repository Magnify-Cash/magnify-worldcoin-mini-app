import { readContract } from "@wagmi/core";
import { magnifyworldabi } from "@/utils/magnifyworldabi";
import { MAGNIFY_WORLD_ADDRESS } from "@/utils/constants";
import { config } from "@/providers/Wagmi";

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

// Basic contract information
export async function getLoanToken() {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "loanToken",
  });
}

export async function getTierCount() {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "tierCount",
  });
}

export async function checkHasNFT(address: `0x${string}`) {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "hasNFT",
    args: [address],
  });
}

// Read Tier information
export async function getTier(tierId: number): Promise<Tier | null> {
  const tier = await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "tiers",
    args: [BigInt(tierId)],
  });
  return tier
    ? {
        loanAmount: tier[0],
        interestRate: tier[1],
        loanPeriod: tier[2],
      }
    : null;
}

// Read NFT tier
export async function getNFTTier(tokenId: number): Promise<bigint | null> {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "nftToTier",
    args: [BigInt(tokenId)],
  });
}

// Read Loan information
export async function getLoan(tokenId: number): Promise<Loan | null> {
  const loan = await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "loans",
    args: [BigInt(tokenId)],
  });
  return loan
    ? {
        amount: loan[0],
        startTime: loan[1],
        isActive: loan[2],
        interestRate: loan[3],
        loanPeriod: loan[4],
      }
    : null;
}

// Check NFT ownership
export async function checkOwnership(owner: `0x${string}`, tokenId: number): Promise<boolean> {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "checkOwnership",
    args: [owner, BigInt(tokenId)],
  });
}

// Fetch loans by address
export async function fetchLoansByAddress(wallet: `0x${string}`): Promise<bigint[] | null> {
  return await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "fetchLoansByAddress",
    args: [wallet],
  });
}

// Fetch loan info
export async function fetchLoanInfo(tokenId: number): Promise<LoanInfo | null> {
  const loanInfo = await readContract(config, {
    address: MAGNIFY_WORLD_ADDRESS,
    abi: magnifyworldabi,
    functionName: "fetchLoanInfo",
    args: [BigInt(tokenId)],
  });
  return loanInfo
    ? {
        amountBorrowed: loanInfo[0],
        dueDate: loanInfo[1],
        totalDue: loanInfo[2],
      }
    : null;
}
