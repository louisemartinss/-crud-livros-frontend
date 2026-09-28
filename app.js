const API_URL = "http://localhost:3000/usuarios";

const formulario = document.querySelector("#form-usuario");
const campoId = document.querySelector("#usuario-id");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoIdade = document.querySelector("#idade");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaUsuarios = document.querySelector("#lista-usuarios");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function criarCartaoUsuario(usuario) {
  const cartao = document.createElement("article");
  cartao.className = "usuario";

  const nome = document.createElement("h3");
  nome.textContent = usuario.nome;

  const email = document.createElement("p");
  email.textContent = `E-mail: ${usuario.email}`;

  const idade = document.createElement("p");
  idade.textContent = `Idade: ${usuario.idade ?? "Não informada"}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${usuario._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-usuario";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregarUsuarioParaEdicao(usuario._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirUsuario(usuario._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(nome, email, idade, id, acoes);

  return cartao;
}

function exibirUsuarios(usuarios) {
  listaUsuarios.innerHTML = "";

  if (usuarios.length === 0) {
    mostrarMensagem("Nenhum usuário cadastrado");
    return;
  }

  usuarios.forEach((usuario) => {
    listaUsuarios.appendChild(criarCartaoUsuario(usuario));
  });

  mostrarMensagem(`${usuarios.length} usuário(s) encontrado(s)`);
}

async function listarUsuarios() {
  try {
    mostrarMensagem("Carregando usuários...");
    const usuarios = await fazerRequisicao(API_URL);
    exibirUsuarios(usuarios);
  } catch (erro) {
    listaUsuarios.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

async function buscarUsuarioPorId(id) {
  const usuario = await fazerRequisicao(`${API_URL}/${id}`);
  exibirUsuarios([usuario]);
  return usuario;
}

async function salvarUsuario(evento) {
  evento.preventDefault();

  const usuario = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim()
  };

  if (campoIdade.value !== "") {
    usuario.idade = Number(campoIdade.value);
  }

  const id = campoId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Usuário atualizado" : "Usuário cadastrado");
    await listarUsuarios();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregarUsuarioParaEdicao(id) {
  try {
    const usuario = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = usuario._id;
    campoNome.value = usuario.nome;
    campoEmail.value = usuario.email;
    campoIdade.value = usuario.idade ?? "";
    tituloFormulario.textContent = "Editar usuário";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoNome.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirUsuario(id) {
  const confirmou = window.confirm("Deseja excluir este usuário?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Usuário excluído");
    await listarUsuarios();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Novo usuário";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvarUsuario);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarUsuarios);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listarUsuarios();
});

formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarUsuarioPorId(id);
  } catch (erro) {
    listaUsuarios.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

listarUsuarios();


const API_URL_LIVROS = "http://localhost:3000/livros";

const formularioLivro = document.querySelector("#form-livro");
const campoLivroId = document.querySelector("#livro-id");
const campoTitulo = document.querySelector("#titulo");
const campoAutor = document.querySelector("#autor");
const campoAno = document.querySelector("#anoPublicacao");
const tituloFormularioLivro = document.querySelector("#titulo-formulario-livro");
const botaoSalvarLivro = document.querySelector("#botao-salvar-livro");
const botaoCancelarLivro = document.querySelector("#botao-cancelar-livro");
const listaLivros = document.querySelector("#lista-livros");
const mensagemLivro = document.querySelector("#mensagem-livro");
const formularioBuscaLivro = document.querySelector("#form-busca-livro");
const campoBuscaIdLivro = document.querySelector("#busca-id-livro");

function mostrarMensagemLivro(texto, erro = false) {
  mensagemLivro.textContent = texto;
  mensagemLivro.classList.toggle("erro", erro);
}

function criarCartaoLivro(livro) {
  const cartao = document.createElement("article");
  cartao.className = "usuario";

  const titulo = document.createElement("h3");
  titulo.textContent = livro.titulo;

  const autor = document.createElement("p");
  autor.textContent = `Autor: ${livro.autor}`;

  const ano = document.createElement("p");
  ano.textContent = `Ano de publicação: ${livro.anoPublicacao ?? "Não informado"}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${livro._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-usuario";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregarLivroParaEdicao(livro._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirLivro(livro._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(titulo, autor, ano, id, acoes);

  return cartao;
}

function exibirLivros(livros) {
  listaLivros.innerHTML = "";

  if (livros.length === 0) {
    mostrarMensagemLivro("Nenhum livro cadastrado");
    return;
  }

  livros.forEach((livro) => {
    listaLivros.appendChild(criarCartaoLivro(livro));
  });

  mostrarMensagemLivro(`${livros.length} livro(s) encontrado(s)`);
}

async function listarLivros() {
  try {
    mostrarMensagemLivro("Carregando livros...");
    const livros = await fazerRequisicao(API_URL_LIVROS);
    exibirLivros(livros);
  } catch (erro) {
    listaLivros.innerHTML = "";
    mostrarMensagemLivro(erro.message, true);
  }
}

async function buscarLivroPorId(id) {
  const livro = await fazerRequisicao(`${API_URL_LIVROS}/${id}`);
  exibirLivros([livro]);
  return livro;
}

async function salvarLivro(evento) {
  evento.preventDefault();

  const livro = {
    titulo: campoTitulo.value.trim(),
    autor: campoAutor.value.trim()
  };

  if (campoAno.value !== "") {
    livro.anoPublicacao = Number(campoAno.value);
  }

  const id = campoLivroId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL_LIVROS}/${id}` : API_URL_LIVROS;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)
    });

    limparFormularioLivro();
    mostrarMensagemLivro(estaEditando ? "Livro atualizado" : "Livro cadastrado");
    await listarLivros();
  } catch (erro) {
    mostrarMensagemLivro(erro.message, true);
  }
}

async function carregarLivroParaEdicao(id) {
  try {
    const livro = await fazerRequisicao(`${API_URL_LIVROS}/${id}`);

    campoLivroId.value = livro._id;
    campoTitulo.value = livro.titulo;
    campoAutor.value = livro.autor;
    campoAno.value = livro.anoPublicacao ?? "";
    tituloFormularioLivro.textContent = "Editar livro";
    botaoSalvarLivro.textContent = "Salvar alterações";
    botaoCancelarLivro.classList.remove("oculto");
    campoTitulo.focus();
  } catch (erro) {
    mostrarMensagemLivro(erro.message, true);
  }
}

async function excluirLivro(id) {
  const confirmou = window.confirm("Deseja excluir este livro?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL_LIVROS}/${id}`, { method: "DELETE" });
    limparFormularioLivro();
    mostrarMensagemLivro("Livro excluído");
    await listarLivros();
  } catch (erro) {
    mostrarMensagemLivro(erro.message, true);
  }
}

function limparFormularioLivro() {
  formularioLivro.reset();
  campoLivroId.value = "";
  tituloFormularioLivro.textContent = "Novo livro";
  botaoSalvarLivro.textContent = "Cadastrar";
  botaoCancelarLivro.classList.add("oculto");
}

formularioLivro.addEventListener("submit", salvarLivro);
botaoCancelarLivro.addEventListener("click", limparFormularioLivro);
document.querySelector("#botao-atualizar-livro").addEventListener("click", listarLivros);
document.querySelector("#botao-limpar-busca-livro").addEventListener("click", () => {
  campoBuscaIdLivro.value = "";
  listarLivros();
});

formularioBuscaLivro.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaIdLivro.value.trim();

  if (!id) {
    mostrarMensagemLivro("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarLivroPorId(id);
  } catch (erro) {
    listaLivros.innerHTML = "";
    mostrarMensagemLivro(erro.message, true);
  }
});

listarLivros();
