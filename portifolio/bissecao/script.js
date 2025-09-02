function lerCoeficientes(grau) {
    let entrada = prompt(`Digite ${grau + 1} coeficientes separados por vírgula:`);
    let partes = entrada.split(/[,;\s]+/).filter(Boolean);
    let numeros = partes.map(Number);

    if (numeros.length !== grau + 1 || numeros.some(n => isNaN(n))) {
        throw new Error("Quantidade de coeficientes inválida.");
    }
    return numeros;
}

function calcularPolinomio(coefs, x) {
    return coefs.reduce((acc, coef, i) => acc + coef * Math.pow(x, coefs.length - 1 - i), 0);
}

function encontrarIntervalos(coefs, a, b, passo) {
    let intervalos = [];
    let xAtual = a;
    let fAnterior = calcularPolinomio(coefs, xAtual);

    while (xAtual < b) {
        let xProx = xAtual + passo;
        let fProx = calcularPolinomio(coefs, xProx);

        if (fAnterior * fProx < 0) {
            intervalos.push([xAtual, xProx]);
        }

        xAtual = xProx;
        fAnterior = fProx;
    }
    return intervalos;
}

function bissecao(coefs, a, b, epsilon) {
    let fa = calcularPolinomio(coefs, a);
    let fb = calcularPolinomio(coefs, b);

    if (fa * fb > 0) {
        throw new Error("Não há mudança de sinal no intervalo.");
    }

    let x, fx;
    while ((b - a) / 2 > epsilon) {
        x = (a + b) / 2;
        fx = calcularPolinomio(coefs, x);

        if (fx === 0) break;

        if (fa * fx < 0) {
            b = x;
            fb = fx;
        } else {
            a = x;
            fa = fx;
        }
    }
    return (a + b) / 2;
}

// Programa principal
try {
    let grau = parseInt(prompt("Digite o grau do polinômio:"));
    if (isNaN(grau) || grau < 1) throw new Error("Grau inválido.");

    let coefs = lerCoeficientes(grau);
    let epsilon = parseFloat(prompt("Digite a precisão ε (ex.: 0.01):"));
    if (isNaN(epsilon) || epsilon <= 0) throw new Error("Precisão inválida.");

    const a = -1000, b = 1000, passo = 1;

    let intervalos = encontrarIntervalos(coefs, a, b, passo);

    if (intervalos.length === 0) {
        alert("Nenhum intervalo com mudança de sinal foi encontrado.");
    } else {
        console.log("Intervalos com mudança de sinal:", intervalos);
        intervalos.forEach(([inicio, fim], i) => {
            let raiz = bissecao(coefs, inicio, fim, epsilon);
            console.log(`Intervalo ${i + 1}: [${inicio}, ${fim}] → Raiz ≈ ${raiz}`);
        });
    }
} catch (error) {
    console.error(error.message);
}
