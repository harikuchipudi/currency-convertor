// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("convert-btn").addEventListener("click", async () => {
//         const apiKey = "cur_live_XrPbVsEUCCR0UFWBT8CBgZRdmdbCcarycmEkPw7I";
//         const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             // Print the full API response
//             console.log("API Response:", data);

//         } catch (error) {
//             console.error("Error fetching data:", error);
//             alert("Failed to fetch currency rates. Please try again.");
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", () => {
    // Event listener for basic conversion
    const convertBtn = document.getElementById("convert-btn");
    if (convertBtn) {
        convertBtn.addEventListener("click", convertCurrency);
    }

    // Event listener for toggling between modes
    const toggleButton = document.getElementById("toggle-mode");
    const basicSection = document.getElementById("basic");
    const advancedSection = document.getElementById("advanced");

    if (toggleButton && basicSection && advancedSection) {
        toggleButton.addEventListener("click", () => {
            if (advancedSection.classList.contains("hidden")) {
                advancedSection.classList.remove("hidden");
                basicSection.classList.add("hidden");
                toggleButton.textContent = "Switch to Basic Mode";
            } else {
                basicSection.classList.remove("hidden");
                advancedSection.classList.add("hidden");
                toggleButton.textContent = "Switch to Advanced Mode";
            }
        });
    }

    // Event listener for fetching advanced data
    const fetchAdvancedDataBtn = document.getElementById("fetch-adv-data");
    if (fetchAdvancedDataBtn) {
        fetchAdvancedDataBtn.addEventListener("click", advConvertCurrency);
    }
});

// Function to convert currency (Basic Mode)
async function convertCurrency() {
    let amountEl = document.getElementById("basic-amount");
    let fromCurrencyEl = document.getElementById("basic-fromCurrency");
    let toCurrencyEl = document.getElementById("basic-toCurrency");

    if (!amountEl || !fromCurrencyEl || !toCurrencyEl) {
        console.error("One or more elements not found.");
        alert("Error: Required input fields are missing.");
        return;
    }

    let amount = parseFloat(amountEl.value);
    let fromCurrency = fromCurrencyEl.value;
    let toCurrency = toCurrencyEl.value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const apiKey = "cur_live_XrPbVsEUCCR0UFWBT8CBgZRdmdbCcarycmEkPw7I";
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.data && data.data[toCurrency]) {
            let rate = data.data[toCurrency].value;
            let convertedAmount = (amount * rate).toFixed(2);
            document.getElementById("basic-result").value = `${convertedAmount} ${toCurrency}`;
        } else {
            alert("Conversion rate not available.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch currency rates. Please try again.");
    }
}


// Function to fetch advanced exchange rates
// async function fetchAdvancedData() {
//     const apiKey = "cur_live_XrPbVsEUCCR0UFWBT8CBgZRdmdbCcarycmEkPw7I";
//     const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=USD&currencies=EUR,GBP,JPY,INR`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         const exchangeRates = data.data;

//         let amount = document.getElementById("advanced-amount");
//         let fromCurrency = document.getElementById("adv-fromCurrency");
//         let toCurrency = document.getElementById("adv-toCurrency");

//         if (!exchangeRates) {
//             alert("Failed to retrieve exchange rates.");
//             return;
//         }

//         console.log("Exchange rates fetched:", exchangeRates);
//     } catch (error) {
//         console.error("Error fetching exchange rates:", error);
//         alert("Failed to fetch exchange rates. Try again later.");
//     }
// }

let currencyGraph = {};

async function fetchExchangeRates() {
    try{
        // let baseCurrency = 'USD';
        const apiKey = "cur_live_XrPbVsEUCCR0UFWBT8CBgZRdmdbCcarycmEkPw7I";
        const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=USD`;
        const response = await fetch(url);
        const data = await response.json();

        console.log(data.data);

        if(!data || !data.data){
            throw new Error("Invalid API response");
        }

        currencyGraph[baseCurrency] = {};

        for(let current in data.data){
            currencyGraph[baseCurrency][current] = data.data[current].value;
        }
    }
    catch(error){
        console.error("Error fetching currency data:", error);
    }
}

// Dijkstra's Algorithm for best conversion path
function findBestConversionPath(start, end){
    let costs = {};
    let parents = {};
    let processed = [];

    for(let node in currencyGraph[start]){
        costs[node] = currencyGraph[start][node];
        parents[node] = start;
    }

    let node = findLowestCostNode(costs, processed);
    while(node){
        let cost = costs[node];
        let neighbors = currencyGraph[node];

        for(let neighbor in neighbors) {
            let newCost = cost * neighbors[neighbor];
            if(!costs[neighbor] || newCost < costs[neighbor]){
                costs[neighbor] = newCost;
                parents[neighbor] = node;
            }
        }

        processed.push(node);
        node = findBestConversionPath(costs, processed);
    }

    return reconstructPath(parents, start, end);
}

//helper function to find node with the lowest cost
function findLowestCostNode(costs, processed){
    let lowestCost = Infinity;
    let lowestNode = null;

    for(let node in costs){
        if(costs[node] < lowestCost && !processed.includes(node)){
            lowestCost = costs[node];
            lowestNode = node;
        }
    }

    return lowestNode;
}

//function to reconstruct the path
function reconstructPath(parents, start, end){
    let path = [end];
    let currentNode = end;

    while(currentNode !== start){
        if(!parents[currentNode]) return null;
        path.unshift(currentNode);
        currentNode = parents[currentNode];
    }
    path.unshift(start);
    return path;
}

//advanced function for conversion
async function advConvertCurrency(){
    let amount = parseFloat(document.getElementById("advanced-amount").value);
    let fromCurrency = document.getElementById("adv-fromCurrency").value;
    let toCurrency = document.getElementById("adv-toCurrency").value;

    if(!amount || amount<=0){
        alert("Please enter a valid amount");
        return;
    }

    if(!currencyGraph[fromCurrency]){
        await fetchExchangeRates(fromCurrency);
    }

    let bestPath = findBestConversionPath(fromCurrency, toCurrency);
    if(!bestPath){
        alert("No valid conversion path found");
        return;
    }

    let convertedAmount = amount;
    for(let i=0; i<bestPath.length-1; i++){
        let current = bestPath[i];
        let next = bestPath[i+1];
        convertedAmount *= currencyGraph[current][next];
    }

    document.getElementById("advance-result").value = `${convertedAmount.toFixed(2)} ${toCurrency}`;
}




