import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  const permissoes = [
    { to: "/pacientes", label: "Gerenciar Pacientes", roles: ["admin", "recepcionista", "medico"] },
    { to: "/consultas/pacientes", label: "Gerenciar Pacientes", roles: ["medico"] },
    { to: "/pacientes/cadastrar", label: "Cadastrar Paciente", roles: ["recepcionista"] },
    { to: "/pacientes/inativos", label: "Pacientes Inativos", roles: ["admin", "recepcionista"] },

    { to: "/medicos", label: "Gerenciar Médicos", roles: ["recepcionista"] },
    { to: "/medicos/cadastrar", label: "Cadastrar Médico", roles: ["recepcionista"] },

    { to: "/consultas", label: "Visualizar Consultas", roles: ["recepcionista"] },
    { to: "/consultas/agendar", label: "Agendar Consulta", roles: ["recepcionista"] },
    { to: "/consultas/canceladas", label: "Consultas Canceladas", roles: ["recepcionista"] },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar usuário");
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
      })
      .catch((err) => {
        console.error(err);
        setUsuario(null);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Bem-vindo(a), {usuario?.nome || "Usuário"}!</h1>
        <p className="mb-4">Escolha uma das opções abaixo para começar:</p>

        <div className="flex flex-col gap-3">
          {permissoes.map((permissao) =>
            usuario && permissao.roles.includes(usuario.role) ? (
              <Link key={permissao.to} to={permissao.to}>
                <button>{permissao.label}</button>
              </Link>
            ) : null
          )}

          <button onClick={handleLogout}>Sair / Voltar ao Login</button>
        </div>
      </div>
    </div>
  );
}
