export const SYSTEM_PERMISSIONS = [
  // Quyền module, thêm, sửa domains
  "domain@create",
  "domain@update",
  "domain@read",
  //
  "user@create",
  "user@update",
  "user@read"
] as const;

export const DOMAIN_PERMISSIONS = [
  "order@create",
  "order@update",
  "order@read",
  //
  "product@create",
  "product@update",
  "product@read"
] as const