import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, senha });
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      navigate("/home"); // redireciona para a home
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Falha no login.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Login</h1>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <form onSubmit={handleLogin}>
  <div>
    <label>Email:</label>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
  </div>
  <div>
    <label>Senha:</label>
    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
  </div>
  <button type="submit">Entrar</button>
</form>

      </div>
      <p style={{ marginTop: "20px" }}>
  Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
</p>

    </div>
  );
}
