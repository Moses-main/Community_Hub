// Client-side API routes configuration
export const apiRoutes = {
  auth: {
    user: "/api/auth/user",
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    verifyEmail: "/api/auth/verify-email",
  },
  members: {
    me: "/api/members/me",
    search: "/api/members/search",
    updateHouseCell: (id: string) => `/api/members/${id}/house-cell`,
  },
  admin: {
    users: "/api/admin/users",
    getUser: (id: number) => `/api/admin/users/${id}`,
  },
  events: {
    list: "/api/events",
    get: (id: number) => `/api/events/${id}`,
    create: "/api/events",
    rsvp: (id: number) => `/api/events/${id}/rsvp`,
    rsvps: "/api/events/rsvps",
    addToCalendar: (id: number) => `/api/events/${id}/calendar`,
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