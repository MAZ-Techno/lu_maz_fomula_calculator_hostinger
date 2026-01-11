export type CalculationType = 'CVSS' | 'VRL' | 'IP';

export interface SavedCalculation {
  id: string;
  type: CalculationType;
  title: string;
  inputs: Record<string, number>;
  result: number;
  message?: string;
  timestamp: number;
}

export interface CalculatorProps {
  onSave: (data: Omit<SavedCalculation, 'id' | 'timestamp'>) => void;
}
