// components/dashboard/ErrorScreen.tsx
export default function ErrorScreen({ message }: { message: string }) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-black dark:text-white">{message}</p>
      </div>
    );
  }
  