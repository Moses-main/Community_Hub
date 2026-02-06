// client/src/lib/api.ts
export const verifyEmail = async (token: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email?token=${token}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify email');
  }

  return response.json();
};