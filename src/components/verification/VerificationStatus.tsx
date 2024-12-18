import { VerificationBadge } from "./VerificationBadge";
import { VerificationLevel } from "@/types/verification";

interface VerificationStatusProps {
  level: VerificationLevel;
}

export const VerificationStatus = ({ level }: VerificationStatusProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <VerificationBadge level={level} />
      </div>
    </div>
  );
};