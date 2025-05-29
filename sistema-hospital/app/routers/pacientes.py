from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import get_db

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("/", response_model=schemas.PacienteResponse, status_code=201)
def criar(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    return crud.create_paciente(db, paciente)

@router.get("/", response_model=list[schemas.PacienteResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(models.Paciente).filter(models.Paciente.ativo == True)

@router.get("/buscar/", response_model=list[schemas.PacienteResponse])
def buscar(termo: str, db: Session = Depends(get_db)):
    resultados = crud.buscar_pacientes(db, termo)
    if not resultados:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return resultados

@router.put("/{paciente_id}", response_model=schemas.PacienteResponse)
def atualizar(paciente_id: int, dados: schemas.PacienteCreate, db: Session = Depends(get_db)):
    return crud.atualizar_paciente(db, paciente_id, dados)

@router.patch("/{paciente_id}/inativar")
def inativar(paciente_id: int, motivo: dict, db: Session = Depends(get_db)):
    if "motivo" not in motivo or not motivo["motivo"]:
        raise HTTPException(status_code=400, detail="Motivo da inativação é obrigatório")
    return crud.inativar_paciente(db, paciente_id, motivo["motivo"])

@router.get("/todos", response_model=list[schemas.PacienteResponse])
def listar_todos(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

@router.get("/inativos", response_model=list[schemas.PacienteResponse])
def listar_inativos(db: Session = Depends(get_db)):
    return db.query(models.Paciente).filter(models.Paciente.ativo == False).all()
