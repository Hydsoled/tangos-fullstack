export type EntityRow = {
  id: string;
  name: string;
  type: string;
  country: string;
  programs: string[];
  score?: number;
};

export type PaginatedMeta = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type SearchResponse = PaginatedMeta & {
  query: string;
  results: EntityRow[];
};

export type EntityListResponse = PaginatedMeta & {
  items: EntityRow[];
};

export type GraphNode = {
  id: string;
  name: string;
  type: string;
  is_center: boolean;
};

export type GraphEdge = {
  source_id: string;
  target_id: string;
  type: string;
  note: string | null;
};

export type GraphResponse = {
  center_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type ApiErrorBody = {
  detail?: string;
};
