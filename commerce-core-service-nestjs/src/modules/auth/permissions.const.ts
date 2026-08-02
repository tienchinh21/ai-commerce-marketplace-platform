export const PERMISSIONS = [
  'product:read',
  'product:write',
  'review:read',
  'review:moderate',
  'seller:read',
  'seller:write',
  'buyer:read',
  'buyer:write',
  'category:read',
  'category:write',
  'source:read',
  'source:write',
  'source:sync',
  'ai:search',
  'ai:review:analyze',
  'ai:analyst:chat',
] as const;

export type PermissionCode = (typeof PERMISSIONS)[number];
