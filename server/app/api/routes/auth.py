from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.auth import UserCreate, UserLogin, UserResponse, Token, MobileUserCreate, MobileUserLogin, MobileUserResponse, MobileAuthResponse
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# In-memory user storage (replace with database in production)
users_db = {}
user_id_counter = 1

# Initialize admin account
def init_admin_account():
    global users_db, user_id_counter
    admin_email = "server@helmetsivir.com"
    admin_password = "servermaster@131"
    
    # Check if admin already exists
    for existing_user in users_db.values():
        if existing_user["email"] == admin_email:
            return
    
    # Create admin account
    admin_user = {
        "id": user_id_counter,
        "email": admin_email,
        "full_name": "server",
        "password": admin_password,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "is_admin": True
    }
    
    users_db[user_id_counter] = admin_user
    user_id_counter += 1

# Initialize admin on module load
init_admin_account()

# Simple JWT-like token generation (replace with proper JWT in production)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire.timestamp()})
    # In production, use proper JWT encoding
    import base64
    import json
    token_str = json.dumps(to_encode)
    token = base64.b64encode(token_str.encode()).decode()
    return token

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """Register a new user"""
    global user_id_counter
    
    # Check if user already exists
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    new_user = {
        "id": user_id_counter,
        "email": user.email,
        "full_name": user.full_name,
        "password": user.password,  # In production, hash this!
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    users_db[user_id_counter] = new_user
    user_id_counter += 1
    
    return UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        full_name=new_user["full_name"],
        is_active=new_user["is_active"],
        is_admin=new_user.get("is_admin", False)
    )

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Login user and return access token"""
    # Find user by email
    user_data = None
    for u in users_db.values():
        if u["email"] == user.email:
            user_data = u
            break
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password (in production, use proper password hashing)
    if user_data["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user info"""
    # In production, verify JWT token properly
    import base64
    import binascii
    import json

    try:
        decoded = base64.b64decode(token).decode()
        token_data = json.loads(decoded)
        email = token_data.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Find user
        user_data = None
        for u in users_db.values():
            if u["email"] == email:
                user_data = u
                break
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=user_data["id"],
            email=user_data["email"],
            full_name=user_data["full_name"],
            is_active=user_data["is_active"],
            is_admin=user_data.get("is_admin", False)
        )
    except (ValueError, UnicodeDecodeError, binascii.Error, json.JSONDecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@router.get("/members", response_model=list[UserResponse])
async def list_members(current_user: UserResponse = Depends(get_current_user)):
    """List registered members for administrators."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator access required")

    return [
        UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            is_active=user.get("is_active", True),
            is_admin=user.get("is_admin", False),
        )
        for user in users_db.values()
        if not user.get("is_admin", False)
    ]

# Mobile app endpoints
@router.post("/signup", response_model=MobileAuthResponse, status_code=status.HTTP_201_CREATED)
async def mobile_signup(user: MobileUserCreate):
    """Mobile app signup endpoint"""
    global user_id_counter
    
    # Check if user already exists
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user with mobile-specific fields
    new_user = {
        "id": str(user_id_counter),
        "email": user.email,
        "password": user.password,
        "full_name": user.full_name,
        "device_id": user.device_id,
        "device_name": user.device_name,
        "emergency_contact1_name": user.emergency_contact1_name,
        "emergency_contact1_phone": user.emergency_contact1_phone,
        "emergency_contact2_name": user.emergency_contact2_name,
        "emergency_contact2_phone": user.emergency_contact2_phone,
        "birthday": user.birthday,
        "address": user.address,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    users_db[user_id_counter] = new_user
    user_id_counter += 1
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return MobileAuthResponse(
        access_token=access_token,
        refresh_token=None,
        user=MobileUserResponse(
            id=new_user["id"],
            device_id=new_user["device_id"],
            device_name=new_user["device_name"],
            full_name=new_user["full_name"],
            emergency_contact1_name=new_user["emergency_contact1_name"],
            emergency_contact1_phone=new_user["emergency_contact1_phone"],
            emergency_contact2_name=new_user["emergency_contact2_name"],
            emergency_contact2_phone=new_user["emergency_contact2_phone"],
            birthday=new_user["birthday"],
            address=new_user["address"]
        )
    )

@router.post("/signin", response_model=MobileAuthResponse)
async def mobile_signin(user: MobileUserLogin):
    """Mobile app signin endpoint"""
    # Find user by email
    user_data = None
    for u in users_db.values():
        if u["email"] == user.email:
            user_data = u
            break
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if user_data["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Update device info if provided
    if user.device_id:
        user_data["device_id"] = user.device_id
    if user.device_name:
        user_data["device_name"] = user.device_name
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return MobileAuthResponse(
        access_token=access_token,
        refresh_token=None,
        user=MobileUserResponse(
            id=user_data["id"],
            device_id=user_data["device_id"],
            device_name=user_data["device_name"],
            full_name=user_data["full_name"],
            emergency_contact1_name=user_data.get("emergency_contact1_name"),
            emergency_contact1_phone=user_data.get("emergency_contact1_phone"),
            emergency_contact2_name=user_data.get("emergency_contact2_name"),
            emergency_contact2_phone=user_data.get("emergency_contact2_phone"),
            birthday=user_data.get("birthday"),
            address=user_data.get("address")
        )
    )
