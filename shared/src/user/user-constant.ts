export const USER_STATUSES = [
  "pending", // chưa từng kích hoạt
  "inactive", // đã từng kích hoạt nhưng vì lý do gì đó phải inactive
  "active", // đang kích hoạt
  "banned", // chặn vĩnh viễn
  // "deleted",
] as const;

export const USER_ADMIN_TYPE = "admin_user" as const;
export const USER_NORMAL_TYPE = "user" as const;
export const USER_DOMAIN_TYPE = "domain_user" as const;
export const USER_TYPES = [
  USER_ADMIN_TYPE,
  USER_NORMAL_TYPE,
  USER_DOMAIN_TYPE,
] as const;
