import { Card } from "@/components/ui/card";
import { VerificationBadge } from "./verification/VerificationBadge";
import { VerificationLevel } from "@/types/verification";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface LoanDashboardProps {
  verificationLevel: VerificationLevel;
  creditScore: number;
  totalLoansRepaid: number;
  onTimeRepayments: number;
}

const LoanDashboard = ({
  verificationLevel = 'NONE',
  creditScore = 300,
  totalLoansRepaid = 0,
  onTimeRepayments = 0,
}: LoanDashboardProps) => {
  const creditScorePercentage = ((creditScore - 300) / (850 - 300)) * 100;

  return (
    <Card className="w-full p-6 bg-white/50 backdrop-blur-sm space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">Loan Dashboard</h3>
          <VerificationBadge level={verificationLevel} className="mb-4" />
        </div>
        <div className="w-24 h-24">
          <CircularProgressbar
            value={creditScorePercentage}
            text={`${creditScore}`}
            styles={{
              path: {
                stroke: `rgba(45, 255, 249, ${creditScorePercentage / 100})`,
                strokeLinecap: 'round',
                transition: 'stroke-dashoffset 0.5s ease 0s',
              },
              trail: {
                stroke: '#d6d6d6',
                strokeLinecap: 'round',
              },
              text: {
                fill: '#374151',
                fontSize: '16px',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">Total Loans Repaid</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{totalLoansRepaid}</p>
        </Card>
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">On-time Repayments</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{onTimeRepayments}</p>
        </Card>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Credit Score Details</h4>
        <p className="text-sm text-brand-text-secondary">
          Your credit score is calculated based on your loan repayment history. 
          Scores range from 300 to 850, with higher scores unlocking better loan terms.
        </p>
      </div>
    </Card>
  );
};

export default LoanDashboard;