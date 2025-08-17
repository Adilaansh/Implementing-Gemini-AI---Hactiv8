const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
let thinkingMessage = null; // Track the "Thinking..." message

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return; // Don't send empty messages

  appendMessage('user', userMessage);
  input.value = '';

  // Add "Thinking..." message
  thinkingMessage = appendMessage('bot', 'Thinking...');

  // Send message to backend
  sendMessageToBackend(userMessage);
});

async function sendMessageToBackend(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.output) {
      // Replace "Thinking..." with the actual response
      thinkingMessage.textContent = data.output;
    } else {
      handleError('Sorry, no response received.');
    }
  } catch (error) {
    console.error('Error:', error);
    handleError('Failed to get response from server.');
  }
}

function handleError(errorMessage) {
  if (thinkingMessage) {
    thinkingMessage.textContent = errorMessage; // Update "Thinking..." message
  } else {
    appendMessage('bot', errorMessage); // If no "Thinking..." message, just add a new one
  }
}
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
