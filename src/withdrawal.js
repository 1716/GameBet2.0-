document.addEventListener("DOMContentLoaded", () => {
	const methodSelect = document.getElementById("withdrawal-method");
	const detailsDiv = document.getElementById("withdrawal-details");
	const form = document.getElementById("withdrawal-form");

	if (!methodSelect || !detailsDiv || !form) {
		console.error("⚠️ Withdrawal elements not found in DOM.");
		return;
	}

	methodSelect.addEventListener("change", () => {
		detailsDiv.innerHTML = "";
		switch (methodSelect.value) {
			case "cash-app":
				detailsDiv.innerHTML = `
					<label for="cashtag">Cash App $Cashtag:</label>
					<input type="text" id="cashtag" name="cashtag" required>
				`;
				break;
			case "paypal":
				detailsDiv.innerHTML = `
					<label for="paypal-email">PayPal Email:</label>
					<input type="email" id="paypal-email" name="paypal-email" required>
				`;
				break;
			case "debit-bank":
				detailsDiv.innerHTML = `
					<label for="account-number">Account Number:</label>
					<input type="text" id="account-number" name="account-number" required>
					<label for="routing-number">Routing Number:</label>
					<input type="text" id="routing-number" name="routing-number" required>
					<label for="account-type">Account Type:</label>
					<select id="account-type" name="account-type">
						<option value="checking">Checking</option>
						<option value="savings">Savings</option>
					</select>
				`;
				break;
		}
	});

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		console.log("🏗️ Withdrawal Data:", data);
		alert("Withdrawal request submitted!");
	});

	methodSelect.dispatchEvent(new Event("change"));
});