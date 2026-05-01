export interface FinancingModel {
  id?: number;

  funderId: number;
  projectId: number;
  
  fundingTypeId: number;
  fundingCurrencyId: number;

  fundingAmount: number;
  funderName?: string;
  currency?: string;
  fundsPercentage?: number;
}