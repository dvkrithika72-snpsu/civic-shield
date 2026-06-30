from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent_engine import generate_civic_analysis

app = FastAPI(title="Community Action Hub - Agentic API Gateway")

# Allow seamless frontend-to-backend communication across local origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IncidentPayload(BaseModel):
    location: str
    coordinates: str
    image_key: str

@app.post("/api/triage")
async def handle_incident_triage(payload: IncidentPayload):
    try:
        # Delegate technical synthesis to the Antigravity core runtime
        analysis = await generate_civic_analysis(
            location_name=payload.location,
            coordinates=payload.coordinates,
            image_key=payload.image_key
        )
        return {"status": "success", "analysis": analysis.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatPayload(BaseModel):
    message: str

@app.post("/api/chat")
async def handle_chat(payload: ChatPayload):
    try:
        from agent_engine import generate_chat_response
        response_text = await generate_chat_response(payload.message)
        return {"status": "success", "response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)