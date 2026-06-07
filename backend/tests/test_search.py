from app.models import Entity
from app.search import normalize, score_name, search_entities


def test_normalize_strips_punctuation_and_case() -> None:
    assert normalize("Al-Madar Holdings") == "al madar holdings"


def test_score_name_exact_match() -> None:
    assert score_name("ivan volkov", "Ivan Volkov") == 1.0


def test_score_name_partial_match() -> None:
    score = score_name("volkov", "Igor Petrovich Volkov")
    assert score >= 0.4


def test_score_name_transliteration_variant(sample_entities: list[Entity]) -> None:
    khaled = next(entity for entity in sample_entities if entity.id == "SDN-10014")
    score = score_name("khalid", khaled.name)
    alias_score = score_name("khalid", khaled.aliases[0])
    assert max(score, alias_score) >= 0.4


def test_search_entities_ranks_partial_matches(sample_entities: list[Entity]) -> None:
    results, _, _, total = search_entities("al madar", sample_entities)

    assert total >= 1
    assert results[0].name == "Al-Madar Holdings Ltd"
    assert results[0].score >= 0.4


def test_search_entities_returns_empty_for_no_match(sample_entities: list[Entity]) -> None:
    results, _, _, total = search_entities("zzznomatch", sample_entities)

    assert results == []
    assert total == 0


def test_search_entities_paginates_results(sample_entities: list[Entity]) -> None:
    page_one, current_page, page_size, total = search_entities(
        "volkov", sample_entities, page=1, page_size=1
    )
    page_two, page_two_num, _, _ = search_entities(
        "volkov", sample_entities, page=2, page_size=1
    )

    assert total == 2
    assert current_page == 1
    assert page_size == 1
    assert len(page_one) == 1
    assert len(page_two) == 1
    assert page_two_num == 2
    assert page_one[0].id != page_two[0].id


def test_search_entities_clamps_page_beyond_total(sample_entities: list[Entity]) -> None:
    results, current_page, _, total = search_entities(
        "volkov", sample_entities, page=99, page_size=1
    )

    assert total == 2
    assert current_page == 2
    assert len(results) == 1
