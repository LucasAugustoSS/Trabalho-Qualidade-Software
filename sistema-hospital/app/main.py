from fastapi import FastAPI
from app.database import Base, engine
from app.routers import pacientes, medicos, consultas, auth
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital CESUPA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"mensagem": "API está rodando com sucesso!"}

app.include_router(pacientes.router)
app.include_router(medicos.router)
app.include_router(consultas.router)
app.include_router(auth.router)