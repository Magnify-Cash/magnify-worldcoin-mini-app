import { Card } from "@/components/ui/card";
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";

interface LoanEligibilityProps {
  level: VerificationLevel;
}

export const LoanEligibility = ({ level }: LoanEligibilityProps) => {
  const tier = VERIFICATION_TIERS[level];
  
  return (
    <Card className="p-4 space-y-2 glass-card">
      <h3 className="font-semibold">Loan Eligibility</h3>
      <div className="space-y-1">
        <p className="text-sm text-brand-text-secondary">
          Maximum loan amount:
          <span className={`ml-2 font-semibold ${tier.color}`}>
            ${tier.maxLoanAmount.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-brand-text-secondary">
          Based on your {tier.description} status
        </p>
      </div>
    </Card>
  );
};