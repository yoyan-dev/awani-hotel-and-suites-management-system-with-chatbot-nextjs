export interface BanquetPackage {
  id: string;
  name: string;
  categories: string[];
  price_per_cover: number;
  is_active: boolean;
  created_at: string;
}

export interface BanquetPackageFetchParams {
  page: number;
  query?: string;
  category?: string;
  is_active?: boolean;
}

export interface BanquetPackagePagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BanquetMenuState {
  item: BanquetPackage;
  items: BanquetPackage[];
  pagination: BanquetPackagePagination | null;
  isLoading: boolean;
  error?: string;
}
