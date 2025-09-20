
const gamesContainer = document.getElementById('games');
const token = localStorage.getItem('token');

if (token) {
    fetch('http://localhost:3000/api/games')
        .then(response => response.json())
        .then(games => {
            games.forEach(game => {
                const gameElement = document.createElement('div');
                gameElement.classList.add('game');
                gameElement.innerHTML = `
                    <img src="${game.image}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <p>Odds: ${game.odds}</p>
                    <div class="bet-container">
                        <input type="number" class="bet-amount" placeholder="Enter bet amount">
                        <button class="bet-button" data-game-id="${game.id}">Place Bet</button>
                    </div>
                `;
                gamesContainer.appendChild(gameElement);
            });

            document.querySelectorAll('.bet-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const gameId = e.target.getAttribute('data-game-id');
                    const amount = e.target.previousElementSibling.value;

                    if (!amount || amount <= 0) {
                        alert('Please enter a valid bet amount.');
                        return;
                    }

                    fetch('http://localhost:3000/api/bets', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ gameId, amount })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                    });
                });
            });
        });
}
