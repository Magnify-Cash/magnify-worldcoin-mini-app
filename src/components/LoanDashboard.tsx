import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "./verification/VerificationBadge";
import { VerificationLevel } from "@/types/verification";
import { CircularProgressbar } from 'react-circular-progressbar';
import { Info } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Loan Dashboard</h1>
          <VerificationBadge level={verificationLevel} className="mb-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">Total Loans Repaid</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{totalLoansRepaid}</p>
        </Card>
        
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">On-time Repayments</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{onTimeRepayments}</p>
        </Card>
        
        <Card className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-brand-text-secondary mb-1">Credit Score</h4>
              <p className="text-2xl font-bold text-brand-text-primary">{creditScore}</p>
            </div>
            <div className="w-16 h-16">
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
                    fontSize: '24px',
                    fontWeight: 'bold',
                  },
                }}
              />
            </div>
          </div>
          <Tooltip content="Your credit score is calculated based on your loan repayment history. Scores range from 300 to 850, with higher scores unlocking better loan terms.">
            <Info className="w-4 h-4 text-brand-text-secondary mt-2" />
          </Tooltip>
        </Card>
      </div>

      <Card className="p-6 glass-card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Loan Eligibility</h3>
          <VerificationBadge level={verificationLevel} />
        </div>
        <p className="text-brand-text-secondary">
          Based on your verification status, you can borrow up to:
        </p>
        <p className="text-3xl font-bold text-brand-turquoise">
          ${verificationLevel === 'ORB' ? '10.00' : verificationLevel === 'PASSPORT' ? '3.00' : '1.00'}
        </p>
        {verificationLevel === 'NONE' && (
          <Button className="w-full primary-button">
            Get Verified with World ID
          </Button>
        )}
      </Card>
    </div>
  );
};

export default LoanDashboard;