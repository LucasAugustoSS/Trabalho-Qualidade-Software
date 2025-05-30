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
    console.log("ROLE ATUAL:", role);
    if (role !== "medico") {
      setErro("Acesso negado. Apenas médicos podem ver esta página.");
      return;
    }

    fetch("http://localhost:8000/medicos/consultas", {
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

  if (erro) return <div>{erro}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Minhas Consultas</h1>
      <ul className="space-y-2">
        {consultas.map((c) => (
          <li key={c.id} className="border p-2 rounded shadow">
            <strong>Data:</strong> {c.data} <br />
            <strong>Horário:</strong> {c.horario} <br />
            <strong>Status:</strong> {c.status} <br />
            <strong>Paciente:</strong> {c.paciente_nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
