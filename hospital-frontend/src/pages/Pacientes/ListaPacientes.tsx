import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Link } from "react-router-dom";
import "../../index.css";

interface Paciente {
  id: number;
  nome: string;
  nascimento: string;
  cpf: string;
  sexo: string;
  telefone: string;
  endereco: string;
  email: string;
  tipo_sanguineo: string;
  alergias: string;
  ativo: boolean;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({ id: "", nome: "", nascimento: "", cpf: "", ativo: "" });
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarPacientes();
    api.get("/pacientes").then(res => setPacientes(res.data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function listarPacientes() {
    const res = await api.get("/pacientes");
    setErro("");
    setPacientes(res.data);
  }

  async function buscarPorCPF() {
    if (!form.cpf.trim()) {
      listarPacientes();
      return;
    }
  
    try {
      const res = await api.get(`/pacientes/buscar_cpf/?cpf=${form.cpf}`);
      if (res.data.length === 0) {
        setErro("Não há paciente com este CPF.");
        setPacientes([]);
      } else {
        setPacientes(res.data);
        setErro("");
      }
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao buscar paciente.");
      setPacientes([]);
    }
  }

  async function buscarPorNome() {
    if (!form.nome.trim()) {
      listarPacientes();
      return;
    }
  
    try {
      const res = await api.get(`/pacientes/buscar_nome/?nome=${form.nome}`);
      if (res.data.length === 0) {
        setErro("Não há paciente com este nome.");
        setPacientes([]);
      } else {
        setPacientes(res.data);
        setErro("");
      }
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao buscar paciente.");
      setPacientes([]);
    }
  }

  async function buscarPorID() {
    if (!form.id.trim()) {
      listarPacientes();
      return;
    }
  
    try {
      const res = await api.get(`/pacientes/buscar_id/?id=${form.id}`);
      if (res.data.length === 0) {
        setErro("Não há paciente com este ID.");
        setPacientes([]);
      } else {
        setPacientes(res.data);
        setErro("");
      }
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao buscar paciente.");
      setPacientes([]);
    }
  }

  async function inativarPaciente(id: number) {
    const motivo = prompt("Digite o motivo da inativação:");
    if (!motivo) return;

    try {
      await api.patch(`/pacientes/${id}/inativar`, { motivo });
      listarPacientes();
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao inativar paciente.");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Lista de Pacientes</h1>

        <input
          type="number"
          name="cpf"
          placeholder="Digite o CPF"
          value={form.cpf}
          onChange={handleChange}
        />
        <button onClick={buscarPorCPF}>Buscar</button>

        <input
          type="text"
          name="nome"
          placeholder="Digite o nome"
          value={form.nome}
          onChange={handleChange}
        />
        <button onClick={buscarPorNome}>Buscar</button>

        <input
          type="text"
          name="id"
          placeholder="Digite o ID"
          value={form.id}
          onChange={handleChange}
        />
        <button onClick={buscarPorID}>Buscar</button>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <ul>
          {pacientes.map((p) => (
            <li key={p.id} className="card">
              <p><strong>Nome:</strong> {p.nome}</p>
              <p><strong>Nascimento:</strong> {p.nascimento}</p>
              <p><strong>CPF:</strong> {p.cpf}</p>
              <p><strong>Sexo:</strong> {p.sexo}</p>
              <p><strong>Telefone:</strong> {p.telefone}</p>
              <p><strong>Endereço:</strong> {p.endereco}</p>
              <p><strong>Email:</strong> {p.email}</p>
              <p><strong>Tipo sanguíneo:</strong> {p.tipo_sanguineo}</p>
              <p><strong>Alergias:</strong> {p.alergias}</p>
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
