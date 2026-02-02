import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "EU Study Platform"

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "eu_study")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

    # SMTP (OTP)
    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = os.getenv("SMTP_PORT")

    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

    #PDF microservice
    PDF_SERVICE_BASE_URL= os.getenv("PDF_SERVICE_BASE_URL")
    PDF_SERVICE_KEY= os.getenv("PDF_SERVICE_KEY")
    PDF_SERVICE_TIMEOUT= os.getenv("PDF_SERVICE_TIMEOUT")

settings = Settings()
