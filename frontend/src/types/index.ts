export interface DashboardData  {
  month: string;
  income: number;
  expense: number;
  balance: number;
};
export interface Resident {
  id: number;
  full_name: string;
  ktp_photo: string;
  status: string;
  phone_number: string;
  is_married: boolean;
}
export interface BillingHistory  {
  resident_name: string;
  period: string;
  status: string;
  amount_paid: number;
};

export interface HouseHistoryDetail  {
  start_date: string;
  resident_id: number;
  end_date: string | null;
  resident: {
    id: number;
    full_name: string;
    status: string;
    phone_number: string;
  };
};

export interface House  {
  id: number;
  house_number: string;
  current_resident_name:string;
  status: string;
  billing_history: BillingHistory[];
  house_histories: HouseHistoryDetail[];
};
export interface Expense {
  id: number;
  description: string;
  amount: string;
  expense_date: string;
}
export interface Fee {
  id: number;
  name: string;
  amount: number;
}
export interface IncomeFormData {
  id: number;
  house_id: number;
  resident_id: number | "";
  payment_date: string;
  period_date: string;
  fees: {
    fee_id: number;
    pay_yearly: boolean;
  }[];
}

export interface IncomeDetail  {
  fee_name: string;
  period: string;
  amount: number;
};

export interface Income  {
  id: number;
  house_number: string;
  resident_name: string;
  payment_date: string;
  total_amount: number;
  details: IncomeDetail[];
};

export interface IncomeItem {
  id: number;
  payment_date: string;
  amount: number;
  fee: { fee_type: string };
  house: { house_number: string };
};

export interface ExpenseItem {
  id: number;
  expense_date: string;
  amount: number;
  description: string;
};

export interface ReportDetails {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
};
export interface ReportSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}
