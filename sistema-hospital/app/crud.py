from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models, schemas
from fastapi import HTTPException
from datetime import date, time, datetime


def get_paciente_by_cpf(db: Session, cpf: str):
    return db.query(models.Paciente).filter(models.Paciente.cpf == cpf).first()

def get_paciente_by_id(db: Session, paciente_id: int):
    return db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()

def get_medico_by_id(db: Session, medico_id: int):
    return db.query(models.Medico).filter(models.Medico.id == medico_id).first()


def create_paciente(db: Session, paciente: schemas.PacienteCreate):
    if get_paciente_by_cpf(db, paciente.cpf):
        raise HTTPException(status_code=400, detail="Paciente já cadastrado")
    novo = models.Paciente(**paciente.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


def listar_pacientes(db: Session):
    return db.query(models.Paciente).filter(models.Paciente.ativo == True).all()


def buscar_pacientes(db: Session, termo: str):
    return db.query(models.Paciente).filter(
        (models.Paciente.nome.ilike(f"%{termo}%")) |
        (models.Paciente.cpf == termo) |
        (models.Paciente.id == termo)
    ).all()


def atualizar_paciente(db: Session, paciente_id: int, dados: schemas.PacienteUpdate):
    paciente = get_paciente_by_id(db, paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(paciente, campo, valor)
    db.commit()
    db.refresh(paciente)
    return paciente


def inativar_paciente(db: Session, paciente_id: int, motivo: str):
    paciente = get_paciente_by_id(db, paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    if not paciente.ativo:
        raise HTTPException(status_code=400, detail="Paciente já inativo")
    consultas_ativas = db.query(models.Consulta).filter(
        and_(
            models.Consulta.paciente_id == paciente_id,
            models.Consulta.status == "Agendada"
        )
    ).all()
    if consultas_ativas:
        raise HTTPException(status_code=400, detail="Paciente possui consultas em aberto")
    paciente.ativo = False
    historico = models.HistoricoInativacao(
        paciente_id=paciente_id,
        motivo=motivo,
        data=date.today()
    )
    db.add(historico)
    db.commit()
    return {"mensagem": "Paciente inativado com sucesso"}


def criar_medico(db: Session, medico: schemas.MedicoCreate):
    if not medico.nome.strip() or not medico.especialidade.strip():
        raise HTTPException(status_code=400, detail="Nome e especialidade são obrigatórios.")

    novo = models.Medico(**medico.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def listar_medicos(db: Session):
    return db.query(models.Medico).all()


def agendar_consulta(db: Session, dados: schemas.ConsultaCreate):
    paciente = get_paciente_by_id(db, dados.paciente_id)
    if not paciente or not paciente.ativo:
        raise HTTPException(status_code=404, detail="Paciente inválido ou inativo")

    medico = get_medico_by_id(db, dados.medico_id)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")

    if dados.data < date.today():
        raise HTTPException(status_code=400, detail="Não é possível agendar para datas passadas")

    conflito = db.query(models.Consulta).filter(
        and_(
            models.Consulta.medico_id == dados.medico_id,
            models.Consulta.data == dados.data,
            models.Consulta.horario == dados.horario
        )
    ).first()
    if conflito:
        raise HTTPException(status_code=400, detail="Horário indisponível")

    nova = models.Consulta(**dados.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova
