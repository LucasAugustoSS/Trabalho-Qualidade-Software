from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app import schemas, models, auth
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Autenticação"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/register", response_model=schemas.UsuarioResponse)
def registrar(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(models.Usuario).filter_by(email=usuario.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    senha_hash = auth.gerar_hash_senha(usuario.senha)

    novo = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=senha_hash,
        role=usuario.role
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.post("/login")
def login(dados: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter_by(email=dados.email).first()

    if not user or not auth.verificar_senha(dados.senha, user.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = auth.criar_token({
        "sub": user.email,
        "role": user.role,
        "id": user.id
    })

    return {"access_token": token, "token_type": "bearer"}


@router.get("/", response_model=list[schemas.UsuarioResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

@router.get("/me", response_model=schemas.UsuarioResponse)
def ler_usuario_atual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.verificar_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = db.query(models.Usuario).filter_by(email=email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user