from pydantic import BaseModel, Field


class Relation(BaseModel):
    target_id: str
    type: str
    note: str | None = None


class Entity(BaseModel):
    id: str
    name: str
    aliases: list[str] = Field(default_factory=list)
    type: str
    countries: list[str] = Field(default_factory=list)
    programs: list[str] = Field(default_factory=list)
    list_date: str
    remarks: str | None = None
    relations: list[Relation] = Field(default_factory=list)


class SearchResultItem(BaseModel):
    id: str
    name: str
    type: str
    country: str
    programs: list[str]
    score: float


class SearchResponse(BaseModel):
    query: str
    page: int
    page_size: int
    total: int
    total_pages: int
    results: list[SearchResultItem]


class EntityListItem(BaseModel):
    id: str
    name: str
    type: str
    country: str
    programs: list[str]


class EntityListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int
    items: list[EntityListItem]


class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    is_center: bool = False


class GraphEdge(BaseModel):
    source_id: str
    target_id: str
    type: str
    note: str | None = None


class GraphResponse(BaseModel):
    center_id: str
    nodes: list[GraphNode]
    edges: list[GraphEdge]
