import cloudinary
import os
from dotenv import load_dotenv
from app.config import settings

load_dotenv()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME                   #os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=settings.CLOUDINARY_API_KEY                         #os.getenv("CLOUDINARY_API_KEY"),
    api_secret=CLOUDINARY_API_KEY.CLOUDINARY_API_SECRET         #os.getenv("CLOUDINARY_API_SECRET"),
)