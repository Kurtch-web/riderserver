# Helmet SIVIR Server

FastAPI backend for Helmet SIVIR smart helmet safety system.

## Features

- User authentication (signup/signin) for mobile app
- Admin authentication for web dashboard
- Sensor data endpoints
- Member management for admins
- Mobile app compatibility with device tracking

## Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies (for Supabase server)
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
SUPABASE_JWKS_URL=your_jwks_url
```

## Running the Server

```bash
# Activate virtual environment (if using)
venv\Scripts\activate

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Mobile app user registration
- `POST /api/auth/signin` - Mobile app user login
- `POST /api/auth/register` - Web user registration
- `POST /api/auth/login` - Web user login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/members` - List members (admin only)

### Sensors
- `GET /api/sensors` - Get sensor data

## Admin Account

Default admin credentials:
- Email: server@helmetsivir.com
- Password: servermaster@131

## Tech Stack

- FastAPI
- Python 3.10+
- Supabase
- Uvicorn
