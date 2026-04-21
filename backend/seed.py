from database import SessionLocal
from models.models import Base, User, Item, Membership
from core.security import hash_password
from database import engine
from datetime import date, timedelta

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()

    if not db.query(User).filter(User.username == "adm").first():
        db.add(User(name="Administrator", username="adm", password_hash=hash_password("adm"), is_active=True, is_admin=True))
    if not db.query(User).filter(User.username == "user").first():
        db.add(User(name="Library User", username="user", password_hash=hash_password("user"), is_active=True, is_admin=False))

    books = [
        ("SC(B)000001", "A Brief History of Time", "Stephen Hawking", "Science", "Book", 450.0),
        ("SC(B)000002", "The Selfish Gene", "Richard Dawkins", "Science", "Book", 380.0),
        ("EC(B)000001", "The Wealth of Nations", "Adam Smith", "Economics", "Book", 500.0),
        ("EC(B)000002", "Thinking Fast and Slow", "Daniel Kahneman", "Economics", "Book", 420.0),
        ("FC(B)000001", "The Alchemist", "Paulo Coelho", "Fiction", "Book", 200.0),
        ("FC(B)000002", "1984", "George Orwell", "Fiction", "Book", 250.0),
        ("CH(B)000001", "Charlotte's Web", "E.B. White", "Children", "Book", 150.0),
        ("CH(B)000002", "Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Children", "Book", 350.0),
        ("PD(B)000001", "Atomic Habits", "James Clear", "Personal Development", "Book", 400.0),
        ("PD(B)000002", "The 7 Habits", "Stephen Covey", "Personal Development", "Book", 380.0),
        ("SC(M)000001", "The Theory of Everything", "James Marsh", "Science", "Movie", 300.0),
        ("FC(M)000001", "Inception", "Christopher Nolan", "Fiction", "Movie", 250.0),
        ("FC(M)000002", "The Matrix", "Wachowski Sisters", "Fiction", "Movie", 220.0),
    ]
    for serial, name, author, cat, itype, cost in books:
        if not db.query(Item).filter(Item.serial_no == serial).first():
            db.add(Item(serial_no=serial, name=name, author_name=author, category=cat,
                        item_type=itype, cost=cost, procurement_date=date(2020, 1, 1), status="Available"))

    if not db.query(Membership).filter(Membership.membership_number == "MEM000001").first():
        db.add(Membership(
            membership_number="MEM000001",
            first_name="Rahul", last_name="Sharma",
            contact_number="9876543210",
            contact_address="123 MG Road, Delhi",
            aadhar_card_no="1234-5678-9012",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=180),
            is_active=True, duration="6 months", fine_pending=0.0,
        ))

    db.commit()
    db.close()
    print("Seed complete.")


if __name__ == "__main__":
    seed()