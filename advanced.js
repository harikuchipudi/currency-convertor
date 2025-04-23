const apiKey = "cur_live_yOfZ37RlTw06q3DJhd1zxzj2LMOR4t10edRugBaq"; // Replace with your actual API key
const btn = document.getElementById("test");
const outputDiv = document.getElementById("output");

// Function to fetch exchange rates and populate the graph
async function fetchExchangeRates(baseCurrency) {
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}`;
    const response = await fetch(url);
    const data = await response.json();

    const exchangeGraph = {};
    Object.keys(data.data).forEach(currency => {
        exchangeGraph[currency] = data.data[currency].value;
    });

    return exchangeGraph;
}

// Function to find all possible conversion paths using BFS
function findAllPaths(graph, start, end) {
    let queue = [[{ currency: start, rate: 1 }]];
    let allPaths = [];

    while (queue.length > 0) {
        let path = queue.shift();
        let lastNode = path[path.length - 1];

        if (lastNode.currency === end) {
            allPaths.push(path);
            continue;
        }

        for (let neighbor in graph[lastNode.currency]) {
            if (!path.some(node => node.currency === neighbor)) { // Avoid cycles
                let newPath = [...path, { currency: neighbor, rate: lastNode.rate * graph[lastNode.currency][neighbor] }];
                queue.push(newPath);
            }
        }
    }
    return allPaths;
}

// Function to get the best conversion path
function getBestConversionPath(paths) {
    let bestPath = null;
    let maxRate = 0;

    for (let path of paths) {
        let finalRate = path[path.length - 1].rate;
        if (finalRate > maxRate) {
            maxRate = finalRate;
            bestPath = path;
        }
    }

    return { bestPath, maxRate };
}

// Function to perform the conversion
async function advConvertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("from").value.toUpperCase();
    const toCurrency = document.getElementById("to").value.toUpperCase();

    if (!amount || amount <= 0) {
        outputDiv.textContent = "Invalid amount.";
        return;
    }

    if (!fromCurrency || !toCurrency) {
        outputDiv.textContent = "Please specify both from and to currencies.";
        return;
    }

    // Fetch exchange rates and construct the graph
    const exchangeGraph = await fetchExchangeRates(fromCurrency);

    if (!exchangeGraph[toCurrency]) {
        outputDiv.textContent = `No exchange rate available for ${toCurrency} from ${fromCurrency}.`;
        return;
    }

    // Find all paths and the best path
    let allPaths = findAllPaths(exchangeGraph, fromCurrency, toCurrency);
    if (allPaths.length === 0) {
        outputDiv.textContent = `No conversion path found from ${fromCurrency} to ${toCurrency}.`;
        return;
    }

    let { bestPath, maxRate } = getBestConversionPath(allPaths);
    let convertedAmount = (amount * maxRate).toFixed(2);

    // Display results
    let resultText = "All Possible Paths:\n";
    for (let path of allPaths) {
        resultText += path.map(node => node.currency).join(" → ") + ` | Final Rate: ${path[path.length - 1].rate.toFixed(5)}\n`;
    }

    resultText += `\nBest Conversion Path: ${bestPath.map(node => node.currency).join(" → ")} | Best Rate: ${maxRate.toFixed(5)}\nFinal Amount: ${convertedAmount} ${toCurrency}`;
    outputDiv.textContent = resultText;
}

// Event listener for the button
btn.addEventListener("click", advConvertCurrency);
// function hello(){
//     console.log("Button is getting clicked");
// }
// btn.addEventListener("click", hello);
