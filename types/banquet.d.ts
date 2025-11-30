export interface BanquetMenu {
  id?: string;
  name?: string;
  category?: string;
  created_at?: any;
}
export interface BanquetPackage {
  id?: string;
  name?: string;
  package?: string[];
  price?: number;
  created_at?: any;
}

export interface BanquetMenuPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface BanquetMenuFetchParams {
  page?: number;
  query?: string;
}

export interface BanquetMenuState {
  menus: BanquetMenu[];
  menu: BanquetMenu;
  pagination: BanquetMenuPagination | null;
  isLoading: boolean;
  error?: string;
}
export interface BanquetPackageState {
  banquet_packages: BanquetPackage[];
  banquet_package: BanquetPackage;
  isLoading: boolean;
  error?: string;
}
