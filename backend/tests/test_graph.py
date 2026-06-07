from app.graph import build_entity_graph


def test_build_entity_graph_returns_none_for_unknown_id(entity_store) -> None:
    assert build_entity_graph("UNKNOWN", entity_store) is None


def test_build_entity_graph_centers_selected_entity(entity_store) -> None:
    graph = build_entity_graph("SDN-10011", entity_store)

    assert graph is not None
    assert graph.center_id == "SDN-10011"
    center = next(node for node in graph.nodes if node.is_center)
    assert center.name == "Ivan Petrovich Volkov"


def test_build_entity_graph_includes_labeled_edges(entity_store) -> None:
    graph = build_entity_graph("SDN-10011", entity_store)

    assert graph is not None
    assert len(graph.edges) == 1
    assert graph.edges[0].type == "sibling"
    assert graph.edges[0].source_id == "SDN-10011"
    assert graph.edges[0].target_id == "SDN-10012"


def test_build_entity_graph_entity_without_relations(entity_store) -> None:
    graph = build_entity_graph("SDN-10002", entity_store)

    assert graph is not None
    assert len(graph.nodes) == 1
    assert graph.edges == []
