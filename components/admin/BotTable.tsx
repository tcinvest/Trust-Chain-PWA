'use client';

import { useState } from 'react';
import { updateBot } from '@/lib/actions/admin/bots';

type Bot = {
  id: number;
  name: string;
  description: string | null;
  investment_range: string | null;
  capital_back: string | null;
  return_type: string | null;
  number_of_periods: string | null;
  profit_withdraw: string | null;
  holiday_note: string | null;
  is_active: boolean | null;
  return_percentage: number | null;
};

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
    });
    setSavingId(null);
  };

  const fields: { label: string; field: keyof Bot }[] = [
    { label: 'Description', field: 'description' },
    { label: 'Investment Range', field: 'investment_range' },
    { label: 'Capital Back', field: 'capital_back' },
    { label: 'Return Type', field: 'return_type' },
    { label: 'Periods', field: 'number_of_periods' },
    { label: 'Withdraw', field: 'profit_withdraw' },
    { label: 'Holiday Note', field: 'holiday_note' },
  ];

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border bg-white shadow text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                'ID',
                'Name',
                'Description',
                'Range',
                'Capital Back',
                'Return Type',
                'Periods',
                'Withdraw',
                'Holiday',
                'Active',
                'Actions',
              ].map((header, i) => (
                <th key={i} className="px-3 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {botData.map((bot, index) => (
              <tr key={bot.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{bot.id}</td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.name}
                    onChange={(e) =>
                      handleChange(index, 'name', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.description || ''}
                    onChange={(e) =>
                      handleChange(index, 'description', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.investment_range || ''}
                    onChange={(e) =>
                      handleChange(index, 'investment_range', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.capital_back || ''}
                    onChange={(e) =>
                      handleChange(index, 'capital_back', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.return_type || ''}
                    onChange={(e) =>
                      handleChange(index, 'return_type', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.number_of_periods || ''}
                    onChange={(e) =>
                      handleChange(
                        index,
                        'number_of_periods',
                        e.target.value
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.profit_withdraw || ''}
                    onChange={(e) =>
                      handleChange(index, 'profit_withdraw', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={bot.holiday_note || ''}
                    onChange={(e) =>
                      handleChange(index, 'holiday_note', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={bot.is_active || false}
                    onChange={(e) =>
                      handleChange(index, 'is_active', e.target.checked)
                    }
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleSave(index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                    disabled={savingId === bot.id}
                  >
                    {savingId === bot.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {botData.map((bot, index) => (
          <div
            key={bot.id}
            className="bg-white rounded-xl shadow p-4 border space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                #{bot.id} - {bot.name}
              </h3>
              <input
                type="checkbox"
                checked={bot.is_active || false}
                onChange={(e) =>
                  handleChange(index, 'is_active', e.target.checked)
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
              {fields.map(({ label, field }) => (
                <div key={field}>
                  <p className="text-gray-500">{label}</p>
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={String(bot[field] || '')}
                    onChange={(e) =>
                      handleChange(index, field, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => handleSave(index)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded"
                disabled={savingId === bot.id}
              >
                {savingId === bot.id ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}