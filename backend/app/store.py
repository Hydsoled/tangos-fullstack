import json
from pathlib import Path

from app.models import Entity

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "sdn_sample.json"


class EntityStore:
    def __init__(self) -> None:
        self._entities: dict[str, Entity] = {}

    def load(self) -> None:
        with DATA_PATH.open(encoding="utf-8") as f:
            raw = json.load(f)
        self._entities = {item["id"]: Entity.model_validate(item) for item in raw}

    @property
    def entities(self) -> list[Entity]:
        return list(self._entities.values())

    def get(self, entity_id: str) -> Entity | None:
        return self._entities.get(entity_id)


store = EntityStore()
