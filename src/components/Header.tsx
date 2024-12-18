import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-purple-gradient">
        MAGBot Mini App
      </h1>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          className="border-modern-purple/20"
        >
          Select Dates
        </Button>
        <Button 
          className="bg-purple-gradient hover:opacity-90"
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};