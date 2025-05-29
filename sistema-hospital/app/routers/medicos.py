from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models
from app.database import get_db

router = APIRouter(prefix="/medicos", tags=["Medicos"])

@router.post("/", response_model=schemas.MedicoResponse)
def criar_medico(medico: schemas.MedicoCreate, db: Session = Depends(get_db)):
    novo = models.Medico(**medico.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.get("/", response_model=list[schemas.MedicoResponse])
def listar_medicos(db: Session = Depends(get_db)):
    return db.query(models.Medico).all()