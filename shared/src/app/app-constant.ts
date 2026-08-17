export const SYSTEM_PERMISSIONS = [
  "domain@create",
  "domain@update",
  "domain@read",
  //
  "user@create",
  "user@update",
  "user@read",
] as const;

export const DOMAIN_PERMISSIONS = [
  "member@create",
  "member@update",
  "member@read",
  //
  "order@create",
  "order@update",
  "order@read",
  //
  "product@create",
  "product@update",
  "product@read",
] as const;
