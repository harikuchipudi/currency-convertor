const exchangeGraph = {
    "USD": { "EUR": 0.85, "GBP": 0.75, "INR": 74.57 },
    "EUR": { "USD": 1.18, "GBP": 0.88, "INR": 88.30 },
    "GBP": { "USD": 1.33, "EUR": 1.14, "INR": 100.20 },
    "INR": { "USD": 0.013, "EUR": 0.011, "GBP": 0.010 },
    "JPY": { "USD": 0.0091, "EUR": 0.0078, "GBP": 0.0068 }
};

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
function advConvertCurrency(amount, fromCurrency, toCurrency) {
    if (!amount || amount <= 0) {
        return "Invalid amount.";
    }

    let allPaths = findAllPaths(exchangeGraph, fromCurrency, toCurrency);
    let { bestPath, maxRate } = getBestConversionPath(allPaths);
    let convertedAmount = (amount * maxRate).toFixed(2);

    let resultText = "All Possible Paths:\n";
    for (let path of allPaths) {
        resultText += path.map(node => node.currency).join(" → ") + ` | Final Rate: ${path[path.length - 1].rate.toFixed(5)}\n`;
    }

    resultText += `\nBest Conversion Path: ${bestPath.map(node => node.currency).join(" → ")} | Best Rate: ${maxRate.toFixed(5)}\nFinal Amount: ${convertedAmount} ${toCurrency}`;

    return resultText;
}

// Test the function
console.log(advConvertCurrency(100, "USD", "INR"));