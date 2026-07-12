from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccelerometerData(BaseModel):
    x: float
    y: float
    z: float

class GyroscopeData(BaseModel):
    x: float
    y: float
    z: float

class GPSData(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    satellites: Optional[int] = None
    has_fix: bool = False

class SensorReading(BaseModel):
    timestamp: datetime
    accelerometer: AccelerometerData
    gyroscope: GyroscopeData
    gps: GPSData

class SensorDataResponse(BaseModel):
    status: str
    data: Optional[SensorReading] = None
    message: Optional[str] = None
