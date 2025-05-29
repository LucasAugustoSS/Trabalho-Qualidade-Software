def test_criar_medico(client):
    medico = {"nome": "Dr. Tiago", "especialidade": "Cardiologista"}
    response = client.post("/medicos/", json=medico)
    assert response.status_code == 200
    assert response.json()["nome"] == "Dr. Tiago"

def test_listar_medicos(client):
    response = client.get("/medicos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)