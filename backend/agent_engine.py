import asyncio
import os
from google.antigravity import Agent, LocalAgentConfig
from pydantic import BaseModel, Field

# Define structured response format for the frontend
class TriageResponse(BaseModel):
    category: str = Field(description="The civic department category (e.g., Roads, Electrical, Sewage, Water, Safety).")
    priority: str = Field(description="Urgency ranking: LOW, MEDIUM, HIGH, or CRITICAL.")
    auto_description: str = Field(description="A highly specific, 2-3 sentence technical hazard analysis and description generated for municipal workers.")

async def generate_civic_analysis(location_name: str, coordinates: str, image_key: str) -> TriageResponse:
    # Set up system guidelines to instruct the Antigravity agent
    system_prompt = (
        "You are the Lead Municipal Engineering Dispatch Agent for the Community Action Hub.\n"
        "Your task is to generate a comprehensive, realistic technical hazard report for city workers based on the location and issue type.\n"
        "Do not ask questions. Provide an authoritative assessment detailing public safety risk, structural failure indicators, and required equipment.\n"
        "Keep the description professional, precise, and limited to 3 clean sentences."
    )
    
    # Configure local agent environment
    config = LocalAgentConfig(
        model="gemini-1.5-flash",
        system_instructions=system_prompt,
        api_key=os.environ.get("GEMINI_API_KEY")
    )
    
    async with Agent(config) as agent:
        user_prompt = f"Analyze incident profile: '{image_key}' located at '{location_name}' with GPS coordinates [{coordinates}]."
        
        # Invoke the Antigravity conversational engine with structured output constraints
        response = await agent.chat(user_prompt, response_schema=TriageResponse)
        result_text = await response.text()
        return TriageResponse.model_validate_json(result_text)

import json
import urllib.request
import urllib.error

async def generate_chat_response(message: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "AQ.Ab8RN6KNws4APgCoGaVdLwdug2h3Upn3I1lVO8xN24PI4SIeAQ")
    if not api_key:
        return "Please set your API key in the backend server."

    system_prompt = (
        "You are the Civic Shield AI Assistant. You provide helpful, accurate, and professional information "
        "regarding municipal services, grievance redressal, and civic infrastructure. "
        "If a user asks something unrelated to civic issues, politely redirect them."
    )
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-robotics-er-1.6-preview:generateContent?key={api_key}"
    
    # Prepend system prompt to avoid 'Developer instruction is not enabled' error
    combined_message = f"SYSTEM INSTRUCTIONS: {system_prompt}\n\nUSER QUERY: {message}"
    
    payload = {
        "contents": [
            {"parts": [{"text": combined_message}]}
        ]
    }
    
    import urllib.request
    import json
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, urllib.request.urlopen, req)
        response_data = json.loads(response.read().decode('utf-8'))
        
        candidates = response_data.get('candidates', [])
        if candidates and candidates[0].get('content', {}).get('parts'):
            return candidates[0]['content']['parts'][0]['text']
        return "I am sorry, but I received an empty response."
    except Exception as e:
        print(f"API Error: {str(e)}")
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8'))
        return f"Error: Failed to connect to generative AI model. ({str(e)})"