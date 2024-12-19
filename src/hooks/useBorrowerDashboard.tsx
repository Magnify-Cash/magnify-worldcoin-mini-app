import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

const endpoint =
  "https://subgraph.satsuma-prod.com/4f27a5258a15/nftylabs--411108/magnify-cash-worldchain/api";

const BorrowerDashboardQuery = gql`
  query BorrowerDashboard($walletAddress: String!) {
    loans(
      where: { borrower: $walletAddress }
      orderBy: "startTime"
      orderDirection: "desc"
      after: $after
      limit: 100
    ) {
      id
      amount
      amountPaidBack
      duration
      startTime
      nftCollection {
        id
      }
      lendingDesk {
        erc20 {
          id
          symbol
          decimals
        }
      }
      nftId
      interest
      status
      lender {
        id
      }
    }
  }
`;

// Custom hook for Borrower Dashboard
function useBorrowerDashboard(walletAddress: `0x${string}`) {
  return useQuery({
    queryKey: ["borrowerDashboard", walletAddress],
    queryFn: async () => {
      const variables = { walletAddress };
      return request(endpoint, BorrowerDashboardQuery, variables);
    },
  });
}

export default useBorrowerDashboard;
