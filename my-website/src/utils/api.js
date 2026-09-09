const getBackendUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

export const API_BASE_URL = getBackendUrl();

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('rcs_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Auto-logout on 401 Unauthorized (except for login page)
    if (response.status === 401 && !url.includes('/api/auth/login')) {
      // Optional: handle auto logout
    }

    return response;
  } catch (error) {
    console.error(`API Fetch Error (${url}):`, error);
    throw error;
  }
};
