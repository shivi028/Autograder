import asyncio
from app.database.connection import get_supabase, get_supabase_admin
import secrets

async def migrate_students():
    """Migrate existing students to Supabase Auth"""
    supabase = get_supabase()
    supabase_admin = get_supabase_admin()
    
    # Get all students without auth_user_id
    students = supabase_admin.table("students").select("*").is_("auth_user_id", "null").execute()
    
    print(f"Found {len(students.data)} students to migrate")
    
    for student in students.data:
        try:
            # Generate temporary password (user should reset)
            temp_password = secrets.token_urlsafe(16)
            
            # Create Supabase auth user
            auth_response = supabase.auth.admin.create_user({
                "email": student["email"],
                "password": temp_password,
                "email_confirm": True,  # Auto-confirm
                "user_metadata": {
                    "user_type": "student",
                    "full_name": student["full_name"]
                }
            })
            
            if auth_response.user:
                # Update student record with auth_user_id
                supabase_admin.table("students").update({
                    "auth_user_id": auth_response.user.id
                }).eq("id", student["id"]).execute()
                
                print(f"✓ Migrated student: {student['email']}")
                # TODO: Send email to user with temp password
            
        except Exception as e:
            print(f"✗ Failed to migrate {student['email']}: {str(e)}")

async def migrate_teachers():
    """Migrate existing teachers to Supabase Auth"""
    supabase = get_supabase()
    supabase_admin = get_supabase_admin()
    
    teachers = supabase_admin.table("teachers").select("*").is_("auth_user_id", "null").execute()
    
    print(f"Found {len(teachers.data)} teachers to migrate")
    
    for teacher in teachers.data:
        try:
            temp_password = secrets.token_urlsafe(16)
            
            auth_response = supabase.auth.admin.create_user({
                "email": teacher["email"],
                "password": temp_password,
                "email_confirm": True,
                "user_metadata": {
                    "user_type": "teacher",
                    "full_name": teacher["full_name"]
                }
            })
            
            if auth_response.user:
                supabase_admin.table("teachers").update({
                    "auth_user_id": auth_response.user.id
                }).eq("id", teacher["id"]).execute()
                
                print(f"✓ Migrated teacher: {teacher['email']}")
            
        except Exception as e:
            print(f"✗ Failed to migrate {teacher['email']}: {str(e)}")

async def main():
    print("Starting migration to Supabase Auth...\n")
    await migrate_students()
    print("\n")
    await migrate_teachers()
    print("\nMigration complete!")

if __name__ == "__main__":
    asyncio.run(main())