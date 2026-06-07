import re
from difflib import SequenceMatcher

from app.models import Entity, SearchResultItem

MIN_SCORE = 0.4
MAX_RESULTS = 20


def normalize(text: str) -> str:
    lowered = text.lower()
    cleaned = re.sub(r"[^\w\s]", " ", lowered)
    return " ".join(cleaned.split())


def _token_overlap_score(query: str, candidate: str) -> float:
    query_tokens = query.split()
    if not query_tokens:
        return 0.0

    candidate_tokens = candidate.split()
    matched = 0
    for token in query_tokens:
        if token in candidate:
            matched += 1
        elif any(token in word for word in candidate_tokens):
            matched += 1

    return (matched / len(query_tokens)) * 0.85


def score_name(query: str, candidate: str) -> float:
    normalized_query = normalize(query)
    normalized_candidate = normalize(candidate)

    if not normalized_query or not normalized_candidate:
        return 0.0

    if normalized_query == normalized_candidate:
        return 1.0

    if normalized_candidate.startswith(normalized_query):
        coverage = len(normalized_query) / len(normalized_candidate)
        return 0.9 + coverage * 0.09

    if normalized_query in normalized_candidate:
        coverage = len(normalized_query) / len(normalized_candidate)
        return 0.75 + coverage * 0.14

    token_score = _token_overlap_score(normalized_query, normalized_candidate)
    fuzzy_score = SequenceMatcher(
        None, normalized_query, normalized_candidate
    ).ratio() * 0.8

    return max(token_score, fuzzy_score)


def score_entity(query: str, entity: Entity) -> float:
    names = [entity.name, *entity.aliases]
    return max(score_name(query, name) for name in names)


def search_entities(query: str, entities: list[Entity]) -> list[SearchResultItem]:
    trimmed = query.strip()
    if not trimmed:
        return []

    scored: list[tuple[float, Entity]] = []
    for entity in entities:
        score = score_entity(trimmed, entity)
        if score >= MIN_SCORE:
            scored.append((score, entity))

    scored.sort(key=lambda item: (-item[0], item[1].name))

    return [
        SearchResultItem(
            id=entity.id,
            name=entity.name,
            type=entity.type,
            country=entity.countries[0] if entity.countries else "",
            programs=entity.programs,
            score=round(score, 3),
        )
        for score, entity in scored[:MAX_RESULTS]
    ]
