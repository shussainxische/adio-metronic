export interface NavItem {
  id: number;
  label: string;
  icon: string;
  parentId: number | null;
  pageId?: number | null;
  pageCode?: string;
  children?: NavItem[];
  applications: [{id: string, name: string}]
}

export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
  navigationMenu: NavItem;
  permissions: string[];
  roles: string[];
  userId: string;
  applications: [{name: string; id: string; description: string;}]
}
