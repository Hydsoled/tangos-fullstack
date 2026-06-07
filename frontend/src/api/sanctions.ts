import { apiGet } from "./client";
import type { EntityListResponse, GraphResponse, SearchResponse } from "../types/api";

const DEFAULT_PAGE_SIZE = 10;

export function listEntities(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<EntityListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return apiGet<EntityListResponse>(`/api/entities?${params.toString()}`);
}

export function searchEntities(
  query: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    page_size: String(pageSize),
  });
  return apiGet<SearchResponse>(`/api/search?${params.toString()}`);
}

export function getEntityGraph(entityId: string): Promise<GraphResponse> {
  const encodedId = encodeURIComponent(entityId);
  return apiGet<GraphResponse>(`/api/entities/${encodedId}/graph`);
}
