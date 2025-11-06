from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from app.database.connection import  get_supabase, get_supabase_admin
from app.core.supabase_auth import get_current_user
from typing import Optional
from gotrue.errors import AuthApiError

student_id: Optional[str] = None


router = APIRouter()

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    # user_type: str  # "student" or "teacher"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str
    student_id: Optional[str] = None  # Required for students
    teacher_id: Optional[str] = None  # Required for teachers
    phone: Optional[str] = None
    course: Optional[str] = None  # For students
    department: Optional[str] = None  # For teachers

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict

@router.post("/register", response_model=Token)
async def register_user(user_data: UserRegister):
    """Register new user with Supabase Auth"""
    
    supabase = get_supabase()
    supabase_admin = get_supabase_admin()
    
    try:
        # Validate user_type specific fields
        if user_data.user_type == "student" and not user_data.student_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student ID is required for students"
            )
        
        if user_data.user_type == "teacher" and not user_data.teacher_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Teacher ID is required for teachers"
            )
        
        # Create auth user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "user_type": user_data.user_type,
                    "full_name": user_data.full_name
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
        
        auth_user_id = auth_response.user.id
        
        # Create profile record in appropriate table
        if user_data.user_type == "student":
            profile_data = {
                "auth_user_id": auth_user_id,
                "student_id": user_data.student_id,
                "full_name": user_data.full_name,
                "email": user_data.email,
                "phone": user_data.phone,
                "course": user_data.course,
                "status": "active"
            }
            
            result = supabase_admin.table("students").insert(profile_data).execute()
        
        else:  # teacher
            profile_data = {
                "auth_user_id": auth_user_id,
                "teacher_id": user_data.teacher_id,
                "full_name": user_data.full_name,
                "email": user_data.email,
                "phone": user_data.phone,
                "department": user_data.department,
                "status": "active"
            }
            
            result = supabase_admin.table("teachers").insert(profile_data).execute()
        
        created_profile = result.data[0]
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": created_profile["id"],
                "auth_user_id": auth_user_id,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "role": user_data.user_type
            }
        }
    
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {e.message}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login_user(credentials: UserLogin):
    """Login user with Supabase Auth"""
    
    supabase = get_supabase()
    supabase_admin = get_supabase_admin()
    
    try:
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        auth_user_id = auth_response.user.id
        user_metadata = auth_response.user.user_metadata or {}
        user_type = user_metadata.get('user_type', 'student')
        
        # Get profile from appropriate table
        if user_type == "student":
            result = supabase_admin.table("students").select("*").eq(
                "auth_user_id", auth_user_id
            ).execute()
        else:
            result = supabase_admin.table("teachers").select("*").eq(
                "auth_user_id", auth_user_id
            ).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        user_profile = result.data[0]
        
        # Check if user is active
        if user_profile.get("status") != "active":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_profile["id"],
                "auth_user_id": auth_user_id,
                "email": auth_response.user.email,
                "full_name": user_profile["full_name"],
                "role": user_type
            }
        }
    
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {e.message}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout")
async def logout_user(current_user: dict = Depends(get_current_user)):
    """Logout user"""
    supabase = get_supabase()
    
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    supabase = get_supabase()
    
    try:
        auth_response = supabase.auth.refresh_session(refresh_token)
        
        if not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "token_type": "bearer"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token refresh failed: {str(e)}"
        )