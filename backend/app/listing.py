import math

from app.models import Entity, EntityListItem, EntityListResponse

DEFAULT_PAGE_SIZE = 10


def _clamp_page(page: int, total_pages: int) -> int:
    if total_pages == 0:
        return 1
    return min(max(1, page), total_pages)


def list_entities(
    entities: list[Entity],
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> EntityListResponse:
    sorted_entities = sorted(entities, key=lambda entity: entity.name.lower())
    total = len(sorted_entities)
    total_pages = max(1, math.ceil(total / page_size)) if total else 1
    current_page = _clamp_page(page, total_pages)
    start = (current_page - 1) * page_size
    page_entities = sorted_entities[start : start + page_size]

    return EntityListResponse(
        page=current_page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
        items=[
            EntityListItem(
                id=entity.id,
                name=entity.name,
                type=entity.type,
                country=entity.countries[0] if entity.countries else "",
                programs=entity.programs,
            )
            for entity in page_entities
        ],
    )
