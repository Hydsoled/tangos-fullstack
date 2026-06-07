import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


def test_health(client: TestClient) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_entities_returns_paginated_dataset(client: TestClient) -> None:
    response = client.get("/api/entities", params={"page": 1, "page_size": 10})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 32
    assert len(body["items"]) == 10


def test_search_returns_ranked_results(client: TestClient) -> None:
    response = client.get("/api/search", params={"q": "volkov"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 2
    assert all(result["score"] >= 0.4 for result in body["results"])


def test_search_rejects_empty_query(client: TestClient) -> None:
    response = client.get("/api/search", params={"q": ""})

    assert response.status_code == 422


def test_entity_graph_returns_neighbors(client: TestClient) -> None:
    response = client.get("/api/entities/SDN-10011/graph")

    assert response.status_code == 200
    body = response.json()
    assert body["center_id"] == "SDN-10011"
    assert len(body["nodes"]) >= 2
    assert len(body["edges"]) >= 1


def test_entity_graph_returns_404_for_unknown_id(client: TestClient) -> None:
    response = client.get("/api/entities/UNKNOWN/graph")

    assert response.status_code == 404
    assert response.json()["detail"] == "Entity 'UNKNOWN' not found"
