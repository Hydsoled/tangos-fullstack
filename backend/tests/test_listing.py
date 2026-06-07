from app.listing import list_entities


def test_list_entities_sorts_alphabetically(sample_entities) -> None:
    response = list_entities(sample_entities, page=1, page_size=10)

    names = [item.name for item in response.items]
    assert names == sorted(names, key=str.lower)


def test_list_entities_paginates(sample_entities) -> None:
    response = list_entities(sample_entities, page=1, page_size=2)

    assert response.total == 5
    assert response.total_pages == 3
    assert response.page == 1
    assert len(response.items) == 2


def test_list_entities_clamps_high_page_number(sample_entities) -> None:
    response = list_entities(sample_entities, page=99, page_size=2)

    assert response.page == 3
    assert len(response.items) == 1
