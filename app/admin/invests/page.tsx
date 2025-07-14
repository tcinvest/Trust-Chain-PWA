// app/admin/investments/page.tsx
import { getAllInvestments, getInvestmentStats } from '@/lib/actions/admin/getInvestmentsData';
import { Investment } from '@/types/type';


export default async function AdminInvestmentsPage() {
    const [investments, stats] = await Promise.all([
        getAllInvestments(),
        getInvestmentStats()
    ]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatCurrency = (amount: any) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(amount));
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBooleanDisplay = (value: number | null) => {
        if (value === null) return 'N/A';
        return value === 1 ? 'Yes' : 'No';
    };

    return (
        <div className="p-4 md:p-6 max-w-full mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Investments</h1>
    
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <h3 className="text-xs md:text-sm text-gray-700 font-medium">Total Investments</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <h3 className="text-xs md:text-sm text-gray-700 font-medium">Total Amount</h3>
                    <p className="text-lg md:text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow sm:col-span-2 lg:col-span-1">
                    <h3 className="text-xs md:text-sm text-gray-700 font-medium">Total Profit</h3>
                    <p className="text-lg md:text-2xl font-bold text-blue-600">{formatCurrency(stats.totalProfit)}</p>
                </div>
            </div>
    
            {/* Mobile Card View */}
            <div className="block md:hidden">
                <div className="space-y-4">
                    {investments.map((investment: Investment) => (
                        <div key={investment.id} className="bg-white rounded-lg shadow p-4 border">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Investment #{investment.id}</h3>
                                    <p className="text-xs text-gray-500">User ID: {investment.user_id || 'N/A'}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(investment.status)}`}>
                                    {investment.status || 'N/A'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-600 text-xs">Amount</p>
                                    <p className="font-medium text-green-600">{formatCurrency(investment.invest_amount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Profit</p>
                                    <p className="font-medium text-blue-600">{formatCurrency(investment.total_profit_amount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Interest</p>
                                    <p className="font-medium">{investment.interest ? `${investment.interest}%` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Return Type</p>
                                    <p className="font-medium">{investment.return_type || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Periods</p>
                                    <p className="font-medium">{investment.number_of_period || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Period Hours</p>
                                    <p className="font-medium">{investment.period_hours || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Schema ID:</span>
                                        <span>{investment.schema_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <span>{investment.transaction_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Capital Back:</span>
                                        <span>{getBooleanDisplay(investment.capital_back)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Interest Type:</span>
                                        <span>{investment.interest_type || 'N/A'}</span>
                                    </div>
                                    {investment.wallet && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Wallet:</span>
                                            <span className="font-mono bg-gray-100 px-1 rounded text-xs">
                                                {investment.wallet.length > 8 ? `${investment.wallet.substring(0, 8)}...` : investment.wallet}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created:</span>
                                        <span>{formatDate(investment.created_at)}</span>
                                    </div>
                                    {investment.updated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Updated:</span>
                                            <span>{formatDate(investment.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="w-full" style={{ minWidth: '1800px' }}>
                        <thead className="bg-gray-50 sticky top-0 z-20">
                            <tr>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase sticky left-0 bg-gray-50 z-30 border-r border-gray-200">ID</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">User ID</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Schema ID</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Transaction ID</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Invest Amount</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Return Profit</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Total Profit</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Last Profit Time</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Next Profit Time</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Capital Back</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Interest</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Interest Type</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Return Type</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Periods</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Period Hours</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Wallet</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Status</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Created</th>
                                <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase whitespace-nowrap">Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {investments.map((investment: Investment) => (
                                <tr key={investment.id} className="hover:bg-gray-50">
                                    <td className="px-3 lg:px-4 py-4 text-sm font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 whitespace-nowrap">{investment.id}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.user_id || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.schema_id || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.transaction_id || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">{formatCurrency(investment.invest_amount)}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.already_return_profit || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap">{formatCurrency(investment.total_profit_amount)}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.last_profit_time || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.next_profit_time || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{getBooleanDisplay(investment.capital_back)}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-semibold text-orange-600 whitespace-nowrap">
                                        {investment.interest ? `${investment.interest}%` : 'N/A'}
                                    </td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.interest_type || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.return_type || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.number_of_period || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{investment.period_hours || 'N/A'}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        {investment.wallet ? (
                                            <span className="font-mono text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                                {investment.wallet.length > 10 ? `${investment.wallet.substring(0, 10)}...` : investment.wallet}
                                            </span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-3 lg:px-4 py-4 text-sm whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investment.status)}`}>
                                            {investment.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{formatDate(investment.created_at)}</td>
                                    <td className="px-3 lg:px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{formatDate(investment.updated_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                {investments.length === 0 && (
                    <div className="text-center py-8 text-gray-700">
                        No investments found
                    </div>
                )}
            </div>
    
            {/* Mobile Empty State */}
            {investments.length === 0 && (
                <div className="block md:hidden text-center py-8 text-gray-700">
                    No investments found
                </div>
            )}
        </div>
    );
}