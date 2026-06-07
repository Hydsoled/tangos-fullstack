export type SearchResultItem = {
  id: string;
  name: string;
  type: string;
  country: string;
  programs: string[];
  score: number;
};

export type SearchResponse = {
  query: string;
  results: SearchResultItem[];
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
