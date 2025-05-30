from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models
from app.database import get_db
from app.auth import get_current_user
from app.schemas import ConsultaMedicoResponse

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

@router.get("/consultas", response_model=list[schemas.ConsultaMedicoResponse])
def listar_consultas_medico(db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    if usuario["role"] != "medico":
        raise HTTPException(status_code=403, detail="Apenas médicos podem acessar suas consultas")
    
    consultas = db.query(models.Consulta).filter(models.Consulta.medico_id == usuario["id"]).all()
    resultados = []
    for c in consultas:
        paciente = db.query(models.Paciente).filter_by(id=c.paciente_id).first()
        nome_paciente = paciente.nome if paciente else "Desconhecido"
        resultados.append(schemas.ConsultaMedicoResponse.from_model(c, nome_paciente))

    return resultados
