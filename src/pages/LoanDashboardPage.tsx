import LoanDashboard from "@/components/LoanDashboard";
import { VerificationLevel } from "@/types/verification";

const LoanDashboardPage = () => {
  // For now using static data, these could be fetched from an API later
  const verificationLevel: VerificationLevel = 'NONE';
  const creditScore = 300;
  const totalLoansRepaid = 0;
  const onTimeRepayments = 0;

  return (
    <div className="container mx-auto p-6">
      <LoanDashboard
        verificationLevel={verificationLevel}
        creditScore={creditScore}
        totalLoansRepaid={totalLoansRepaid}
        onTimeRepayments={onTimeRepayments}
      />
    </div>
  );
};

export default LoanDashboardPage;