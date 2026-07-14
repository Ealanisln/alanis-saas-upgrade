/**
 * Contact-form field limits, shared by the client inputs (maxLength) and the
 * server action's validation so the two can't drift apart. Lives outside the
 * "use server" module because action files may only export async functions.
 */
export const CONTACT_LIMITS = {
  name: 100,
  email: 200,
  message: 1200,
} as const;
