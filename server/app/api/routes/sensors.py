from fastapi import APIRouter, HTTPException
from typing import List
from app.models.sensor import SensorReading, SensorDataResponse, AccelerometerData, GyroscopeData, GPSData
from datetime import datetime

router = APIRouter()

# In-memory storage for demo (replace with database in production)
sensor_readings: List[SensorReading] = []

@router.get("/", response_model=SensorDataResponse)
async def get_all_sensor_data():
    """Get all sensor readings"""
    if not sensor_readings:
        return SensorDataResponse(
            status="no_data",
            message="No sensor data available yet"
        )
    return SensorDataResponse(
        status="success",
        data=sensor_readings[-1] if sensor_readings else None
    )

@router.get("/accelerometer", response_model=SensorDataResponse)
async def get_accelerometer_data():
    """Get latest accelerometer data"""
    if not sensor_readings:
        return SensorDataResponse(
            status="no_data",
            message="No accelerometer data available"
        )
    return SensorDataResponse(
        status="success",
        data=sensor_readings[-1]
    )

@router.get("/gyroscope", response_model=SensorDataResponse)
async def get_gyroscope_data():
    """Get latest gyroscope data"""
    if not sensor_readings:
        return SensorDataResponse(
            status="no_data",
            message="No gyroscope data available"
        )
    return SensorDataResponse(
        status="success",
        data=sensor_readings[-1]
    )

@router.get("/gps", response_model=SensorDataResponse)
async def get_gps_data():
    """Get latest GPS data"""
    if not sensor_readings:
        return SensorDataResponse(
            status="no_data",
            message="No GPS data available"
        )
    return SensorDataResponse(
        status="success",
        data=sensor_readings[-1]
    )

@router.post("/", response_model=SensorDataResponse)
async def post_sensor_data(reading: SensorReading):
    """Receive sensor data from ESP32"""
    sensor_readings.append(reading)
    
    # Keep only last 100 readings to manage memory
    if len(sensor_readings) > 100:
        sensor_readings.pop(0)
    
    return SensorDataResponse(
        status="success",
        data=reading,
        message="Sensor data received successfully"
    )

@router.get("/history", response_model=List[SensorReading])
async def get_sensor_history(limit: int = 10):
    """Get sensor data history"""
    return sensor_readings[-limit:]
