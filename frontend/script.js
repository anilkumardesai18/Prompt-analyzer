document.getElementById('analyze-btn').addEventListener('click', () => {
    const promptText = document.getElementById('prompt-input').value;
    if (!promptText) {
        alert("Please enter a prompt to analyze.");
        return;
    }

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = '<p>🧠 Contacting analysis engine...</p>';

    callBackendAPI(promptText)
        .then(analysisResult => {
            if(analysisResult) renderResults(analysisResult);
        });
});

function callBackendAPI(prompt) {
    const backendUrl = 'http://localhost:3000/analyze';
    return fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error calling backend:', error);
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = `<div class="feedback-item critical">⚠️ **Connection Error:** Could not connect to the analysis engine. Is the backend server running?</div>`;
        return null;
    });
}

function renderResults(result) {
    const container = document.getElementById('results-container');

    let categoryHTML = '';
    for (const category in result.categoryScores) {
        const catPercentage = result.categoryScores[category];
        let barColor = catPercentage > 75 ? '#4CAF50' : (catPercentage > 40 ? '#FFC107' : '#F44336');
        categoryHTML += `
            <div class="category">
                <p>${category.charAt(0).toUpperCase() + category.slice(1)}: ${catPercentage}%</p>
                <div class="bar" style="width: ${catPercentage}%; background-color: ${barColor};"></div>
            </div>
        `;
    }

    let feedbackHTML = '';
    if(result.feedback.critical) feedbackHTML += `<div class="feedback-item critical">⚠️ **Critical Issue:** ${result.feedback.critical}</div>`;
    if(result.feedback.suggestion) feedbackHTML += `<div class="feedback-item suggestion">💡 **Suggestion:** ${result.feedback.suggestion}</div>`;
    if(result.feedback.strength) feedbackHTML += `<div class="feedback-item strength">✅ **Strength:** ${result.feedback.strength}</div>`;

    container.innerHTML = `
        <div class="overall-score">
            <h3>Overall Score: ${result.overallPercentage}% - ${result.rating}</h3>
            <progress value="${result.overallPercentage}" max="100"></progress>
        </div><hr>
        <div class="category-breakdown"><h4>Category Breakdown</h4>${categoryHTML}</div><hr>
        <div class="feedback-section"><h4>Actionable Feedback</h4>${feedbackHTML}</div>
    `;
}