const currencyUrl = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert';
const newsUrl = 'https://reuters-business-and-financial-news.p.rapidapi.com/articles-by-trends/2024-01-31/0/20';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'cf869b96ccmsh4649f482b7e8d53p1c262djsn410e87dafe40',
		'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
	}
};

async function convertCurrency() {
	const amount = document.getElementById('amount').value;
	const fromCurrency = document.getElementById('fromCurrency').value;
	const toCurrency = document.getElementById('toCurrency').value;
	const query = `?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
	
	try {
		const response = await fetch(currencyUrl + query, options);
		const result = await response.json();
		document.getElementById('result').innerText = `Converted Amount: ${result.result}`;
	} catch (error) {
		console.error(error);
		document.getElementById('result').innerText = 'Error converting currency';
	}
}

async function fetchNews() {
	const newsOptions = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': 'cf869b96ccmsh4649f482b7e8d53p1c262djsn410e87dafe40',
			'x-rapidapi-host': 'reuters-business-and-financial-news.p.rapidapi.com'
		}
	};

	try {
		const response = await fetch(newsUrl, newsOptions);
		const result = await response.json();
		displayNews(result);
	} catch (error) {
		console.error(error);
		document.getElementById('news').innerText = 'Error fetching news';
	}
}

// const new_articles = {
// 	1: "https://www.wsj.com/finance/banking/new-york-community-bancorp-stock-plunges-35-reigniting-fears-for-regional-banks-7bf74972"
// 	2: "https://www.reuters.com/legal/government/judge-blocks-california-requiring-background-checks-buy-ammunition-2024-01-31/"
// 	3: "https://www.reuters.com/legal/government/judge-blocks-california-requiring-background-checks-buy-ammunition-2024-01-31/"
// }

function displayNews(newsData) {
    console.log(newsData)
	const newsContainer = document.getElementById('news');
	newsData.articles.forEach(article => {
		const articleElement = document.createElement('div');
		articleElement.className = 'article';
		articleElement.innerHTML = `<div class="article-element"><h2>${article.articlesName}</h2><p>${article.articlesShortDescription}</p></div>`;
		newsContainer.appendChild(articleElement);
	});
}

fetchNews();