export const APP_DOMAIN_PERMISSIONS = [
  
]

export const APP_PERMISSIONS = [
  // Commerce
  // "commerce:order:view",
  // "commerce:order:create",
  // "commerce:order:cancel",

  // "commerce:payment:view",
  // "commerce:payment:cash", // thanh toán tiền mặt
  // "commerce:payment:online", // thanh toán online
  // "commerce:payment:notification", // nhận thông báo thanh toán thành công

  // "commerce:promotion:view",
  // "commerce:promotion:create",

  // "academy:course:view",
  // "academy:course:manage",
  // "academy:enrollment:view",

  "domain:role:read",
  "domain:role:manage",
  "domain:member:read",
  "domain:member:manage",
  "domain:manage:read",
  "domain:manage",
] as const;