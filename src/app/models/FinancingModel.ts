export interface FinancingModel {
  id?: number;

  funderId: number;
  projectId: number;

  fundingStartDte: string;
  fundingEndDte: string;

  fundingTypeId: number;
  fundingCurrencyId: number;

  fundingAmount: number;
  funderName?: string;
  currency?: string;
}