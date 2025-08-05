import { NextResponse } from 'next/server';
import { getAllInvestments, getInvestmentStats } from '@/lib/actions/admin/getInvestmentsData';

export async function GET() {
    try {
        const [investments, stats] = await Promise.all([
            getAllInvestments(),
            getInvestmentStats()
        ]);

        return NextResponse.json({ investments, stats });
    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}