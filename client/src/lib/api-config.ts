// API configuration for different environments
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

// Helper function to build API URLs
export function buildApiUrl(path: string): string {
  // If path already starts with http, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If no base URL is set (same domain deployment), return path as is
  if (!API_BASE_URL) {
    return path;
  }
  
  // Combine base URL with path
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${apiPath}`;
}