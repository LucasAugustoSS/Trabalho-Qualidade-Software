from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

SECRET_KEY = "joao-dario"
ALGORITHM = "HS256"
ACESSO_EXPIRA_MIN = 10

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def verificar_senha(senha: str, hash: str) -> bool:
    return pwd_context.verify(senha, hash)

def criar_token(dados: dict):
    dados = dados.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACESSO_EXPIRA_MIN)
    dados.update({"exp": expire})
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return payload
