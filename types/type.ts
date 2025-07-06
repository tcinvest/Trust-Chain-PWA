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
  
