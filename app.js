document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.querySelector('.chat-history');
    const userInput = document.querySelector('#user-input');
    const sendButton = document.querySelector('#send-button');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') {
            return;
        }

        userInput.value = '';
        displayMessage(userMessage, true);

        displayMessage("Loading your answer... \n It might take up to 10 seconds", false, true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB9Ef8dOo5VIzQ_B2Mp0NdgY0Bl1fbUnPw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            });

            const data = await response.json();
            updateLastMessage(data["candidates"][0]["content"]["parts"][0]["text"]);
        } catch (error) {
            console.error(error);
            updateLastMessage("Sorry - Something went wrong. Please try again!");
        }
    }

    function displayMessage(message, isUserMessage = false, isLoading = false) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message', isUserMessage ? 'user-message' : 'chatgpt-message');
        if (isLoading) {
            messageElement.classList.add('loading-message');
        }
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function updateLastMessage(message) {
        const lastMessage = document.querySelector('.loading-message');
        if (lastMessage) {
            lastMessage.textContent = message;
            lastMessage.classList.remove('loading-message');
        }
    }
});
