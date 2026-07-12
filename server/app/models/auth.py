from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool = True
    is_admin: bool = False
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# Mobile app specific models
class MobileUserCreate(BaseModel):
    email: EmailStr
    password: str
    device_id: str
    device_name: Optional[str] = "RIDE X"
    full_name: Optional[str] = None
    emergency_contact1_name: Optional[str] = None
    emergency_contact1_phone: Optional[str] = None
    emergency_contact2_name: Optional[str] = None
    emergency_contact2_phone: Optional[str] = None
    birthday: Optional[str] = None
    address: Optional[str] = None

class MobileUserLogin(BaseModel):
    email: EmailStr
    password: str
    device_id: str
    device_name: Optional[str] = "RIDE X"

class MobileUserResponse(BaseModel):
    id: str
    device_id: str
    device_name: Optional[str] = None
    full_name: Optional[str] = None
    emergency_contact1_name: Optional[str] = None
    emergency_contact1_phone: Optional[str] = None
    emergency_contact2_name: Optional[str] = None
    emergency_contact2_phone: Optional[str] = None
    birthday: Optional[str] = None
    address: Optional[str] = None

class MobileAuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    user: MobileUserResponse
