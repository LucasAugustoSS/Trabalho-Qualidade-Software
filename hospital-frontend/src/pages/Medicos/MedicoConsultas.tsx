import { useEffect, useState } from "react";

type Consulta = {
  id: number;
  data: string;
  horario: string;
  status: string;
  paciente_nome: string;
};

export default function MedicoConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role !== "medico") {
      setErro("Acesso negado. Apenas médicos podem ver esta página.");
      return;
    }

    fetch("http://localhost:8000/consultas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar consultas");
        return res.json();
      })
      .then(setConsultas)
      .catch((e) => setErro(e.message));
  }, []);

  if (erro) return <div className="text-red-500 p-4">{erro}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Consultas Agendadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultas.map((c) => (
          <div key={c.id} className="bg-white shadow-md rounded-lg p-4 border">
            <h2 className="text-lg font-bold mb-2">{c.paciente_nome}</h2>
            <p><strong>Data:</strong> {c.data}</p>
            <p><strong>Horário:</strong> {c.horario}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
