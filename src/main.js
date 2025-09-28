// GameBet 2.0 - Games Loading and Betting Functionality
const gamesContainer = document.getElementById("games");
// Get token from localStorage (let to avoid conflict with auth.js)
let authToken = localStorage.getItem("token");

// Primary games API endpoint (local)
const LOCAL_GAMES_API = "http://localhost:3000/api/games";
// External games API endpoint (integration target)
const EXTERNAL_GAMES_API = "https://game-bet-fix-sbuff6912.replit.app/games";

async function loadGames() {
    if (!authToken) {
        console.log("No authentication token found");
        return;
    }

    try {
        let games = [];
        
        // Try to fetch from external API first (integration target)
        try {
            console.log("Attempting to fetch games from external API...");
            const externalResponse = await fetch(EXTERNAL_GAMES_API);
            if (externalResponse.ok) {
                const externalGames = await externalResponse.json();
                if (Array.isArray(externalGames) && externalGames.length > 0) {
                    games = externalGames;
                    console.log("Successfully loaded games from external API:", games.length);
                }
            }
        } catch (error) {
            console.log("External API not available, falling back to local:", error.message);
        }
        
        // Fallback to local API if external fails
        if (games.length === 0) {
            console.log("Fetching games from local API...");
            const localResponse = await fetch(LOCAL_GAMES_API);
            if (localResponse.ok) {
                games = await localResponse.json();
                console.log("Successfully loaded games from local API:", games.length);
            } else {
                throw new Error("Failed to fetch games from local API");
            }
        }
        
        // Clear existing games
        gamesContainer.innerHTML = "";
        
        // Render games
        games.forEach(game => {
            const gameElement = document.createElement("div");
            gameElement.classList.add("game");
            gameElement.innerHTML = `
                <img src="${game.image}" alt="${game.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7Z2FtZS50aXRsZX08L3RleHQ+PC9zdmc+'">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <p>Odds: ${game.odds}</p>
                <div class="bet-container">
                    <input type="number" class="bet-amount" placeholder="Enter bet amount" min="1" step="0.01">
                    <button class="bet-button" data-game-id="${game.id}">Place Bet</button>
                </div>
            `;
            gamesContainer.appendChild(gameElement);
        });
        
        // Add event listeners for betting
        setupBettingHandlers();
        
    } catch (error) {
        console.error("Error loading games:", error);
        gamesContainer.innerHTML = `
            <div class="error-message">
                <h3>Unable to load games</h3>
                <p>Please try refreshing the page. If the problem persists, contact support.</p>
                <button onclick="loadGames()">Retry</button>
            </div>
        `;
    }
}

function setupBettingHandlers() {
    document.querySelectorAll(".bet-button").forEach(button => {
        button.addEventListener("click", async (event) => {
            const gameId = event.target.getAttribute("data-game-id");
            const amountInput = event.target.previousElementSibling;
            const amount = parseFloat(amountInput.value);
            
            if (!amount || amount <= 0) {
                alert("Please enter a valid bet amount.");
                return;
            }
            
            // Disable button during request
            button.disabled = true;
            button.textContent = "Placing...";
            
            try {
                const response = await fetch("http://localhost:3000/api/bets", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        gameId: parseInt(gameId),
                        amount: amount
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message || "Bet placed successfully!");
                    amountInput.value = ""; // Clear the input
                } else {
                    alert(result.message || "Failed to place bet");
                }
            } catch (error) {
                console.error("Error placing bet:", error);
                alert("Error placing bet. Please try again.");
            } finally {
                // Re-enable button
                button.disabled = false;
                button.textContent = "Place Bet";
            }
        });
    });
}

// Load games when authenticated
if (authToken) {
    loadGames();
}