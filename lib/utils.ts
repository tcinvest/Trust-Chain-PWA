
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  export const getKycStatus = (kyc: number | null) => {
    switch (kyc) {
      case 1:
      return { text: 'Pending', color: 'text-yellow-500' };
      case 2:
        return { text: 'Verified', color: 'text-green-500' };
      case 3:
        return { text: 'Rejected', color: 'text-red-500' };
      case 0:
        return { text: 'Not Started', color: 'text-gray-400' };
      default:
        return { text: 'Not Started', color: 'text-gray-400' };
    }
  };

  export const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  export const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  };
