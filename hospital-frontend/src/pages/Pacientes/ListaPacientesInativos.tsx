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

export default function ListaPacientesInativos() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    api.get("/pacientes/inativos").then((res) =>
      setPacientes(res.data.filter((p: Paciente) => !p.ativo))
    );
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Pacientes Inativos</h1>
        <ul>
          {pacientes.map((p) => (
            <li key={p.id} className="card">
              <p><strong>Nome:</strong> {p.nome}</p>
              <p><strong>CPF:</strong> {p.cpf}</p>
              <p><strong>Nascimento:</strong> {p.nascimento}</p>
            </li>
          ))}
        </ul>
        <Link to="/home">
          <button>Voltar</button>
        </Link>
      </div>
    </div>
  );
}
