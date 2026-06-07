from app.models import Entity, GraphEdge, GraphNode, GraphResponse
from app.store import EntityStore


def build_entity_graph(entity_id: str, entity_store: EntityStore) -> GraphResponse | None:
    center = entity_store.get(entity_id)
    if center is None:
        return None

    nodes: list[GraphNode] = [
        GraphNode(
            id=center.id,
            name=center.name,
            type=center.type,
            is_center=True,
        )
    ]
    edges: list[GraphEdge] = []

    for relation in center.relations:
        neighbor = entity_store.get(relation.target_id)
        if neighbor is None:
            continue

        nodes.append(
            GraphNode(
                id=neighbor.id,
                name=neighbor.name,
                type=neighbor.type,
            )
        )
        edges.append(
            GraphEdge(
                source_id=center.id,
                target_id=neighbor.id,
                type=relation.type,
                note=relation.note,
            )
        )

    return GraphResponse(center_id=center.id, nodes=nodes, edges=edges)
