export type MenuItem = {
  label: string;
  icon: string;
  hidden?: boolean;
  to?: string;
  children?: MenuItem[];
};
