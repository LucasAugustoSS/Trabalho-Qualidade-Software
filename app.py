from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)

app.secret_key = "hvxivg"



@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/cadastro", methods=["GET", "POST"])
def cadastrar():
    if request.method == "POST":
        nome = request.form["nome"]
        data_nascimento = request.form["data_nascimento"]
        cpf = request.form["cpf"]
        sexo = request.form["sexo"]
        telefone = request.form["telefone"]
        endereco = request.form["endereco"]

        # TODO: email, tipo sanguíneo, alergias conhecidas

        # TODO: passar pro banco de dados
        # TODO: criar ID ao passar pra lá

        # TODO: Se CPF já cadastrado: sistema alerta sobre duplicidade (quando tiver o banco)

        # TODO: Requisitos de Qualidade:
            # Validação de formato e dígitos verificadores de CPF
            # Validação de dados obrigatórios (fazer no HTML)

        flash("Cadastro realizado com sucesso!")
        
        return redirect(url_for("cadastrar"))
    
    return render_template("cadastro.html")

@app.route("/busca", methods=["GET", "POST"])
def buscar():
    # TODO consultar_dados
    # TODO atualizar_dados
    # TODO inativar_cadastro
    
    return render_template("busca.html")

@app.route("/agendamento", methods=["GET", "POST"])
def agendar_consulta():
    return render_template("agendamento.html")

if __name__ == "__main__":
    app.run(debug=True)