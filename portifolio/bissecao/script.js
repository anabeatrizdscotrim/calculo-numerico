function lerCoeficientes(texto, grau) {
  const partes = texto.split(/[,;\s]+/).filter(Boolean);
  const numeros = partes.map(Number);
  if (numeros.some(n => Number.isNaN(n))) {
    throw new Error("Coeficientes inválidos. Use números separados por vírgula.");
  }
  if (numeros.length !== grau + 1) {
    throw new Error(`Para grau ${grau}, informe ${grau + 1} coeficientes.`);
  }
  return numeros;
}

function formatarNumero(x) {
  if (!isFinite(x)) return "—";
  const absX = Math.abs(x);
  if (absX !== 0 && (absX < 1e-3 || absX >= 1e+6)) return x.toExponential(6);
  return x.toFixed(6);
}

function funcao(x, coeficientes) {
  let resultado = 0;
  const n = coeficientes.length - 1;
  for (let i = 0; i < coeficientes.length; i++) {
    resultado += coeficientes[i] * Math.pow(x, n - i);
  }
  return resultado;
}

function bolzano(coeficientes, inicio, fim) {
  const intervaloRaizes = [];
  const passoInterno = 0.001;
  let x1 = inicio;
  let f1 = funcao(x1, coeficientes);


  while (x1 < fim) {
    let x2 = x1 + passoInterno;
    let f2 = funcao(x2, coeficientes);

    if (f1 * f2 < 0) {
      intervaloRaizes.push([x1, x2]);
    }

    x1 = x2;
    f1 = f2;
  }

  const intervalosAmigaveis = [];
  if (intervaloRaizes.length > 0) {
    let [inicioInt, fimInt] = intervaloRaizes[0];

    for (let i = 1; i < intervaloRaizes.length; i++) {
      const [a, b] = intervaloRaizes[i];
      
      if (a - fimInt <= passoInterno * 10) {
        fimInt = b;
      } else {
        intervalosAmigaveis.push([
        parseFloat(inicioInt.toFixed(4)), 
        parseFloat(fimInt.toFixed(4))
      ]);

        inicioInt = a;
        fimInt = b;
      }
    }
    intervalosAmigaveis.push([
      parseFloat(inicioInt.toFixed(4)), 
      parseFloat(fimInt.toFixed(4))
    ]);

  }

  return intervalosAmigaveis;
}


function bissecao(coeficientes, a, b, tol, maxIter) {
  let fa = funcao(a, coeficientes);
  let fb = funcao(b, coeficientes);
  if (fa * fb >= 0) {
    throw new Error("O intervalo informado não contém mudança de sinal.");
  }

  const linhas = [];
  let iteracao = 0;
  let erro = Math.abs(b - a) / 2;
  let xn;

  while (iteracao < maxIter) {
    xn = a + (b - a) / 2;
    const fxn = funcao(xn, coeficientes);

    linhas.push({ iteracao: iteracao + 1, a, fa, b, fb, xn, fxn, erro });

    if (fxn === 0 || erro < tol) break;

    if (fa * fxn > 0) {
      a = xn;
      fa = fxn;
    } else {
      b = xn;
      fb = fxn;
    }

    erro = Math.abs(b - a) / 2;
    iteracao++;
  }

  if (iteracao >= maxIter) {
    throw new Error("Número máximo de iterações excedido!");
  }

  return { raiz: xn, erro, iter: linhas.length, linhas };
}

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form");
  const resultadoDiv = document.getElementById("output");

  formulario.addEventListener("submit", (ev) => {
    ev.preventDefault();
    resultadoDiv.innerHTML = "";
    try {
      const grau = Number(document.getElementById("grau").value);
      const coefText = document.getElementById("coef").value.trim();
      const tol = Number(document.getElementById("tol").value);
      const maxIter = Number(document.getElementById("maxit").value);
      const coeficientes = lerCoeficientes(coefText, grau);

      const inicio = -1000;
      const fim = 1000;

      const intervalosRaiz = bolzano(coeficientes, inicio, fim);

      if (intervalosRaiz.length === 0) {
        resultadoDiv.innerHTML = `<div class="msg-error">Nenhum intervalo com raiz encontrado pelo método de Bolzano no intervalo [${inicio}, ${fim}].</div>`;
        return;
      }

      let htmlInt = `<div><strong>Intervalos com raiz detectados pelo método de Bolzano:</strong><ul>`;
      intervalosRaiz.forEach(([a, b]) => {
        htmlInt += `<li>[${formatarNumero(a)} , ${formatarNumero(b)}]</li>`;
      });
      htmlInt += "</ul></div>";
      resultadoDiv.innerHTML = htmlInt;

      intervalosRaiz.forEach(([a, b], idx) => {
        try {
          const res = bissecao(coeficientes, a, b, tol, maxIter);
          renderizarResultado(res, a, b, idx + 1);
        } catch (err) {
          resultadoDiv.innerHTML += `<div class="msg-error">Erro no intervalo [${formatarNumero(a)} , ${formatarNumero(b)}]: ${err.message}</div>`;
        }
      });
    } catch (err) {
      resultadoDiv.innerHTML = `<div class="msg-error">${err.message}</div>`;
    }
  });

  document.getElementById("limpar").addEventListener("click", () => {
    formulario.reset();
    resultadoDiv.innerHTML = "";
  });

  function renderizarResultado(res, aInit, bInit, indice) {
    const wrap = document.createElement("div");

    const titulo = document.createElement("div");
    titulo.className = "interval-title";
    titulo.textContent = `Raiz ${indice} no intervalo [${formatarNumero(aInit)} , ${formatarNumero(bInit)}]`;
    wrap.appendChild(titulo);

    const tabelaWrap = document.createElement("div");
    tabelaWrap.className = "table-wrap";
    const tabela = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>
      <th>Iter</th><th>Xa</th><th>f(Xa)</th><th>Xb</th><th>f(Xb)</th><th>Xn</th><th>f(Xn)</th><th>Erro</th>
    </tr>`;
    tabela.appendChild(thead);

    const tbody = document.createElement("tbody");
    res.linhas.forEach(l => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${l.iteracao}</td>
        <td>${formatarNumero(l.a)}</td>
        <td>${formatarNumero(l.fa)}</td>
        <td>${formatarNumero(l.b)}</td>
        <td>${formatarNumero(l.fb)}</td>
        <td>${formatarNumero(l.xn)}</td>
        <td>${formatarNumero(l.fxn)}</td>
        <td>${formatarNumero(l.erro)}</td>`;
      tbody.appendChild(tr);
    });
    tabela.appendChild(tbody);
    tabelaWrap.appendChild(tabela);
    wrap.appendChild(tabelaWrap);

    const caixaResultado = document.createElement("div");
    caixaResultado.className = "result-box";
    caixaResultado.textContent = `Raiz aproximada: ${res.raiz.toFixed(12)} — Erro final: ${res.erro.toExponential(6)} — Iterações: ${res.iter}`;
    wrap.appendChild(caixaResultado);

    resultadoDiv.appendChild(wrap);
  }
});
