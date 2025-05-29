from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from .. import schemas, models
from app.database import get_db

router = APIRouter(prefix="/consultas", tags=["Consultas"])

@router.post("/", response_model=schemas.ConsultaResponse, status_code=201)
def agendar_consulta(consulta: schemas.ConsultaCreate, db: Session = Depends(get_db)):
    if consulta.data < date.today():
        raise HTTPException(status_code=400, detail="Data inválida. Somente datas futuras são permitidas.")

    conflito = db.query(models.Consulta).filter(
        models.Consulta.medico_id == consulta.medico_id,
        models.Consulta.data == consulta.data,
        models.Consulta.horario == consulta.horario,
        models.Consulta.status == "Agendada"
    ).first()
    if conflito:
        raise HTTPException(status_code=400, detail="Horário já ocupado para esse médico")

    nova = models.Consulta(**consulta.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@router.get("/", response_model=list[schemas.ConsultaResponse])
def listar_consultas(db: Session = Depends(get_db)):
    return db.query(models.Consulta).filter(models.Consulta.status == "Agendada").all()

@router.patch("/{id}/cancelar")
def cancelar_consulta(id: int, db: Session = Depends(get_db)):
    consulta = db.query(models.Consulta).filter(models.Consulta.id == id).first()
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta não encontrado")
    if consulta.status != "Agendada":
        raise HTTPException(status_code=400, detail="Apenas consultas agendadas podem ser canceladas")
    
    consulta.status = "Cancelada"
    db.commit()
    return {"mensagem": "Consulta cancelada com sucesso"}

@router.get("/canceladas", response_model=list[schemas.ConsultaResponse])
def listar_canceladas(db: Session = Depends(get_db)):
    return db.query(models.Consulta).filter(models.Consulta.status == "Cancelada").all()
