from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.graph import build_entity_graph
from app.models import GraphResponse, SearchResponse
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


@app.get("/api/search")
def search(q: str = Query(..., min_length=1)) -> SearchResponse:
    results = search_entities(q, store.entities)
    return SearchResponse(query=q, results=results)


@app.get("/api/entities/{entity_id}/graph")
def entity_graph(entity_id: str) -> GraphResponse:
    graph = build_entity_graph(entity_id, store)
    if graph is None:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found")
    return graph
