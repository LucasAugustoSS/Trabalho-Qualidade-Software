def test_criar_medico(client):
    medico = {"nome": "Dr. Tiago", "especialidade": "Cardiologista"}
    response = client.post("/medicos/", json=medico)
    assert response.status_code == 200
    assert response.json()["nome"] == "Dr. Tiago"

def test_listar_medicos(client):
    response = client.get("/medicos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    
    
def test_cadastrar_medico_sem_especialidade(client):
    usuario = {
        "nome": "Dra. Ana",
        "email": "ana@hospital.com",
        "senha": "123456",
        "role": "medico"
    }
    response = client.post("/auth/register", json=usuario)
    assert response.status_code == 400
    assert "Especialidade é obrigatória" in response.json()["detail"]
