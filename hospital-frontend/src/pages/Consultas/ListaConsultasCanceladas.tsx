import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Link } from "react-router-dom";
import "../../index.css";

interface Consulta {
  id: number;
  paciente_id: number;
  medico_id: number;
  data: string;
  horario: string;
  status: string;
}

export default function ListaConsultasCanceladas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    api.get("/consultas/canceladas").then((res) =>
      setConsultas(res.data.filter((c: Consulta) => c.status === "Cancelada"))
    );
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Consultas Canceladas</h1>
        <ul>
          {consultas.map((c) => (
            <li key={c.id} className="card">
              <p><strong>ID:</strong> {c.id}</p>
              <p><strong>Paciente ID:</strong> {c.paciente_id}</p>
              <p><strong>Médico ID:</strong> {c.medico_id}</p>
              <p><strong>Data:</strong> {c.data}</p>
              <p><strong>Horário:</strong> {c.horario}</p>
              <p><strong>Status:</strong> {c.status}</p>
            </li>
          ))}
        </ul>
        <Link to="/">
          <button>Voltar</button>
        </Link>
      </div>
    </div>
  );
}
