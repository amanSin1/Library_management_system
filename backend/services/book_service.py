from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
from models.models import Item
from schemas.book import AddItemRequest, UpdateItemRequest

CATEGORY_PREFIX = {
    "Science": "SC",
    "Economics": "EC",
    "Fiction": "FC",
    "Children": "CH",
    "Personal Development": "PD",
}


def search_items(name: Optional[str], author: Optional[str], db: Session):
    q = db.query(Item)
    if name:
        q = q.filter(Item.name.ilike(f"%{name}%"))
    if author:
        q = q.filter(Item.author_name.ilike(f"%{author}%"))
    items = q.all()
    return [
        {
            "id": i.id,
            "serial_no": i.serial_no,
            "name": i.name,
            "author_name": i.author_name,
            "category": i.category,
            "item_type": i.item_type,
            "status": i.status,
            "available": i.status == "Available",
        }
        for i in items
    ]


def get_all_item_names(db: Session):
    return [r[0] for r in db.query(Item.name).distinct().all()]


def get_items_by_name(name: str, db: Session):
    items = db.query(Item).filter(Item.name == name).all()
    return [
        {
            "id": i.id,
            "serial_no": i.serial_no,
            "author_name": i.author_name,
            "status": i.status,
            "available": i.status == "Available",
        }
        for i in items
    ]


def add_item(data: AddItemRequest, db: Session):
    prefix = CATEGORY_PREFIX.get(data.category, "XX")
    type_suffix = "B" if data.item_type == "Book" else "M"

    existing_count = db.query(Item).filter(
        Item.category == data.category,
        Item.item_type == data.item_type,
    ).count()

    added_serials = []
    for i in range(data.quantity):
        num = existing_count + i + 1
        serial = f"{prefix}({type_suffix}){str(num).zfill(6)}"
        item = Item(
            serial_no=serial,
            name=data.name,
            author_name=data.author_name,
            category=data.category,
            item_type=data.item_type,
            cost=data.cost,
            procurement_date=data.procurement_date,
            status="Available",
        )
        db.add(item)
        added_serials.append(serial)

    db.commit()
    return {"message": f"Added {data.quantity} item(s)", "serial_numbers": added_serials}


def update_item(data: UpdateItemRequest, db: Session):
    item = db.query(Item).filter(Item.serial_no == data.serial_no).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if data.status:
        item.status = data.status
    if data.name:
        item.name = data.name
    if data.item_type:
        item.item_type = data.item_type
    db.commit()
    return {"message": "Item updated successfully"}