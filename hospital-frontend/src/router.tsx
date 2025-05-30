import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListaPacientes from "./pages/Pacientes/ListaPacientes";
import CadastrarPaciente from "./pages/Pacientes/CadastrarPaciente";
import EditarPaciente from "./pages/Pacientes/EditarPaciente";
import ListaPacientesInativos from "./pages/Pacientes/ListaPacientesInativos";
import ListaMedicos from "./pages/Medicos/ListaMedicos";
import CadastrarMedico from "./pages/Medicos/CadastrarMedico";
import ListaConsultas from "./pages/Consultas/ListaConsultas";
import AgendarConsulta from "./pages/Consultas/AgendarConsulta";
import ListaConsultasCanceladas from "./pages/Consultas/ListaConsultasCanceladas";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import CadastrarUsuario from "./pages/CadastrarUsuario.jsx";
import MedicoConsultas from "./pages/Medicos/MedicoConsultas";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro" element={<CadastrarUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/medicos/consultas" element={<RequireAuth><MedicoConsultas /></RequireAuth>} />


        {/* Rotas protegidas */}
        <Route path="/pacientes" element={<RequireAuth><ListaPacientes /></RequireAuth>} />
        <Route path="/pacientes/inativos" element={<RequireAuth><ListaPacientesInativos /></RequireAuth>} />
        <Route path="/pacientes/cadastrar" element={<RequireAuth><CadastrarPaciente /></RequireAuth>} />
        <Route path="/pacientes/editar/:id" element={<RequireAuth><EditarPaciente /></RequireAuth>} />
        <Route path="/medicos" element={<RequireAuth><ListaMedicos /></RequireAuth>} />
        <Route path="/medicos/cadastrar" element={<RequireAuth><CadastrarMedico /></RequireAuth>} />
        <Route path="/consultas" element={<RequireAuth><ListaConsultas /></RequireAuth>} />
        <Route path="/consultas/canceladas" element={<RequireAuth><ListaConsultasCanceladas /></RequireAuth>} />
        <Route path="/consultas/agendar" element={<RequireAuth><AgendarConsulta /></RequireAuth>} />
    { /*   <Route path="/medicos/consultas" element={<RequireAuth><MedicoConsultas /></RequireAuth>} />*/}

        {/* Página não encontrada */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
