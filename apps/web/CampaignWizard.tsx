import * as React from "react";

export interface CampaignWizardProps {
  children?: React.ReactNode;
  step?: number;
}

const steps = ["Goal & Budget", "Audience", "Creative"];

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ children, step = 0 }) => {
  return (
    <div className="rounded-magic bg-surface shadow-md p-6">
      <div className="flex space-x-2 mb-4">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`px-3 py-1 rounded-full text-sm ${index === step ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500'}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CampaignWizard;
