import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ paciente_id: "", medico_id: "", data: "", horario: "" });
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/pacientes").then(res => setPacientes(res.data));
    api.get("/medicos").then(res => setMedicos(res.data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.paciente_id || !form.medico_id || !form.data || !form.horario) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await api.post("/consultas", form);
      navigate("/consultas");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setErro(err.response.data.detail);
      } else {
        setErro("Erro ao agendar consulta.");
      }
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Agendar Consulta</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Paciente</label>
            <select name="paciente_id" onChange={handleChange} value={form.paciente_id}>
              <option value="">Selecione</option>
              {pacientes.map((p: any) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Médico</label>
            <select name="medico_id" onChange={handleChange} value={form.medico_id}>
              <option value="">Selecione</option>
              {medicos.map((m: any) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Data</label>
            <input type="date" name="data" onChange={handleChange} value={form.data} />
          </div>

          <div>
            <label>Horário</label>
            <select name="horario" onChange={handleChange} value={form.horario}>
              <option value="">Selecione</option>
              {Array.from({ length: 24 }).map((_, i) => {
                const hora = String(i).padStart(2, '0');
                return <option key={hora} value={`${hora}:00`}>{hora}:00</option>;
              })}
            </select>
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <button type="submit">Agendar</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link to="/home"><button>Voltar para Página Inicial</button></Link>
        </div>
      </div>
    </div>
  );
}
