'use client';

import { useState } from 'react';
import { updateBot } from '@/lib/actions/admin/bots';
import { Bot } from '@/types/type';

export default function BotTable({ bots }: { bots: Bot[] }) {
  const [botData, setBotData] = useState<Bot[]>(bots);
  const [savingId, setSavingId] = useState<number | null>(null);

  const handleChange = (
    index: number,
    field: keyof Bot,
    value: string | number | boolean
  ) => {
    const newData = [...botData];
    newData[index] = { ...newData[index], [field]: value };
    setBotData(newData);
  };

  const handleSave = async (index: number): Promise<void> => {
    const bot = botData[index];
    setSavingId(bot.id);
    await updateBot(bot.id, {
      name: bot.name,
      description: bot.description,
      investment_range: bot.investment_range,
      capital_back: bot.capital_back,
      return_type: bot.return_type,
      number_of_periods: bot.number_of_periods,
      profit_withdraw: bot.profit_withdraw,
      holiday_note: bot.holiday_note,
      is_active: bot.is_active,
      return_percentage: bot.return_percentage,
      days: bot.days,
      min_invest: bot.min_invest,
      max_invest: bot.max_invest,
    });
    setSavingId(null);
  };

  const fields: { label: string; field: keyof Bot; type?: string }[] = [
    { label: 'Description', field: 'description' },
    { label: 'Investment Range', field: 'investment_range' },
    { label: 'Capital Back', field: 'capital_back' },
    { label: 'Return Type', field: 'return_type' },
    { label: 'Return %', field: 'return_percentage', type: 'number' },
    { label: 'Periods', field: 'number_of_periods' },
    { label: 'Withdraw', field: 'profit_withdraw' },
    { label: 'Holiday Note', field: 'holiday_note' },
    { label: 'Days', field: 'days', type: 'number' },
    { label: 'Min Invest', field: 'min_invest', type: 'number' },
    { label: 'Max Invest', field: 'max_invest', type: 'number' },
  ];

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-xl text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wide">
            <tr>
              {[
                'ID',
                'Name',
                'Description',
                'Range',
                'Capital Back',
                'Return Type',
                'Return %',
                'Periods',
                'Withdraw',
                'Holiday',
                'Active',
                'Days',
                'Min Invest',
                'Max Invest',
                'Actions',
              ].map((header, i) => (
                <th key={i} className="px-4 py-3 text-left border-b border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {botData.map((bot, index) => (
              <tr
                key={bot.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-700">{bot.id}</td>
                <td className="px-4 py-3">
                  <input
                    className="w-full rounded-md bg-transparent px-2 py-1 border border-transparent focus:border-gray-300 focus:bg-white transition-colors"
                    value={bot.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                </td>
                {fields.slice(0, 8).map(({ field, type }) => (
                  <td key={field} className="px-4 py-3">
                    <input
                      type={type || 'text'}
                      className="w-full rounded-md bg-transparent px-2 py-1 border border-transparent focus:border-gray-300 focus:bg-white transition-colors"
                      value={String(bot[field] || '')}
                      onChange={(e) => {
                        const value =
                          type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                        handleChange(index, field, value);
                      }}
                      placeholder={type === 'number' ? '0' : ''}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={bot.is_active || false}
                    onChange={(e) => handleChange(index, 'is_active', e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </td>
                {/* New fields at end */}
                {fields.slice(8).map(({ field, type }) => (
                  <td key={field} className="px-4 py-3">
                    <input
                      type={type || 'text'}
                      className="w-full rounded-md bg-transparent px-2 py-1 border border-transparent focus:border-gray-300 focus:bg-white transition-colors"
                      value={String(bot[field] || '')}
                      onChange={(e) => {
                        const value =
                          type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                        handleChange(index, field, value);
                      }}
                      placeholder={type === 'number' ? '0' : ''}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSave(index)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      savingId === bot.id
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                    disabled={savingId === bot.id}
                  >
                    {savingId === bot.id ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {botData.map((bot, index) => (
          <div
            key={bot.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                #{bot.id} – {bot.name}
              </h3>
              <input
                type="checkbox"
                checked={bot.is_active || false}
                onChange={(e) => handleChange(index, 'is_active', e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
              {fields.map(({ label, field, type }) => (
                <div key={field}>
                  <p className="text-gray-500 text-xs mb-1">{label}</p>
                  <input
                    type={type || 'text'}
                    className="w-full rounded-md bg-gray-50 px-2 py-1 border border-transparent focus:border-gray-300 focus:bg-white transition-colors"
                    value={String(bot[field] || '')}
                    onChange={(e) => {
                      const value =
                        type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                      handleChange(index, field, value);
                    }}
                    placeholder={type === 'number' ? '0' : ''}
                  />
                </div>
              ))}
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => handleSave(index)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  savingId === bot.id
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
                disabled={savingId === bot.id}
              >
                {savingId === bot.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
