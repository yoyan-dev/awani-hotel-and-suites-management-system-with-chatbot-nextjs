export interface BanquetMenu {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  created_at?: any;
}

export interface BanquetPackage {
  id: string;
  name: string;
  categories: string[];
  price_per_cover: number;
  is_active: boolean;
}

export interface BanquetMenuPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
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
