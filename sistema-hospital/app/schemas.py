from pydantic import BaseModel, EmailStr, validator, constr
from datetime import date, time
from typing import Optional,Annotated
import re


class PacienteCreate(BaseModel):
    nome: str
    nascimento: date
    cpf: str
    sexo: str
    telefone: str
    endereco: str
    email: Optional[EmailStr] = None
    tipo_sanguineo: Optional[str] = None
    alergias: Optional[str] = None

    @validator("cpf")
    def validar_cpf(cls, v):
        if not re.fullmatch(r"\d{11}", v):
            raise ValueError("CPF deve conter 11 dígitos")
        return v

    @validator("sexo")
    def validar_sexo(cls, v):
        if v not in ["M", "F", "Outro"]:
            raise ValueError("Sexo deve ser 'M', 'F' ou 'Outro'")
        return v

    @validator("tipo_sanguineo")
    def validar_sangue(cls, v):
        if v and v not in ["A", "B", "AB", "O"]:
            raise ValueError("Tipo sanguíneo inválido")
        return v

    @validator("email", "tipo_sanguineo", "alergias", pre=True)
    def empty_str_to_none(cls, v):
        return v or None

class PacienteResponse(BaseModel):
    id: int
    nome: str
    cpf: str
    ativo: bool

    class Config:
        from_attributes = True

class PacienteUpdate(BaseModel):
    nome: Optional[str]
    nascimento: Optional[date]
    sexo: Optional[str]
    telefone: Optional[str]
    endereco: Optional[str]
    email: Optional[EmailStr]
    tipo_sanguineo: Optional[str]
    alergias: Optional[str]

class InativarPaciente(BaseModel):
    motivo: str


class MedicoCreate(BaseModel):
    nome: Annotated[str, constr(strip_whitespace=True, min_length=1)]
    especialidade: Annotated[str, constr(strip_whitespace=True, min_length=1)]

class MedicoResponse(BaseModel):
    id: int
    nome: str
    especialidade: str

    class Config:
        from_attributes = True



class ConsultaCreate(BaseModel):
    paciente_id: int
    medico_id: int
    data: date
    horario: time

class ConsultaResponse(BaseModel):
    id: int
    paciente_id: int
    medico_id: int
    data: date
    horario: time
    status: str

    class Config:
        from_attributes = True
