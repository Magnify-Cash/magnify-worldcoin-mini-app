import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export type HelpGuideProps = {
  onClose: () => void;
};

export const HelpGuide = ({ onClose }: HelpGuideProps) => {
  const steps = [
    {
      title: "1. Verify Your Identity",
      description: "Use World ID to verify your identity and unlock higher loan limits.",
      tip: "ORB verification gives you access to loans up to $10!"
    },
    {
      title: "2. Apply for a Loan",
      description: "Choose your loan amount and duration based on your verification level.",
      tip: "Start small with a $1 loan to build trust."
    },
    {
      title: "3. Track & Repay",
      description: "Monitor your active loans and make repayments easily through your wallet.",
      tip: "Early repayments are available after 1 hour."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-up">
      <div className="container max-w-2xl h-full mx-auto py-16 overflow-y-auto">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">How to Use MAGBot</h2>
          </div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">💡 Tip: {step.tip}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={onClose} className="w-full">
            Got it, thanks!
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default HelpGuide;