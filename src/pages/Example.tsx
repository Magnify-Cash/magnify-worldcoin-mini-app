import React, { useState, useEffect } from "react";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld"; // Assuming this is the path to your hook

const Example = () => {
  const {
    loanToken,
    tierCount,
    getTier,
    getNFTTier,
    getLoan,
    checkHasNFT,
    checkOwnership,
    fetchLoansByAddress,
    fetchLoanInfo,
    getAllTiers,
  } = useMagnifyWorld();

  const [userAddress, setUserAddress] = useState("");
  const [nftId, setNftId] = useState("");

  useEffect(() => {
    // This could be replaced with actual user address fetching logic
    const fetchUserAddress = async () => {
      // Mock user address for demonstration
      setUserAddress("0x123..."); // Replace with actual address fetching method
    };
    fetchUserAddress();
  }, []);

  const handleNFTIdChange = (event) => {
    setNftId(event.target.value);
  };

  const handleCheckNFT = () => {
    const tokenId = parseInt(nftId, 10);
    if (!isNaN(tokenId)) {
      console.log("NFT Tier:", getNFTTier(tokenId));
      console.log("Loan Info:", fetchLoanInfo(tokenId));
    }
  };

  return (
    <div>
      <h1>NFT Dashboard</h1>
      <p>Loan Token Address: {loanToken?.toString()}</p>
      <p>Number of Tiers: {tierCount?.toString()}</p>

      <h3>User has NFT?</h3>
      <p>{checkHasNFT(userAddress) ? "Yes" : "No"}</p>

      <h3>Check NFT Details</h3>
      <input type="number" value={nftId} onChange={handleNFTIdChange} placeholder="Enter NFT ID" />
      <button onClick={handleCheckNFT}>Check NFT</button>

      <h3>User's Active Loans</h3>
      <ul>
        {fetchLoansByAddress(userAddress)?.map((loanId) => (
          <li key={loanId.toString()}>
            Loan for NFT ID {loanId.toString()}:{JSON.stringify(getLoan(Number(loanId)))}
          </li>
        ))}
      </ul>

      <h3>All Tiers</h3>
      <ul>
        {getAllTiers().map((tier, index) => (
          <li key={index}>
            Tier {index + 1}: Loan Amount: {tier?.loanAmount?.toString()}, Interest Rate:{" "}
            {tier?.interestRate?.toString()}, Loan Period: {tier?.loanPeriod?.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Example;
