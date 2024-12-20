import React, { useState, useEffect } from "react";
import {
  getLoanToken,
  getTierCount,
  checkHasNFT,
  getTier,
  getNFTTier,
  getLoan,
  checkOwnership,
  fetchLoansByAddress,
  fetchLoanInfo,
} from "@/hooks/useMagnifyWorld"; // Assuming this is where your functions are exported

const ExamplePage = () => {
  const [loanToken, setLoanToken] = useState(null);
  const [tierCount, setTierCount] = useState(null);
  const [hasNFT, setHasNFT] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [nftTier, setNftTier] = useState(null);
  const [loanInfo, setLoanInfo] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    // Fetch basic contract information
    const fetchContractInfo = async () => {
      try {
        const token = await getLoanToken();
        setLoanToken(token);
        const count = await getTierCount();
        setTierCount(count);
      } catch (error) {
        console.error("Error fetching contract info:", error);
      }
    };

    setUserAddress("0x7745B9B74a0C7637fa5B74d5Fc106118bdBB0eE7");
    fetchContractInfo();
  }, []);

  useEffect(() => {
    // Check if user has an NFT when address changes
    const checkUserNFT = async () => {
      if (userAddress) {
        try {
          const hasNFTResult = await checkHasNFT(userAddress);
          setHasNFT(hasNFTResult);
        } catch (error) {
          console.error("Error checking NFT:", error);
        }
      }
    };

    checkUserNFT();
  }, [userAddress]);

  useEffect(() => {
    // Fetch all tiers when tierCount changes
    const fetchAllTiers = async () => {
      if (tierCount) {
        const fetchedTiers = [];
        for (let i = 1; i <= tierCount; i++) {
          const tier = await getTier(i);
          if (tier) fetchedTiers.push(tier);
        }
        setTiers(fetchedTiers);
      }
    };

    fetchAllTiers();
  }, [tierCount]);

  const handleNFTIdChange = (event) => {
    setNftId(event.target.value);
  };

  const handleCheckNFT = async () => {
    const tokenId = parseInt(nftId, 10);
    if (!isNaN(tokenId)) {
      try {
        const tier = await getNFTTier(tokenId);
        setNftTier(tier);
        const loan = await fetchLoanInfo(tokenId);
        setLoanInfo(loan);
      } catch (error) {
        console.error("Error checking NFT details:", error);
      }
    }
  };

  const fetchUserLoans = async () => {
    if (userAddress) {
      try {
        const loans = await fetchLoansByAddress(userAddress);
        const loanDetails = await Promise.all(
          loans.map(async (loanId) => ({
            id: loanId,
            ...(await getLoan(Number(loanId.toString()))),
          })),
        );
        setActiveLoans(loanDetails);
      } catch (error) {
        console.error("Error fetching user loans:", error);
      }
    }
  };

  return (
    <div>
      <h1>NFT Dashboard</h1>
      <p>Loan Token Address: {loanToken?.toString()}</p>
      <p>Number of Tiers: {tierCount?.toString()}</p>

      <h3>User has NFT?</h3>
      <p>{hasNFT ? "Yes" : "No"}</p>

      <h3>Check NFT Details</h3>
      <input type="number" value={nftId} onChange={handleNFTIdChange} placeholder="Enter NFT ID" />
      <button onClick={handleCheckNFT}>Check NFT</button>
      {nftTier && <p>NFT Tier: {nftTier.toString()}</p>}
      {loanInfo && (
        <p>
          Loan Info: Amount Borrowed: {loanInfo.amountBorrowed.toString()}, Due Date:{" "}
          {new Date(loanInfo.dueDate * 1000).toLocaleString()}, Total Due: {loanInfo.totalDue.toString()}
        </p>
      )}

      <h3>User's Active Loans</h3>
      <button onClick={fetchUserLoans}>Fetch Loans</button>
      <ul>
        {activeLoans.map((loan) => (
          <li key={loan.id.toString()}>
            Loan for NFT ID {loan.id.toString()}: Amount: {loan.amount?.toString()}, Start Time:{" "}
            {new Date(loan.startTime * 1000).toLocaleString()}, Is Active: {loan.isActive ? "Yes" : "No"}
          </li>
        ))}
      </ul>

      <h3>All Tiers</h3>
      <ul>
        {tiers.map((tier, index) => (
          <li key={index}>
            Tier {index + 1}: Loan Amount: {tier.loanAmount.toString()}, Interest Rate:{" "}
            {tier.interestRate.toString()}, Loan Period: {tier.loanPeriod.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamplePage;
