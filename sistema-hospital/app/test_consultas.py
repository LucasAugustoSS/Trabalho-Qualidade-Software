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