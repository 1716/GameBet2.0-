
document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const walletContainer = document.getElementById('wallet-container');
    const balance = document.getElementById('balance');
    const withdrawalForm = document.getElementById('withdrawal-form');
    const withdrawalStatus = document.getElementById('withdrawal-status');

    // Show the wallet when the user is logged in
    authContainer.addEventListener('auth-change', (e) => {
        if (e.detail.isLoggedIn) {
            walletContainer.style.display = 'block';
            fetchBalance();
        } else {
            walletContainer.style.display = 'none';
        }
    });

    async function fetchBalance() {
        try {
            const response = await fetch('/api/balance');
            const data = await response.json();
            balance.textContent = data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            balance.textContent = 'Error';
        }
    }

    withdrawalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('withdrawal-amount').value;
        const method = document.getElementById('withdrawal-method').value;

        try {
            const response = await fetch('/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, method })
            });

            const data = await response.json();

            if (response.ok) {
                withdrawalStatus.textContent = data.message;
                fetchBalance(); // Refresh the balance
            } else {
                withdrawalStatus.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            console.error('Error during withdrawal:', error);
            withdrawalStatus.textContent = 'An unexpected error occurred.';
        }
    });
});
