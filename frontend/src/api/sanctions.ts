import { apiGet } from "./client";
import type { GraphResponse, SearchResponse } from "../types/api";

export function searchEntities(query: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  return apiGet<SearchResponse>(`/api/search?${params.toString()}`);
}

export function getEntityGraph(entityId: string): Promise<GraphResponse> {
  const encodedId = encodeURIComponent(entityId);
  return apiGet<GraphResponse>(`/api/entities/${encodedId}/graph`);
}
