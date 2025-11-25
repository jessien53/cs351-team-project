"""
Supabase Storage utility functions for handling file uploads
"""

import os
import uuid
from django.conf import settings
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    if not url or not key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
        )

    return create_client(url, key)


def upload_image_to_supabase(file, folder="listings"):
    """
    Upload an image file to Supabase storage bucket

    Args:
        file: File object from request.FILES
        folder: Subfolder within the bucket (default: "listings")

    Returns:
        str: Public URL of the uploaded image

    Raises:
        Exception: If upload fails
    """
    try:
        supabase = get_supabase_client()

        # Generate unique filename
        file_ext = os.path.splitext(file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = f"{folder}/{unique_filename}"

        # Read file content
        file_content = file.read()

        # Upload to Supabase storage
        bucket_name = settings.SUPABASE_BUCKET
        response = supabase.storage.from_(bucket_name).upload(
            file_path,
            file_content,
            {"content-type": file.content_type, "upsert": "false"},
        )

        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)

        return public_url

    except Exception as e:
        raise Exception(f"Failed to upload image to Supabase: {str(e)}")


def delete_image_from_supabase(file_path):
    """
    Delete an image from Supabase storage bucket

    Args:
        file_path: Path to file in bucket (e.g., "listings/filename.jpg")

    Returns:
        bool: True if successful
    """
    try:
        supabase = get_supabase_client()
        bucket_name = settings.SUPABASE_BUCKET

        supabase.storage.from_(bucket_name).remove([file_path])
        return True

    except Exception as e:
        print(f"Failed to delete image from Supabase: {str(e)}")
        return False
