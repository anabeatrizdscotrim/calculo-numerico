function lerCoeficientes(texto, grau) {
  const partes = texto.split(/[,;\s]+/).filter(Boolean);
  const nums = partes.map(Number);
  if (nums.some(n => Number.isNaN(n))) {
    throw new Error("Coeficientes inválidos. Use números separados por vírgula.");
  }
  if (nums.length !== grau + 1) {
    throw new Error(`Para grau ${grau}, informe ${grau + 1} coeficientes.`);
  }
  return nums;
}

function fmt(x) {
  if (!isFinite(x)) return "—";
  const ax = Math.abs(x);
  if (ax !== 0 && (ax < 1e-3 || ax >= 1e+6)) return x.toExponential(6);
  return x.toFixed(6);
}

function f(x, coef) {
  let res = 0;
  const n = coef.length - 1;
  for (let i = 0; i < coef.length; i++) {
    res += coef[i] * Math.pow(x, n - i);
  }
  return res;
}

function bissecao(coef, a, b, tol, maxIter) {
  let fa = f(a, coef);
  let fb = f(b, coef);
  if (fa * fb >= 0) {
    throw new Error("O intervalo informado não contém mudança de sinal.");
  }

  const linhas = [];
  let iter = 0;
  let erro = Math.abs(b - a) / 2;
  let p;

  while (iter < maxIter) {
    p = a + (b - a) / 2;
    const fp = f(p, coef);

    linhas.push({ iter: iter + 1, a, fa, b, fb, p, fp, erro });

    if (fp === 0 || erro < tol) break;

    if (fa * fp > 0) {
      a = p;
      fa = fp;
    } else {
      b = p;
      fb = fp;
    }

    erro = Math.abs(b - a) / 2;
    iter++;
  }

  if (iter >= maxIter) {
    throw new Error("Número máximo de iterações excedido!");
  }

  return { raiz: p, erro, iter: linhas.length, linhas };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const output = document.getElementById("output");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    output.innerHTML = "";
    try {
      const grau = Number(document.getElementById("grau").value);
      const coefText = document.getElementById("coef").value.trim();
      const tol = Number(document.getElementById("tol").value);
      const maxit = Number(document.getElementById("maxit").value);
      const passo = Number(document.getElementById("passo").value) || 0.5; // default passo 0.5
      const coef = lerCoeficientes(coefText, grau);

      const a = -1000;
      const b = 1000;

      const intervalosRaiz = bolzano(coef, a, b, passo);

      if (intervalosRaiz.length === 0) {
        output.innerHTML = `<div class="msg-error">Nenhum intervalo com raiz encontrado pelo método de Bolzano no intervalo [${a}, ${b}] com passo ${passo}.</div>`;
        return;
      }

      //
      let htmlInt = `<div><strong>Intervalos com raiz detectados pelo método de Bolzano (passo=${passo}):</strong><ul>`;
      intervalosRaiz.forEach(([ai, bi]) => {
        htmlInt += `<li>[${fmt(ai)} , ${fmt(bi)}]</li>`;
      });
      htmlInt += "</ul></div>";
      output.innerHTML = htmlInt;

      
      intervalosRaiz.forEach(([ai, bi], idx) => {
        try {
          const res = bissecao(coef, ai, bi, tol, maxit);
          renderResultado(res, ai, bi, idx + 1);
        } catch (err) {
          output.innerHTML += `<div class="msg-error">Erro no intervalo [${fmt(ai)} , ${fmt(bi)}]: ${err.message}</div>`;
        }
      });
    } catch (err) {
      output.innerHTML = `<div class="msg-error">${err.message}</div>`;
    }
  });

  document.getElementById("limpar").addEventListener("click", () => {
    form.reset();
    output.innerHTML = "";
  });

});
