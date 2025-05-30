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

def test_buscar_paciente_por_nome(client):
    client.post("/pacientes/", json={
        "nome": "Maria",
        "nascimento": "1990-05-01",
        "cpf": "98765432100",
        "sexo": "F",
        "telefone": "912345123",
        "endereco": "Rua Z"
    })
    response = client.get("/pacientes/buscar_nome/?nome=Maria")
    assert response.status_code == 200
    assert response.json()[0]["nome"] == "Maria"

def test_buscar_paciente_por_id(client):
    response = client.get("/pacientes/buscar_id/?id=1")
    assert response.status_code == 200
    assert response.json()[0]["id"] == 1

def test_busca_paciente_nenhum_encontrado(client):
    response = client.get("/pacientes/buscar/?termo=naoencontrado")
    assert response.status_code == 404


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
    # 1. Criar admin
    client.post("/auth/register", json={
        "nome": "Admin",
        "email": "admin@teste.com",
        "senha": "123456",
        "role": "admin"
    })

    # 2. Login como admin
    login_response = client.post("/auth/login", json={
        "email": "admin@teste.com",
        "senha": "123456"
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Criar paciente e capturar ID real
    paciente_response = client.post("/pacientes/", json={
        "nome": "Paciente Teste",
        "nascimento": "2000-01-01",
        "cpf": "00011122233",
        "sexo": "F",
        "telefone": "910000000",
        "endereco": "Rua Q"
    })
    paciente_id = paciente_response.json()["id"]

    # 4. Inativar paciente (sem consultas agendadas)
    response = client.patch(f"/pacientes/{paciente_id}/inativar", json={"motivo": "Falta de comparecimento"}, headers=headers)
    assert response.status_code == 200
    assert "inativado" in response.json()["mensagem"]