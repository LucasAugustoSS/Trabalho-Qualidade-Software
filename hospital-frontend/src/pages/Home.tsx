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
  const permissoes = [
    { to: "/pacientes", label: "Gerenciar Pacientes", roles: ["admin", "recepcionista", "medico"] },
    { to: "/pacientes/cadastrar", label: "Cadastrar Paciente", roles: ["recepcionista"] },
    { to: "/pacientes/inativos", label: "Pacientes Inativos", roles: ["admin", "recepcionista"] },

    { to: "/medicos", label: "Gerenciar Médicos", roles: ["recepcionista"] },
    { to: "/medicos/cadastrar", label: "Cadastrar Médico", roles: ["recepcionista"] },

    { to: "/consultas", label: "Visualizar Consultas", roles: ["recepcionista"] },
    { to: "/consultas/agendar", label: "Agendar Consulta", roles: ["recepcionista"] },
    { to: "/consultas/canceladas", label: "Consultas Canceladas", roles: ["recepcionista"] },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar usuário");
        return res.json();
      })
      .then(data => {
        console.log("Dados do usuário:", data); // Aqui você vê o objeto completo
        console.log("Role do usuário:", data.role); // Aqui só o role
        setUsuario(data)
      })
      .catch(err => {
        console.error(err);
        setUsuario(null);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Bem-vindo ao Sistema de Gestão Hospitalar</h1>
        <p style={{ marginBottom: "20px" }}>
          Escolha uma das opções abaixo para começar:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {permissoes.map(permissao => (
            usuario && permissao.roles.includes(usuario.role) && (
              <Link key={permissao.to} to={permissao.to}>
                <button>{permissao.label}</button>
              </Link>
            )
          ))}

          <button onClick={handleLogout}>Voltar ao Login</button>
        </div>
      </div>
    </div>
  );
}
