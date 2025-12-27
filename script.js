// 1. GRAB THE ELEMENTS
const input = document.getElementById("cityInput");
const findBtn = document.getElementById("findBtn");
const resetBtn = document.getElementById("resetBtn");
const resultDisplay = document.getElementById("resultDisplay");
const dateFilter = document.getElementById("dateFilter");

// 2. THE BRAIN: Fetching from GNews (Mobile Friendly)
async function fetchNews(query) {
    const apiKey = 'c3cc2121852acc00fcde0ae590bb51cf'; // <--- PASTE YOUR GNEWS KEY HERE
    
    // We'll use the query and the filter settings
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=5&apikey=${apiKey}`;

    try {
        // Show loading state
        resultDisplay.innerHTML = `
            <div class="placeholder-text">
                <p>Verifying with global satellites...</p>
                <div class="loading-spinner"></div>
            </div>`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Limit or Key Error (${response.status})`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            resultDisplay.innerHTML = "<p class='placeholder-text'>No verified reports found for this topic.</p>";
        }
    } catch (error) {
        resultDisplay.innerHTML = `<p class='placeholder-text' style="color: #ff4444;">Signal Error: ${error.message}</p>`;
        console.error("Hackathon Debug Log:", error);
    }
}

// 3. THE UI BUILDER: Creating the News Cards
function displayNews(articles) {
    resultDisplay.innerHTML = ""; // Clear loading text

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";

        // We use article.image (GNews specific) and article.url
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300x150?text=No+Image+Available'}" alt="News">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description ? article.description.substring(0, 100) + "..." : "Tap 'Read More' for full verification details."}</p>
                <div class="card-footer">
                    <span>${article.source.name}</span>
                    <button class="share-btn" onclick="window.open('${article.url}', '_blank')">Read More</button>
                </div>
            </div>
        `;
        resultDisplay.appendChild(card);
    });
}

// 4. THE LISTENERS (Event Handling)
findBtn.addEventListener("click", () => {
    const topic = input.value.trim();
    if (topic !== "") {
        fetchNews(topic);
    } else {
        alert("Enter a topic or city first!");
    }
});

resetBtn.addEventListener("click", () => {
    input.value = "";
    resultDisplay.innerHTML = '<div class="placeholder-text"><p>Waiting for a topic...</p></div>';
});

// Optional: Allow "Enter" key to trigger search
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        findBtn.click();
    }
});