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
  // "organization:role:read",
  // "organization:role:manage", // add/update role
  "organization:member:read",
  "organization:member:manage", // add/update member
  "organization:manage:read",
  "organization:manage", // add/update organization, member, role
] as const;