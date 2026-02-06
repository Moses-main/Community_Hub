// Client-side API routes configuration
export const apiRoutes = {
  auth: {
    user: "/api/auth/user",
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
  },
  events: {
    list: "/api/events",
    get: (id: number) => `/api/events/${id}`,
    create: "/api/events",
    rsvp: (id: number) => `/api/events/${id}/rsvp`,
  },
  sermons: {
    list: "/api/sermons",
    get: (id: number) => `/api/sermons/${id}`,
    create: "/api/sermons",
  },
  prayer: {
    list: "/api/prayer-requests",
    create: "/api/prayer-requests",
    pray: (id: number) => `/api/prayer-requests/${id}/pray`,
  },
  donations: {
    create: "/api/donations",
  },
  uploads: {
    requestUrl: "/api/uploads/request-url",
  },
} as const;