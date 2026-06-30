import os
import asyncio
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Load environment variables from .env in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

# Define structured response format
class TriageResponse(BaseModel):
    category: str = Field(description="The civic department category.")
    priority: str = Field(description="Urgency ranking: LOW, MEDIUM, HIGH, or CRITICAL.")
    auto_description: str = Field(description="A 2-3 sentence technical hazard analysis.")

async def generate_civic_analysis(location_name: str, coordinates: str, image_key: str) -> TriageResponse:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")
        
    client = genai.Client(api_key=api_key)
    prompt = f"Analyze incident: '{image_key}' at '{location_name}' [Coords: {coordinates}]."
    
    response = await client.aio.models.generate_content(
        model='gemini-robotics-er-1.6-preview',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TriageResponse,
            system_instruction=(
                "You are the Lead Municipal Engineering Dispatch Agent. "
                "Provide authoritative, professional hazard assessments for city workers. "
                "Keep response to 3 precise sentences."
            )
        )
    )
    
    return TriageResponse.model_validate_json(response.text)

async def generate_chat_response(message: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Error: API key is not configured. Please check your .env file."

    client = genai.Client(api_key=api_key)
    
    try:
        response = await client.aio.models.generate_content(
            model='gemini-robotics-er-1.6-preview',
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are the Civic Shield AI Assistant. You provide helpful, accurate, "
                    "and professional information regarding municipal services and infrastructure. "
                    "If a user asks something unrelated to civic issues, politely redirect them."
                )
            )
        )
        return response.text
    except Exception as e:
        return f"Error: Failed to connect to AI. ({str(e)})"