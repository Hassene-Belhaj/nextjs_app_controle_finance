export interface IBudget {
  name: string;
  id: string;
  amount: number;
  userId?: string;
  emoji: string | null;
  createdAt: Date;
  transactions?: Itransaction[];
}

export interface Itransaction {
  id: string;
  description: string;
  amount: number;
  emoji: string;
  createdAT: Date;
  budgetName?: string;
  budgetId?: string | null;
}
