function gerarMatriz() {
  const size = parseInt(document.getElementById("size").value);
  const div = document.getElementById("matrixInput");
  div.innerHTML = "";
  
  const table = document.createElement("table");
  for (let i = 0; i < size; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j <= size; j++) { 
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.value = ""; 
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  div.appendChild(table);
}

function getMatrix() {
  const div = document.getElementById("matrixInput");
  const rows = div.getElementsByTagName("tr");
  const matrix = [];
  for (let i = 0; i < rows.length; i++) {
    const inputs = rows[i].getElementsByTagName("input");
    const row = [];
    for (let j = 0; j < inputs.length; j++) {
      row.push(parseFloat(inputs[j].value));
    }
    matrix.push(row);
  }
  return matrix;
}

function printMatrix(matrix) {
  let html = "<table>";
  for (let i = 0; i < matrix.length; i++) {
    html += "<tr>";
    for (let j = 0; j < matrix[i].length; j++) {
      html += `<td>${matrix[i][j].toFixed(2)}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  return html;
}

function resolver() {
  const output = document.getElementById("output");
  output.innerHTML = "";
  let A = getMatrix();
  const n = A.length;
  let multiplicadores = 0;
  
  // Eliminação
  for (let k = 0; k < n - 1; k++) {
    for (let i = k + 1; i < n; i++) {
      let m = A[i][k] / A[k][k];
      multiplicadores++;
      for (let j = k; j <= n; j++) {
        A[i][j] -= m * A[k][j];
      }
      
      // Mostra etapa
      const stepDiv = document.createElement("div");
      stepDiv.className = "step";
      stepDiv.innerHTML = `<strong>Etapa ${k + 1}, linha ${i + 1}</strong><br>
        Multiplicador usado: m = ${m.toFixed(4)}<br>
        ${printMatrix(A)}`;
      output.appendChild(stepDiv);
    }
  }
  
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let soma = A[i][n];
    for (let j = i + 1; j < n; j++) {
      soma -= A[i][j] * x[j];
    }
    x[i] = soma / A[i][i];
  
  const resDiv = document.createElement("div");
  resDiv.className = "step";
  resDiv.innerHTML = `<h3>Resultado Final</h3>
    Quantidade de multiplicadores: ${multiplicadores}<br>
    <strong>Solução:</strong><br>
    ${x.map((val, idx) => "x" + (idx + 1) + " = " + val.toFixed(4)).join("<br>")}`;
  output.appendChild(resDiv);
}
}
