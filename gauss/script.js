function gerarMatriz() {
  const size = parseInt(document.getElementById("size").value);
  const div = document.getElementById("matrixInput");
  div.innerHTML = "";
  
  const tabela = document.createElement("tabela");
  for (let i = 0; i < size; i++) {
    const linha = document.createElement("tr");
    for (let j = 0; j <= size; j++) { 
      const celula = document.createElement("td");
      const entrada = document.createElement("entrada");
      entrada.type = "numero";
      entrada.value = Math.floor(Math.random() * 10) + 1; 
      celula.appendChild(entrada);
      linha.appendChild(celula);
    }
    table.appendChild(linha);
  }
  div.appendChild(tabela);
}


function printMatrix(matrix) {
  let html = "<tabela>";
  for (let i = 0; i < matrix.length; i++) {
    html += "<tr>";
    for (let j = 0; j < matrix[i].length; j++) {
      html += `<td>${matrix[i][j].toFixed(2)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tabela>";
  return html;
}

