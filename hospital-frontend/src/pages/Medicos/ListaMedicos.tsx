import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Link } from "react-router-dom";
import "../../index.css";

interface Medico {
  id: number;
  nome: string;
  especialidade: string;
}

export default function ListaMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    api.get("/medicos").then((res) => setMedicos(res.data));
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Lista de Médicos</h1>
        <ul>
          {medicos
            .filter((m) => m.nome && m.especialidade) 
            .map((m) => (
              <li key={m.id} className="card">
                <p><strong>Nome:</strong> {m.nome}</p>
                <p><strong>Especialidade:</strong> {m.especialidade}</p>
              </li>
            ))}
        </ul>
        <div style={{ marginTop: "20px" }}>
          <Link to="/">
            <button>Voltar para Página Inicial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
