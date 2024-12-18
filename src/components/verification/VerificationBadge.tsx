import { ShieldCheck, ShieldAlert } from "lucide-react";
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";
import { Badge } from "@/components/ui/badge";

interface VerificationBadgeProps {
  level: VerificationLevel;
  className?: string;
}

export const VerificationBadge = ({ level, className = "" }: VerificationBadgeProps) => {
  const tier = VERIFICATION_TIERS[level];
  
  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${tier.color} ${className}`}
    >
      {level === 'NONE' ? (
        <ShieldAlert className="w-3 h-3" />
      ) : (
        <ShieldCheck className="w-3 h-3" />
      )}
      {tier.description}
    </Badge>
  );
};