export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
};

export const setCachedData = (key, data, ttlMinutes = 5) => {
  try {
    const cacheObject = {
      data,
      expiry: Date.now() + ttlMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    console.warn('Cache write error:', error);
  }
};