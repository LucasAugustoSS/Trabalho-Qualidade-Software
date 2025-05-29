from app import models, schemas
from datetime import date

def test_criar_paciente(client):
    paciente = {
        "nome": "João Dário",
        "nascimento": "2000-01-01",
        "cpf": "12345678910",
        "sexo": "M",
        "telefone": "91999999999",
        "endereco": "Rua A",
        "email": "joao@gmail.com",
        "tipo_sanguineo": "O",
        "alergias": ""
    }
    response = client.post("/pacientes/", json=paciente)
    assert response.status_code == 201
    assert response.json()["cpf"] == "12345678910"

def test_buscar_paciente_por_cpf(client):
    response = client.get("/pacientes/buscar/?termo=12345678910")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_atualizar_paciente(client):
    update = {
        "nome": "João Pamplona",
        "nascimento": "2000-01-01",
        "cpf": "12345678901",
        "sexo": "M",
        "telefone": "911111111",
        "endereco": "Rua B",
        "email": "joao@gmail.com",
        "tipo_sanguineo": "A",
        "alergias": "Poeira"
    }
    response = client.put("/pacientes/1", json=update)
    assert response.status_code == 200
    assert response.json()["nome"] == "João Pamplona"

def test_inativar_paciente(client):
    response = client.patch("/pacientes/1/inativar", json={"motivo": "Falta de comparecimento"})
    assert response.status_code == 200
    assert "inativado" in response.json()["mensagem"]