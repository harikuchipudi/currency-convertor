// const exchangeGraph = {
//     "USD": { "EUR": 0.85, "GBP": 0.75, "INR": 74.57 },
//     "EUR": { "USD": 1.18, "GBP": 0.88, "INR": 88.30 },
//     "GBP": { "USD": 1.33, "EUR": 1.14, "INR": 100.20 },
//     "INR": { "USD": 0.013, "EUR": 0.011, "GBP": 0.010 },
//     "JPY": { "USD": 0.0091, "EUR": 0.0078, "GBP": 0.0068 }
// };

// const btn = document.getElementById("fetch-adv-data");
// // btn.addEventListener("click", findPaths());
// btn.addEventListener("click", hello);

// function hello(){
//     console.log("Heloooooo worldddd!");
// }


// //function to find all the paths
// function findAllPaths(graph, from, to, visited={}, path=[], cost = 0, allPaths = []){
//     path.push(from);
//     visited[from] = true;

//     if(from == to){
//         allPaths.push({path: [...path], cost: cost});
//     }
//     else{
//         for(let neighbor in graph[from]){
//             if(!visited[neighbor]){
//                 findAllPaths(graph, neighbor, to , {...visited}, [...path], cost + graph[from][neighbor], allPaths);
//             }
//         }
//     }

//     path.pop();
//     visited[from] = false;
//     return allPaths;
// }

// function findPaths(){
//     let from = document.getElementById("adv-fromCurrency").value;
//     let to = document.getElementById("adv-toCurrency").value;

//     let allPaths = findAllPaths(exchangeGraph, from, to);

//     let pathList = document.getElementById("allPaths");
//     pathList.innerHTML = "";

//     if(allPaths.length === 0){
//         pathList.innerHTML = `<li>No possible path found!</li>`;
//         return;
//     }

//     allPaths.sort((a, b) => a.cost - b.cost);

//     allPaths.forEach(pathObj => {
//         let listItem = document.createElement("li");
//         listItem.innerText = `Path: ${pathObj.path.join(" -> ")} | Cost : ${pathObj.cost.toFixed(2)}`;
//         pathList.appendChild(listItem);
//     });

//     let bestPath = allPaths[0];

//     document.getElementById("bestPath").innerText = `Best Path: ${bestPath.path.join(" -> ")} | Cost : ${bestPath.cost.toFixed(2)}`;

//     document.querySelectorAll('.node').forEach(node => node.classList.remove('highlight', 'best'));

//     bestPath.path.forEach(currency => {
//         document.getElementById(currency).classList.add('best');
//     });
// }


// // // Function to find all possible conversion paths using BFS
// // function findAllPaths(graph, start, end) {
// //     let queue = [[{ currency: start, rate: 1 }]];
// //     let allPaths = [];

// //     while (queue.length > 0) {
// //         let path = queue.shift();
// //         let lastNode = path[path.length - 1];

// //         if (lastNode.currency === end) {
// //             allPaths.push(path);
// //             continue;
// //         }

// //         for (let neighbor in graph[lastNode.currency]) {
// //             if (!path.some(node => node.currency === neighbor)) { // Avoid cycles
// //                 let newPath = [...path, { currency: neighbor, rate: lastNode.rate * graph[lastNode.currency][neighbor] }];
// //                 queue.push(newPath);
// //             }
// //         }
// //     }

// //     return allPaths;
// // }

// // // Function to get the best conversion path
// // function getBestConversionPath(paths) {
// //     let bestPath = null;
// //     let maxRate = 0;

// //     for (let path of paths) {
// //         let finalRate = path[path.length - 1].rate;
// //         if (finalRate > maxRate) {
// //             maxRate = finalRate;
// //             bestPath = path;
// //         }
// //     }

// //     return { bestPath, maxRate };
// // }

// // // Function to perform the conversion
// // function advConvertCurrency(amount, fromCurrency, toCurrency) {
// //     if (!amount || amount <= 0) {
// //         return "Invalid amount.";
// //     }

// //     let allPaths = findAllPaths(exchangeGraph, fromCurrency, toCurrency);
// //     let { bestPath, maxRate } = getBestConversionPath(allPaths);
// //     let convertedAmount = (amount * maxRate).toFixed(2);

// //     let resultText = "All Possible Paths:\n";
// //     for (let path of allPaths) {
// //         resultText += path.map(node => node.currency).join(" → ") + ` | Final Rate: ${path[path.length - 1].rate.toFixed(5)}\n`;
// //     }

// //     resultText += `\nBest Conversion Path: ${bestPath.map(node => node.currency).join(" → ")} | Best Rate: ${maxRate.toFixed(5)}\nFinal Amount: ${convertedAmount} ${toCurrency}`;

// //     return resultText;
// // }

// // // Test the function
// // console.log(advConvertCurrency(100, "USD", "INR"));

const exchangeGraph = {
    "USD": { "EUR": 0.85, "GBP": 0.75, "INR": 74.57 },
    "EUR": { "USD": 1.18, "GBP": 0.88, "INR": 88.30 },
    "GBP": { "USD": 1.33, "EUR": 1.14, "INR": 100.20 },
    "INR": { "USD": 0.013, "EUR": 0.011, "GBP": 0.010 },
    "JPY": { "USD": 0.0091, "EUR": 0.0078, "GBP": 0.0068 }
};

// Attach the proper event listener to the button
const btn = document.getElementById("fetch-adv-data");
btn.addEventListener("click", findPaths);

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

// Main function to find paths and display results
function findPaths() {
    // let from = document.getElementById("adv-fromCurrency").value;
    // let to = document.getElementById("adv-toCurrency").value;

    let from = "USD";
    let to = "INR";

    // Validate inputs
    if (!from || !to || from === to) {
        alert("Please select valid 'From' and 'To' currencies.");
        return;
    }

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
        pathList.appendChild(listItem);
    });

    // Highlight the best path
    let bestPath = allPaths[0];

    document.getElementById("bestPath").innerText = `Best Path: ${bestPath.path.join(" -> ")} | Cost : ${bestPath.cost.toFixed(2)}`;

    // Highlight nodes in the best path
    document.querySelectorAll('.node').forEach(node => node.classList.remove('highlight', 'best'));
    bestPath.path.forEach(currency => {
        document.getElementById(currency).classList.add('best');
    });
}
