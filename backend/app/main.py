from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.graph import build_entity_graph
from app.listing import list_entities
from app.models import EntityListResponse, GraphResponse, SearchResponse
from app.search import search_entities
from app.store import store


@asynccontextmanager
async def lifespan(_: FastAPI):
    store.load()
    yield


app = FastAPI(title="Sanctions Entity Explorer", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/entities")
def entities(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
) -> EntityListResponse:
    return list_entities(store.entities, page=page, page_size=page_size)


@app.get("/api/search")
def search(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
) -> SearchResponse:
    results, current_page, size, total = search_entities(
        q, store.entities, page=page, page_size=page_size
    )
    total_pages = max(1, (total + size - 1) // size) if total else 1
    return SearchResponse(
        query=q,
        page=current_page,
        page_size=size,
        total=total,
        total_pages=total_pages,
        results=results,
    )


@app.get("/api/entities/{entity_id}/graph")
def entity_graph(entity_id: str) -> GraphResponse:
    graph = build_entity_graph(entity_id, store)
    if graph is None:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found")
    return graph
