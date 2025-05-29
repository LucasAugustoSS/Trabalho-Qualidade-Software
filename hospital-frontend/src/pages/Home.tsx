import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove o token
    navigate("/login"); // redireciona para o login
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Bem-vindo ao Sistema de Gestão Hospitalar</h1>
        <p style={{ marginBottom: "20px" }}>
          Escolha uma das opções abaixo para começar:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/pacientes"><button>Gerenciar Pacientes</button></Link>
          <Link to="/pacientes/cadastrar"><button>Cadastrar Paciente</button></Link>
          <Link to="/pacientes/inativos"><button>Pacientes Inativos</button></Link>

          <Link to="/medicos"><button>Gerenciar Médicos</button></Link>
          <Link to="/medicos/cadastrar"><button>Cadastrar Médico</button></Link>

          <Link to="/consultas"><button>Visualizar Consultas</button></Link>
          <Link to="/consultas/agendar"><button>Agendar Consulta</button></Link>
          <Link to="/consultas/canceladas"><button>Consultas Canceladas</button></Link>

          {/* Botão para logout e ir ao login */}
          <button onClick={handleLogout}>Voltar ao Login</button>
        </div>
      </div>
    </div>
  );
}
