import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Link } from "react-router-dom";
import "../../index.css";

interface Paciente {
  id: number;
  nome: string;
  nascimento: string;
  cpf: string;
  ativo: boolean;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarPacientes();
  }, []);

  async function buscarPacientes() {
    const res = await api.get("/pacientes");
    setPacientes(res.data);
  }

  async function inativarPaciente(id: number) {
    const motivo = prompt("Digite o motivo da inativação:");
    if (!motivo) return;

    try {
      await api.patch(`/pacientes/${id}/inativar`, { motivo });
      buscarPacientes();
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao inativar paciente.");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Lista de Pacientes</h1>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <ul>
          {pacientes.map((p) => (
            <li key={p.id} className="card">
              <p><strong>Nome:</strong> {p.nome}</p>
              <p><strong>Nascimento:</strong> {p.nascimento}</p>
              <p><strong>CPF:</strong> {p.cpf}</p>
              <p><strong>Status:</strong> {p.ativo ? "Ativo" : "Inativo"}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Link to={`/pacientes/editar/${p.id}`}>
                  <button>Editar</button>
                </Link>
                {p.ativo && (
                  <button onClick={() => inativarPaciente(p.id)} style={{ backgroundColor: "#e74c3c", color: "#fff" }}>
                    Inativar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "20px" }}>
          <Link to="/pacientes/cadastrar">
            <button>Cadastrar Novo Paciente</button>
          </Link>
          <Link to="/">
            <button style={{ marginLeft: "10px" }}>Voltar para Página Inicial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
