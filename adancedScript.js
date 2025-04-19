const countries = [
    { id: "USD", name: "USA", tax: 1.5 },
    { id: "EUR", name: "Europe", tax: 2.0 },
    { id: "GBP", name: "UK", tax: 1.2 },
    { id: "INR", name: "India", tax: 0.8 },
    { id: "JPY", name: "Japan", tax: 1.0 }
  ];
  
  const apikey = "cur_live_lqzJEslZTehdnIpXIfCRghlqHTvP0APhBrvOjKlY";
  let exchangeGraph = {}; 
  const taxState = {};
  const nodesContainer = document.getElementById("nodesContainer");
  const fromCurrencySelect = document.getElementById("fromCurrency");
  const toCurrencySelect = document.getElementById("toCurrency");
  
  // Initialize countries and UI
  countries.forEach(c => {
    taxState[c.id] = true;
  
    const div = document.createElement("div");
    div.className = "node";
    div.innerHTML = `
      <h3>${c.id}</h3>
      <p>${c.name}</p>
      <p>Tax: ${c.tax}%</p>
      <button class="tax-button" id="btn-${c.id}" onclick="toggleTax('${c.id}')">Tax: ON</button>
    `;
    nodesContainer.appendChild(div);
  
    fromCurrencySelect.add(new Option(c.id, c.id));
    toCurrencySelect.add(new Option(c.id, c.id));
  });
  
  function toggleTax(currencyId) {
    taxState[currencyId] = !taxState[currencyId];
    const btn = document.getElementById(`btn-${currencyId}`);
    btn.innerText = `Tax: ${taxState[currencyId] ? 'ON' : 'OFF'}`;
    btn.classList.toggle("off", !taxState[currencyId]);
  }
  
  function buildExchangeGraph(responseData) {
    const graph = {};
    const currencies = Object.keys(responseData);
  
    currencies.forEach(from => {
      graph[from] = {};
      currencies.forEach(to => {
        if (from !== to) {
          const fromRate = responseData[from].value;
          const toRate = responseData[to].value;
          graph[from][to] = toRate / fromRate;
        }
      });
    });
  
    return graph;
  }
  
  async function fetchExchangeRates() {
    try {
      const currencyList = countries.map(c => c.id).join('%2C');
      const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apikey}&currencies=${currencyList}`);
      const data = await response.json();
      exchangeGraph = buildExchangeGraph(data.data);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
    }
  }
  
  function findAllPaths(graph, from, to, visited = {}, path = [], rate = 1.0, allPaths = [], depth = 0) {
    path.push(from);
    visited[from] = true;
  
    if (from === to) {
      let totalRate = rate;
      for (let i = 1; i < path.length; i++) {
        const country = path[i];
        if (taxState[country]) {
          const tax = countries.find(c => c.id === country).tax;
          totalRate *= (1 - tax / 100);
        }
      }
      allPaths.push({ path: [...path], rate: totalRate });
    } else if (depth < 5) {
      for (let neighbor in graph[from]) {
        if (!visited[neighbor]) {
          findAllPaths(
            graph,
            neighbor,
            to,
            { ...visited },
            [...path],
            rate * graph[from][neighbor],
            allPaths,
            depth + 1
          );
        }
      }
    }
  
    path.pop();
    visited[from] = false;
    return allPaths;
  }
  
  async function findBestArbitrage() {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    const amount = parseFloat(document.getElementById("amount").value);
    const resultBox = document.getElementById("result");
    const allPathsBox = document.getElementById("allPaths");
    resultBox.innerHTML = '';
    allPathsBox.innerHTML = '';
  
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
  
    if (from === to) {
      alert("Please select different currencies.");
      return;
    }
  
    resultBox.innerHTML = "🔄 Fetching latest exchange rates...";
    await fetchExchangeRates();
  
    const allPaths = findAllPaths(exchangeGraph, from, to);
    if (allPaths.length === 0) {
      resultBox.innerText = "No possible path found!";
      return;
    }
  
    allPaths.sort((a, b) => b.rate - a.rate);
    const best = allPaths[0];
    const finalValue = amount * best.rate;
  
    resultBox.innerHTML = `
      <strong>Best Conversion Path</strong>: ${best.path.join(" → ")}<br/>
      <strong>Converted Value</strong>: ${finalValue.toFixed(2)} ${to}<br/>
      <strong>Effective Rate (after tax)</strong>: ${best.rate.toFixed(6)}
    `;
  
    allPaths.forEach((p, index) => {
      const div = document.createElement("div");
      div.className = (p === best) ? "best" : "";
      div.innerHTML = `
        <strong>Path ${index + 1}</strong>: ${p.path.join(" → ")}<br/>
        Rate: ${p.rate.toFixed(6)} | Final Amount: ${(amount * p.rate).toFixed(2)} ${to}
      `;
      allPathsBox.appendChild(div);
    });
  }
  