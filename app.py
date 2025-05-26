from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    if request.method == "POST":
        nome = request.form["nome"]
        data_nascimento = request.form["data_nascimento"]
        cpf = request.form["cpf"]
        sexo = request.form["sexo"]
        telefone = request.form["telefone"]
        endereco = request.form["endereco"]

        # email, tipo sanguíneo, alergias conhecidas
        
        return redirect(url_for("home"))
    
    return render_template("cadastro.html")

if __name__ == "__main__":
    app.run(debug=True)