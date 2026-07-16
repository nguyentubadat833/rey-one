const ORGANIZATION = "organization";
const COMMERCE = "commerce";
const ACADEMY = "academy";

export const APP_PERMISSION_GROUPS = [ACADEMY, COMMERCE, ORGANIZATION] as const;

export const APP_PERMISSIONS = [
  // Commerce
  "commerce:order:view",
  "commerce:order:create",
  "commerce:order:cancel",

  "commerce:payment:view",
  "commerce:payment:cash", // thanh toán tiền mặt
  "commerce:payment:online", // thanh toán online
  "commerce:payment:notification", // nhận thông báo thanh toán thành công

  "commerce:promotion:view",
  "commerce:promotion:create",

  // Academy
  "academy:course:view",
  "academy:course:manage",
  "academy:enrollment:view",

  // "org:member:invite",
  "organization:role:read",
  "organization:role:manage", // add/update role
  "organization:member:read",
  "organization:member:manage", // add/update member
  "organization:module:read",
  "organization:module:manage", // add/update organization, member, role
] as const;

// export const ACADEMY_PERMISSION = {
//   ACADEMY_COURSE_VIEW: "academy:course:view",
//   ACADEMY_COURSE_MANAGE: "academy:course:manage",
//   ACADEMY_ENROLLMENT_VIEW: "academy:enrollment:view",
// } satisfies Record<string, (typeof APP_PERMISSIONS)[number]>;

// export const COMMERCE_PERMISSION = {
//   COMMERCE_ORDER_VIEW: "commerce:order:view",
//   COMMERCE_ORDER_CREATE: "commerce:order:create",
//   COMMERCE_ORDER_CANCEL: "commerce:order:cancel",

//   COMMERCE_PAYMENT_VIEW: "commerce:payment:view",
//   COMMERCE_PAYMENT_CASH: "commerce:payment:cash",
//   COMMERCE_PAYMENT_ONLINE: "commerce:payment:online",
//   COMMERCE_PAYMENT_NOTIFICATION: "commerce:payment:notification",

//   COMMERCE_PROMOTION_VIEW: "commerce:promotion:view",
//   COMMERCE_PROMOTION_CREATE: "commerce:promotion:create",
// } satisfies Record<string, (typeof APP_PERMISSIONS)[number]>;

// export const ORGANIZATION_PERMISSION = {
//   ORGANIZATION_MEMBER_MANAGE: "organization:member:manage",
//   ORGANIZATION_MODULE_MANAGE: "organization:module:manage",
// } satisfies Record<string, (typeof APP_PERMISSIONS)[number]>;

// export const PERMISSION = {
//   ...ACADEMY_PERMISSION,
//   ...COMMERCE_PERMISSION,
//   ...ORGANIZATION_PERMISSION,
// } satisfies Record<string, (typeof APP_PERMISSIONS)[number]>;