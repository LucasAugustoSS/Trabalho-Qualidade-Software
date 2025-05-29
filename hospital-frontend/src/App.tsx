import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="text-center p-8 space-y-4">
      <h1 className="text-3xl font-bold text-primary">Hospital CESUPA</h1>
      <div className="space-x-4">
        <Link to="/" className="bg-primary text-white px-4 py-2 rounded">Pacientes</Link>
        <Link to="/pacientes/inativos" className="bg-yellow-600 text-white px-4 py-2 rounded">Inativos</Link>
        <Link to="/medicos" className="bg-primary text-white px-4 py-2 rounded">Médicos</Link>
        <Link to="/consultas" className="bg-primary text-white px-4 py-2 rounded">Consultas</Link>
        <Link to="/consultas/canceladas" className="bg-red-600 text-white px-4 py-2 rounded">Canceladas</Link>
        <Link to="/consultas/agendar" className="bg-accent text-white px-4 py-2 rounded">Agendar Consulta</Link>
        <Link to="/medicos/cadastrar" className="bg-secondary border px-4 py-2 rounded">Cadastrar Médico</Link>
      </div>
    </div>
  );
}
