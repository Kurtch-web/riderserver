from datetime import datetime
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    birthday: Optional[str] = None
    address: Optional[str] = None
    emergency_contact1_name: Optional[str] = None
    emergency_contact1_phone: Optional[str] = None
    emergency_contact2_name: Optional[str] = None
    emergency_contact2_phone: Optional[str] = None


class MobileUserUpsert(ProfileUpdate):
    device_id: str = Field(alias="deviceId")
    device_name: Optional[str] = Field(default="RIDE X", alias="deviceName")

    model_config = ConfigDict(populate_by_name=True)


class PairingGenerateRequest(BaseModel):
    user_id: str = Field(alias="userId")
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    device_name: Optional[str] = Field(default=None, alias="deviceName")

    model_config = ConfigDict(populate_by_name=True)


class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None


class CodeUsageCreate(BaseModel):
    user_id: str = Field(alias="userId")
    device_id: str = Field(alias="deviceId")

    model_config = ConfigDict(populate_by_name=True)


class FcmTokenCreate(BaseModel):
    device_id: str = Field(alias="deviceId")
    fcm_token: str = Field(alias="fcmToken")

    model_config = ConfigDict(populate_by_name=True)


class CrashNotificationCreate(BaseModel):
    to_user_id: str = Field(alias="toUserId")
    device_id: Optional[str] = Field(default=None, alias="deviceId")
    device_name: str = Field(alias="deviceName")
    message: str
    crash_time: datetime = Field(alias="crashTime")
    g_force: float = Field(default=0, alias="gForce")
    accel_x: float = Field(default=0, alias="accelX")
    accel_y: float = Field(default=0, alias="accelY")
    accel_z: float = Field(default=0, alias="accelZ")
    gyro_x: float = Field(default=0, alias="gyroX")
    gyro_y: float = Field(default=0, alias="gyroY")
    gyro_z: float = Field(default=0, alias="gyroZ")
    temperature: Optional[float] = None
    gps_latitude: Optional[float] = Field(default=None, alias="gpsLatitude")
    gps_longitude: Optional[float] = Field(default=None, alias="gpsLongitude")
    gps_altitude: Optional[float] = Field(default=None, alias="gpsAltitude")

    model_config = ConfigDict(populate_by_name=True)


class CodeResponse(BaseModel):
    code: str


class LocationResponse(BaseModel):
    code: str
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    device_name: Optional[str] = Field(default=None, serialization_alias="deviceName")
    created_at: datetime = Field(serialization_alias="createdAt")


class CodeUsageUser(BaseModel):
    device: str
    used_at: datetime = Field(serialization_alias="usedAt")


class PastedCode(BaseModel):
    code: str
    owner_device: str = Field(serialization_alias="ownerDevice")
    used_at: datetime = Field(serialization_alias="usedAt")
