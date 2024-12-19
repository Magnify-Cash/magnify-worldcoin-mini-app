import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const Onboarding = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "1. Verify Your Identity",
      description:
        "Use World ID to verify your identity and access loans tailored to your verification level:",
      details: [
        "ORB Verified: Unlock loans up to $10.",
        "Passport Verified: Eligible for loans up to $3.",
        "Basic Verification: Start with $1 to build trust.",
      ],
      tip: "Verifying with ORB unlocks the highest loan limits and exclusive perks!",
    },
    {
      title: "2. Apply for a Loan",
      description:
        "Choose your loan amount and duration based on your verification level:",
      details: [
        "Select the loan size available to you: $1, $3, or $10.",
        "Pick a repayment duration (e.g., 7 days or 14 days).",
      ],
      tip: "Start small with a $1 loan if you're new to MAGBot, and increase your limits as you verify further.",
    },
    {
      title: "3. Track & Repay",
      description:
        "Easily monitor your active loans and make repayments directly through your wallet:",
      details: [
        "View your loan details, repayment schedule, and status.",
        "Make early repayments anytime after 1 hour to close your loan faster.",
      ],
      tip: "Repaying early helps build trust and unlocks access to larger loans over time!",
    },
  ];

  return (
    <div className="py-4 overflow-y-auto">
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">How to Use MAGBot</h2>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-sm font-medium">💡 Tip: {step.tip}</p>
              </div>
              <hr className="my-4 border-t-[1px] border-gray-300" />
            </div>
          ))}
        </div>

        <Button onClick={() => navigate("/wallet")} className="w-full">
          Got it, thanks!
        </Button>
      </Card>
    </div>
  );
};

export default Onboarding;
