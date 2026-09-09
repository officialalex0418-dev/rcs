/**
 * Synchronizes user data across the application by triggering a custom event
 * whenever the profile is updated.
 */
export const syncUserData = (userData) => {
  localStorage.setItem('rcs_user', JSON.stringify(userData));
  // Dispatch a custom event that components can listen to
  window.dispatchEvent(new CustomEvent('rcs_user_update', { detail: userData }));
};

/**
 * Gets the profile picture URL with fallback
 */
export const getProfilePic = (user) => {
  if (!user || !user.profilePicture) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'RCS'}`;
  }

  // If it's already a full URL (R2 or External)
  if (user.profilePicture.startsWith('http')) {
    // FIX: If the URL incorrectly points to the frontend domain, try to fix it or fallback to dicebear
    if (user.profilePicture.includes('rcs.com.np') && (user.profilePicture.includes('/profiles/') || user.profilePicture.includes('/attendance/'))) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'RCS'}`;
    }
    return user.profilePicture;
  }

  // Handle case where database might have saved just the domain name (R2 issue)
  if (user.profilePicture.includes('.com') || user.profilePicture.includes('.np')) {
    return `https://${user.profilePicture}`;
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  // Ensure local paths start with a slash
  const path = user.profilePicture.startsWith('/') ? user.profilePicture : `/${user.profilePicture}`;

  return `${cleanBackendUrl}${path}`;
};
