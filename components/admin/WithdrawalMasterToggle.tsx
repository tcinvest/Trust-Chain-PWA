"use client";

import { useState, useEffect } from "react";
import { Power, PowerOff, Loader2 } from "lucide-react";

export default function WithdrawalMasterToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  // Fetch current status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch("/api/admin/withdrawal-status");
      const data = await res.json();
      
      if (res.ok) {
        setEnabled(data.enabled);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawal status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const toggleWithdrawals = async () => {
    if (loading || enabled === null) return;

    const newStatus = !enabled;
    const confirmMessage = newStatus
      ? "Enable withdrawals for ALL users?"
      : "⚠️ DISABLE withdrawals for ALL users? This will block all withdrawal requests.";

    if (!confirm(confirmMessage)) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/toggle-all-withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setEnabled(newStatus);
        alert(
          `✅ Success! Withdrawals ${newStatus ? "ENABLED" : "DISABLED"} for ${data.updatedCount} users`
        );
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert("❌ Failed to toggle withdrawals");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleWithdrawals}
      disabled={loading || enabled === null}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          enabled
            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
            : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Processing...</span>
        </>
      ) : (
        <>
          {enabled ? (
            <Power className="w-5 h-5" />
          ) : (
            <PowerOff className="w-5 h-5" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-80">Withdrawals</span>
            <span className="text-sm font-bold">
              {enabled ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </>
      )}
    </button>
  );
}