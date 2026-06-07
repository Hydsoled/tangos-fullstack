import pytest

from app.models import Entity, Relation
from app.store import EntityStore


@pytest.fixture
def sample_entities() -> list[Entity]:
    return [
        Entity(
            id="SDN-10001",
            name="Al-Madar Holdings Ltd",
            aliases=["Al Madar Holdings"],
            type="organization",
            countries=["AE"],
            programs=["SDGT"],
            list_date="2019-04-12",
            relations=[
                Relation(target_id="SDN-10002", type="shared_directors", note=None),
            ],
        ),
        Entity(
            id="SDN-10002",
            name="Al-Mader Trading Company",
            aliases=["Al Mader Co"],
            type="organization",
            countries=["AE"],
            programs=["SDGT"],
            list_date="2020-09-30",
            relations=[],
        ),
        Entity(
            id="SDN-10011",
            name="Ivan Petrovich Volkov",
            aliases=["Ivan Volkov"],
            type="person",
            countries=["RU"],
            programs=["RUSSIA-EO14024"],
            list_date="2022-03-15",
            relations=[
                Relation(target_id="SDN-10012", type="sibling", note="Brother."),
            ],
        ),
        Entity(
            id="SDN-10012",
            name="Igor Petrovich Volkov",
            aliases=["Igor Volkov"],
            type="person",
            countries=["RU"],
            programs=["RUSSIA-EO14024"],
            list_date="2022-03-15",
            relations=[],
        ),
        Entity(
            id="SDN-10014",
            name="Khaled bin Yusuf Al-Rashidi",
            aliases=["Khalid al-Rashidi"],
            type="person",
            countries=["SA"],
            programs=["SDGT"],
            list_date="2014-02-03",
            relations=[],
        ),
    ]


@pytest.fixture
def entity_store(sample_entities: list[Entity]) -> EntityStore:
    store = EntityStore()
    store._entities = {entity.id: entity for entity in sample_entities}
    return store
