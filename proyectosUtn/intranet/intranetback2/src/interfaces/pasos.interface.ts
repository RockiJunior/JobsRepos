export interface IPaso {
  id: number;
  variant: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  prevConditions?: string[];
  nextConditions?: string[];
  actions?: string[];
  onRejectActions?: string[];
  intraTitle: string;
  goto?: string[];
  onExpiration?: string[];
  onRequestChanges?: string[];
  intraDescription: string;
  onGoPrevStep?: string[];
}
