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
    // const toggleButton = document.getElementById("toggle-mode");
    // const basicSection = document.getElementById("basic");
    // const advancedSection = document.getElementById("advanced");

    // if (toggleButton && basicSection && advancedSection) {
    //     toggleButton.addEventListener("click", () => {
    //         if (advancedSection.classList.contains("hidden")) {
    //             advancedSection.classList.remove("hidden");
    //             basicSection.classList.add("hidden");
    //             toggleButton.textContent = "Switch to Basic Mode";
    //         } else {
    //             basicSection.classList.remove("hidden");
    //             advancedSection.classList.add("hidden");
    //             toggleButton.textContent = "Switch to Advanced Mode";
    //         }
    //     });
    // }

    //nandita & sabarika updated code:
    const toggleButton = document.getElementById("toggle-mode");
    const basicSection = document.getElementById("basic");
    const advancedSection = document.getElementById("advanced");
    document.body.style.backgroundImage = "url('christine-roy-ir5MHI6rPg0-unsplash.jpg')";
    if (toggleButton && basicSection && advancedSection) {
        toggleButton.addEventListener("click", () => {
            if (advancedSection.classList.contains("hidden")) {
                advancedSection.classList.remove("hidden");
                basicSection.classList.add("hidden");
                toggleButton.textContent = " Basic Mode ";
                document.body.style.backgroundImage = "url('https://t4.ftcdn.net/jpg/07/89/86/35/240_F_789863525_4SoWoYglwyE9v7ipF5iPr7uufOtTQ5Ab.jpg')";
                document.header.style.color= "red";
            } else {
                basicSection.classList.remove("hidden");
                advancedSection.classList.add("hidden");
                toggleButton.textContent = "Advanced Mode";
                document.body.style.backgroundImage = "url('/christine-roy-ir5MHI6rPg0-unsplash.jpg')";
            }
        });
    }

    // Event listener for fetching advanced data
    const fetchAdvancedDataBtn = document.getElementById("fetch-adv-data");
    if (fetchAdvancedDataBtn) {
        // fetchAdvancedDataBtn.addEventListener("click", advConvertCurrency);
        fetchAdvancedDataBtn.addEventListener("click", findPaths);
    }
});

function Hello(){
    document.getElementById("ouput-adv-text").value = "This is after";
}

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

    if(fromCurrency == toCurrency){
        alert("Do you want to convert to the same currency!!!");
        return;
    }

    const apiKey = "cur_live_XrPbVsEUCCR0UFWBT8CBgZRdmdbCcarycmEkPw7I";
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.data && data.data[toCurrency]) {
            let rate = data.data[toCurrency].value;
            let convertedAmount = (amount * rate).toFixed(2);
            document.getElementById("basic-result").value = `${convertedAmount} ${toCurrency}`;
            sayYourFinancialStatus(convertedAmount);
        } else {
            alert("Conversion rate not available.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch currency rates. Please try again.");
    }
}

function sayYourFinancialStatus(amount){
    let status = "";
    if (amount >= 1000000000000) {
        status = "You can be a trillionaire!";
    } else if (amount >= 1000000000) {
        status = "You can be a billionaire!";
    } else if (amount >= 1000000) {
        status = "You are a millionaire!";
    } else if (amount >= 1000) {
        status = "You are a thousandaire!";
    } else {
        status = "Just work hard and you'll get there!";
    }
    document.getElementById("wealthStatus").innerText = status;
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


// manual implementing of djikstra

const exchangeGraph = {
    "USD": { "EUR": 0.93, "GBP": 0.77, "INR": 86.03 },
    "EUR": { "USD": 1.08, "GBP": 0.88, "INR": 93.91 },
    "GBP": { "USD": 1.29, "EUR": 1.14, "INR": 111.56 },
    "INR": { "USD": 0.012, "EUR": 0.011, "GBP": 0.009 },
    "JPY": { "USD": 0.0067, "EUR": 0.0060, "GBP": 0.0052 }
};

// Function to find all possible paths
function findAllPaths(graph, from, to, visited = {}, path = [], cost = 0, allPaths = []) {
    path.push(from);
    visited[from] = true;

    if (from === to) {
        allPaths.push({ path: [...path], cost: cost });
    } else {
        for (let neighbor in graph[from]) {
            if (!visited[neighbor]) {
                findAllPaths(graph, neighbor, to, { ...visited }, [...path], cost + graph[from][neighbor], allPaths);
            }
        }
    }

    path.pop();
    visited[from] = false;
    return allPaths;
}

const keyToName = {
    "INR": "Rupees",
    "USD": "Dollars",
    "EUR": "European Pound",
    "JPY": "Japaneese Yen",
    "GBP": "British Pound Stirling"
}


// Main function to find paths and display results
function findPaths() {
    let from = document.getElementById("adv-fromCurrency").value.toUpperCase();
    let to = document.getElementById("adv-toCurrency").value.toUpperCase();

    console.log(from);
    console.log(to);
    // let from = "USD";
    // let to = "INR";

    let amount = parseInt(document.getElementById("advanced-amount").value);
    console.log(typeof(amount));

    if(amount <=0 ){
        alert("entre vaid amount");
    }



    // Validate inputs
    // if (!from || !to || from === to) {
    //     alert("Please select valid 'From' and 'To' currencies.");
    //     return;
    // }

    let allPaths = findAllPaths(exchangeGraph, from, to);

    let pathList = document.getElementById("allPaths");
    pathList.innerHTML = "";

    if (allPaths.length === 0) {
        pathList.innerHTML = `<li>No possible path found!</li>`;
        return;
    }

    // Sort paths by cost (ascending order)
    allPaths.sort((a, b) => a.cost - b.cost);

    // Display all paths in the list
    allPaths.forEach(pathObj => {
        let listItem = document.createElement("li");
        listItem.innerText = `Path: ${pathObj.path.join(" -> ")} | Cost : ${pathObj.cost.toFixed(2)}`;
        console.log(listItem.innerText);
        pathList.appendChild(listItem);
    });

    // Highlight the best path
    let bestPath = allPaths[allPaths.length-1];

    console.log(bestPath);

    console.log("This is working");

    let final_amount = amount * bestPath.cost.toFixed(2);

    document.getElementById("bestPath-text").innerText = `The maximum amount : ${final_amount} ${keyToName[to]}`;


    document.getElementById("bestPath").innerText = `Best Path: ${bestPath.path.join(" -> ")} | Cost : ${bestPath.cost.toFixed(2)}`;

    // Highlight nodes in the best path
    document.querySelectorAll('.node').forEach(node => node.classList.remove('highlight', 'best'));
    bestPath.path.forEach(currency => {
        document.getElementById(currency).classList.add('best');
    });

  
}





