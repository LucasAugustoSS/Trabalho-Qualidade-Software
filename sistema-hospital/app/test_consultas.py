from datetime import date, time, timedelta

def test_agendar_consulta(client):
    client.post("/pacientes/", json={
        "nome": "Renato",
        "nascimento": "1995-01-01",
        "cpf": "11122233344",
        "sexo": "M",
        "telefone": "912345678",
        "endereco": "Rua C"
    })
    client.post("/medicos/", json={"nome": "Dr. Thiago", "especialidade": "Otorrinolaringologista"})

    response = client.post("/consultas/", json={
        "paciente_id": 2,
        "medico_id": 1,
        "data": (date.today() + timedelta(days=1)).isoformat(),
        "horario": "14:00:00"
    })
    assert response.status_code == 201
    assert response.json()["status"] == "Agendada"

def test_cancelar_consulta(client):
    response = client.patch("/consultas/1/cancelar")
    assert response.status_code == 200
    assert "cancelada" in response.json()["mensagem"].lower()
    
from datetime import date, timedelta

def test_inativar_paciente_com_consulta_agendada(client):
   
    client.post("/auth/register", json={
        "nome": "Admin",
        "email": "admin@teste.com",
        "senha": "123456",
        "role": "admin"
    })

    
    login = client.post("/auth/login", json={
        "email": "admin@teste.com",
        "senha": "123456"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    
    resp_paciente = client.post("/pacientes/", json={
        "nome": "Paciente Teste",
        "nascimento": "1999-01-01",
        "cpf": "99988877766",
        "sexo": "M",
        "telefone": "911234567",
        "endereco": "Rua X"
    })
    paciente_id = resp_paciente.json()["id"]


    resp_medico = client.post("/medicos/", json={
        "nome": "Dr. Ocupado",
        "especialidade": "Clínico Geral"
    })
    medico_id = resp_medico.json()["id"]

   
    client.post("/consultas/", json={
        "paciente_id": paciente_id,
        "medico_id": medico_id,
        "data": (date.today() + timedelta(days=1)).isoformat(),
        "horario": "15:00:00"
    })


    response = client.patch(f"/pacientes/{paciente_id}/inativar", json={"motivo": "Teste"}, headers=headers)
    assert response.status_code == 400
    assert "consulta" in response.json()["detail"].lower()
