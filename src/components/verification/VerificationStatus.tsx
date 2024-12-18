import { VerificationBadge } from "./VerificationBadge";
import { LoanEligibility } from "./LoanEligibility";
import { VerificationLevel } from "@/types/verification";
import { Card } from "@/components/ui/card";

interface VerificationStatusProps {
  level: VerificationLevel;
}

export const VerificationStatus = ({ level }: VerificationStatusProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <VerificationBadge level={level} />
      </div>
      <LoanEligibility level={level} />
    </div>
  );
};