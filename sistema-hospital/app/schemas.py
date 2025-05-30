from pydantic import BaseModel, ConfigDict, EmailStr, field_validator, constr
from datetime import date, time
from typing import Optional, Annotated, Literal
import re

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    role: str  
    especialidade: Optional[str] = None
class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    role: Literal["admin", "recepcionista", "medico"]
    model_config = ConfigDict(from_attributes=True)




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

    @field_validator("cpf")
    def validar_cpf(cls, v):
        if not re.fullmatch(r"\d{11}", v):
            raise ValueError("CPF deve conter 11 dígitos")
        return v

    @field_validator("sexo")
    def validar_sexo(cls, v):
        if v not in ["M", "F", "O"]:
            raise ValueError("Sexo deve ser 'M', 'F' ou 'O'")
        return v

    @field_validator("tipo_sanguineo")
    def validar_sangue(cls, v):
        if v and v not in ["A", "B", "AB", "O"]:
            raise ValueError("Tipo sanguíneo inválido")
        return v

    @field_validator("email", "tipo_sanguineo", "alergias", mode="before")
    def empty_str_to_none(cls, v):
        return v or None

class PacienteResponse(BaseModel):
    id: int
    nome: str
    nascimento: date
    cpf: str
    sexo: str
    telefone: str
    endereco: str
    email: Optional[EmailStr] = None
    tipo_sanguineo: Optional[str] = None
    alergias: Optional[str] = None
    ativo: bool

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)


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

    model_config = ConfigDict(from_attributes=True)


class ConsultaMedicoResponse(BaseModel):
    id: int
    data: date
    horario: time
    status: str
    paciente_nome: str
    @classmethod
    def from_model(cls, consulta, paciente_nome: str):
        return cls(
            id=consulta.id,
            data=consulta.data,
            horario=consulta.horario,
            status=consulta.status,
            paciente_nome=paciente_nome
        )
