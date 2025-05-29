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

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    const res = await api.get("/consultas");
    setConsultas(res.data);
  };

  const cancelarConsulta = async (id: number) => {
    try {
      await api.patch(`/consultas/${id}/cancelar`);
      fetchConsultas(); // Recarrega a lista
    } catch (err) {
      alert("Erro ao cancelar a consulta.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Consultas Agendadas</h1>
        <ul>
          {consultas.map((c) => (
            <li key={c.id} className="card">
              <p><strong>ID:</strong> {c.id}</p>
              <p><strong>Paciente ID:</strong> {c.paciente_id}</p>
              <p><strong>Médico ID:</strong> {c.medico_id}</p>
              <p><strong>Data:</strong> {c.data}</p>
              <p><strong>Horário:</strong> {c.horario}</p>
              <p><strong>Status:</strong> {c.status}</p>
              {c.status === "Agendada" && (
                <button onClick={() => cancelarConsulta(c.id)}>
                  Cancelar Consulta
                </button>
              )}
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
