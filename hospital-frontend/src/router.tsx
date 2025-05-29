import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaPacientes from "./pages/Pacientes/ListaPacientes";
import CadastrarPaciente from "./pages/Pacientes/CadastrarPaciente";
import EditarPaciente from "./pages/Pacientes/EditarPaciente";
import ListaPacientesInativos from "./pages/Pacientes/ListaPacientesInativos"; // ✅ Novo
import ListaMedicos from "./pages/Medicos/ListaMedicos";
import CadastrarMedico from "./pages/Medicos/CadastrarMedico";
import ListaConsultas from "./pages/Consultas/ListaConsultas";
import AgendarConsulta from "./pages/Consultas/AgendarConsulta";
import ListaConsultasCanceladas from "./pages/Consultas/ListaConsultasCanceladas"; // ✅ Novo
import Home from "./pages/Home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pacientes" element={<ListaPacientes />} />
        <Route path="/pacientes/inativos" element={<ListaPacientesInativos />} /> {/* ✅ Nova rota */}
        <Route path="/pacientes/cadastrar" element={<CadastrarPaciente />} />
        <Route path="/pacientes/editar/:id" element={<EditarPaciente />} />
        <Route path="/medicos" element={<ListaMedicos />} />
        <Route path="/medicos/cadastrar" element={<CadastrarMedico />} />
        <Route path="/consultas" element={<ListaConsultas />} />
        <Route path="/consultas/canceladas" element={<ListaConsultasCanceladas />} /> {/* ✅ Nova rota */}
        <Route path="/consultas/agendar" element={<AgendarConsulta />} />
      </Routes>
    </BrowserRouter>
  );
}
