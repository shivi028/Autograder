from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database.connection import get_supabase, get_supabase_admin
from typing import Optional, Dict, Any

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """Get current authenticated user using Supabase Auth"""
    
    token = credentials.credentials
    supabase = get_supabase()
    
    try:
        # Verify token with Supabase
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        auth_user = user_response.user
        auth_user_id = auth_user.id
        
        # Get user metadata to determine user type
        user_metadata = auth_user.user_metadata or {}
        user_type = user_metadata.get('user_type', 'student')
        
        # Get full user record from appropriate table
        supabase_admin = get_supabase_admin()
        
        if user_type == "student":
            result = supabase_admin.table("students").select("*").eq(
                "auth_user_id", auth_user_id
            ).execute()
            
            if not result.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Student profile not found"
                )
            
            user_record = result.data[0]
            return {
                "auth_user_id": auth_user_id,
                "user_id": user_record["id"],
                "user_type": "student",
                "email": auth_user.email,
                "full_name": user_record.get("full_name"),
                "student_id": user_record.get("student_id")
            }
        
        else:  # teacher
            result = supabase_admin.table("teachers").select("*").eq(
                "auth_user_id", auth_user_id
            ).execute()
            
            if not result.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Teacher profile not found"
                )
            
            user_record = result.data[0]
            return {
                "auth_user_id": auth_user_id,
                "user_id": user_record["id"],
                "user_type": "teacher",
                "email": auth_user.email,
                "full_name": user_record.get("full_name"),
                "teacher_id": user_record.get("teacher_id")
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

async def get_user_supabase_client(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get Supabase client with user's token for RLS"""
    from app.database.connection import supabase_manager
    
    token = credentials.credentials
    return supabase_manager.get_user_client(token)