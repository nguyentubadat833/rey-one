export const ORGANIZATION_STATUSES = [
  "active",
  "inactive",
  "suspended",  // bị khóa tạm (vi phạm, chưa thanh toán phí platform...)
] as const

export const ORGANIZATION_TYPES = [
  "company",             // Công ty TNHH, Cổ phần...
  "business_household",  // Hộ kinh doanh
  "store",               // Cửa hàng đơn lẻ
  "individual",          // Cá nhân kinh doanh (freelancer, KOL...)
  "school",              // Trường học, trung tâm đào tạo
  "branch",              // Chi nhánh
  "other",              
] as const