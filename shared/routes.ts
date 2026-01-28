import { z } from "zod";
import {
  insertBrandingSchema,
  insertEventSchema,
  insertSermonSchema,
  insertPrayerRequestSchema,
  insertDonationSchema,
  branding,
  events,
  sermons,
  prayerRequests,
  donations,
  type InsertBranding,
  type InsertEvent,
  type InsertSermon,
  type InsertPrayerRequest,
  type InsertDonation,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  branding: {
    get: {
      method: "GET" as const,
      path: "/api/branding",
      responses: {
        200: z.custom<typeof branding.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "POST" as const,
      path: "/api/branding",
      input: insertBrandingSchema,
      responses: {
        200: z.custom<typeof branding.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  events: {
    list: {
      method: "GET" as const,
      path: "/api/events",
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/events/:id",
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/events",
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    rsvp: {
      method: "POST" as const,
      path: "/api/events/:id/rsvp",
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  sermons: {
    list: {
      method: "GET" as const,
      path: "/api/sermons",
      responses: {
        200: z.array(z.custom<typeof sermons.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/sermons/:id",
      responses: {
        200: z.custom<typeof sermons.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/sermons",
      input: insertSermonSchema,
      responses: {
        201: z.custom<typeof sermons.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  prayer: {
    list: {
      method: "GET" as const,
      path: "/api/prayer-requests",
      responses: {
        200: z.array(z.custom<typeof prayerRequests.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/prayer-requests",
      input: insertPrayerRequestSchema,
      responses: {
        201: z.custom<typeof prayerRequests.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    pray: {
      method: "POST" as const,
      path: "/api/prayer-requests/:id/pray",
      responses: {
        200: z.custom<typeof prayerRequests.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  donations: {
    create: {
      method: "POST" as const,
      path: "/api/donations",
      input: insertDonationSchema,
      responses: {
        201: z.custom<typeof donations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Export types for use in hooks
export type {
  InsertBranding,
  InsertEvent,
  InsertSermon,
  InsertPrayerRequest,
  InsertDonation,
};
