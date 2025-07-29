import { Decimal } from '@prisma/client/runtime/library';

export interface UserData {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    avatar: string | null;
    phone: string | null;
    country: string | null;
    city: string | null;
    kyc_credential?: string;
    balance: number;
    profit_balance: number;
    recovery_fund: number;
    total_withdrawals: number; 
    status: number | null;
    kyc: number | null;
    created_at: string | null;
}

export interface MarketProps {
    tokenData: any; 
    isDark: boolean;
  }

  export interface TokenData {
    symbol: string;
    name: string;
    id: number;
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
    holders: number;
    transactions24h: number;
  }

  export interface InvestmentBot {
    id: number;
    name: string;
    description: string;
    investmentRange: string;
    capitalBack: string;
    returnType: string;
    numberOfPeriods: string;
    profitWithdraw: string;
    holidayNote?: string;
    isActive: boolean;
  }
  
export type Investment = {
  id: number;
  user_id: number | null;
  schema_id: number | null;
  transaction_id: number | null;
  invest_amount: any;
  already_return_profit: number | null;
  total_profit_amount: any;
  last_profit_time: string | null;
  next_profit_time: string | null;
  capital_back: number | null;
  interest: number | null;
  interest_type: string | null;
  return_type: string | null;
  number_of_period: number | null;
  period_hours: number | null;
  wallet: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};


interface ReferralTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface ReferralData {
  totalEarned: number;
  totalReferrals: number;
  referralCode: string;
  referralLink: string;
  recentReferrals: Array<{
    id: string;
    name: string;
    joinedAt: string;
  }>;
  referralTransactions: ReferralTransaction[];
}

// types/type.ts (or wherever your types are defined)
export type DashboardData = {
  totalBalance: number;
  profitBalance: number;
  // Changed from single activeInvestment to array of activeInvestments
  activeInvestments: {
    id: number; // Added id field for unique keys
    amount: number;
    bot: string;
    createdAt: string;
    botDays: number;
    botReturnPercentage: number;
  }[];
  recentEarnings: {
    date: string;
    amount: number;
    type: string;
  }[];
  kycStatus: string;
  userInitial: string;
  avatar: string | null;
  firstName: string | null;
  username: string | null;
};