from pydantic import BaseModel, Field


class Relation(BaseModel):
    target_id: str
    type: str
    note: str | None = None


class Entity(BaseModel):
    id: str
    name: str
    aliases: list[str] = Field(default_factory=list)
    type: str
    countries: list[str] = Field(default_factory=list)
    programs: list[str] = Field(default_factory=list)
    list_date: str
    remarks: str | None = None
    relations: list[Relation] = Field(default_factory=list)
