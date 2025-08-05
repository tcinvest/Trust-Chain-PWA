import { getAllBots } from '@/lib/actions/admin/bots';
import BotTable from '@/components/admin/BotTable';

export default async function AdminBotsPage() {
  const bots = await getAllBots();

  return (
    <div className="p-6 text-gray-800 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Investment Bots</h1>
      <BotTable bots={bots} />
    </div>
  );
}
