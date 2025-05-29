from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Time
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    senha = Column(String, nullable=False)
    role = Column(String, nullable=False) # aqui é o perfil


class Paciente(Base):
    __tablename__ = "pacientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    nascimento = Column(Date, nullable=False)
    cpf = Column(String, unique=True, nullable=False, index=True)
    sexo = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    endereco = Column(String, nullable=False)
    email = Column(String, nullable=True)
    tipo_sanguineo = Column(String, nullable=True)
    alergias = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)

    def __repr__(self):
        return f"<Paciente(id={self.id}, nome='{self.nome}', cpf='{self.cpf}')>"

class HistoricoInativacao(Base):
    __tablename__ = "historico_inativacoes"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False)
    motivo = Column(String, nullable=False)
    data = Column(Date, nullable=False)

class Medico(Base):
    __tablename__ = "medicos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    especialidade = Column(String, nullable=False)

    def __repr__(self):
        return f"<Medico(id={self.id}, nome='{self.nome}')>"

class Consulta(Base):
    __tablename__ = "consultas"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False, index=True)
    medico_id = Column(Integer, ForeignKey("medicos.id", ondelete="CASCADE"), nullable=False)
    data = Column(Date, nullable=False)
    horario = Column(Time, nullable=False)
    status = Column(String, default="Agendada", nullable=False)

    def __repr__(self):
        return f"<Consulta(id={self.id}, data={self.data}, horario={self.horario})>"
