import { useEffect, useState } from 'react';

interface LocationData {
  city: string;
  country: string;
  region?: string;
  ip: string;
}

interface IPLocationResponse {
  city: string;
  country_name: string;
  region: string;
  ip: string;
}

export default function HeaderWithLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const getLocationByIP = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data: IPLocationResponse = await response.json();
      
    
      if (!data.city || !data.country_name) {
        throw new Error('Invalid location data received');
      }

      setLocation({
        city: data.city,
        country: data.country_name,
        region: data.region,
        ip: data.ip
      });

    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Unable to determine location');
    } finally {
      setLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    getLocationByIP();
  }, []);

  // Retry function
  const handleRetry = (): void => {
    getLocationByIP();
  };

  return (
    <div className="px-6 pt-8 pb-6 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-black dark:text-white text-3xl font-bold mb-2">
            Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Manage your account and portfolio
          </p>
          
          {/* Location Display */}
          <div className="flex items-center gap-2 text-sm">
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500">Detecting your location...</span>
              </div>
            )}
            
            {location && !loading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  🌐 {location.city}, {location.country}
                </span>
                {location.region && (
                  <span className="text-gray-500 text-xs">
                    ({location.region})
                  </span>
                )}
              </div>
            )}
            
            {error && !loading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-500 text-xs">{error}</span>
                <button 
                  onClick={handleRetry}
                  className="text-blue-500 underline text-xs hover:text-blue-600"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Manual refresh button */}
        <div className="flex-shrink-0">
          <button 
            onClick={handleRetry}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : '🌐 Refresh Location'}
          </button>
        </div>
      </div>
    </div>
  );
}