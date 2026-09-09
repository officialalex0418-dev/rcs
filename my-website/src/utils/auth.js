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

  if (user.profilePicture.startsWith('http')) {
    return user.profilePicture;
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'https://rcs-ajbn.onrender.com';
  return `${backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl}${user.profilePicture}`;
};
