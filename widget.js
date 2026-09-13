const wdaMessages = [];
const wdaChatContainer = document.getElementById('wdaChatContainer');
const wdaUserInput = document.getElementById('wdaUserInput');
const wdaSendBtn = document.getElementById('wdaSendBtn');
const WDA_API_ENDPOINT = 'https://thunderous-macaron-078eba.netlify.app/.netlify/functions/chat';

function wdaAddMessageToUI(role, text) {
  const div = document.createElement('div');
  div.className = 'wda-message ' + role;
  div.textContent = text;
  wdaChatContainer.appendChild(div);
  wdaChatContainer.scrollTop = wdaChatContainer.scrollHeight;
}
function wdaShowTyping() {
  const div = document.createElement('div');
  div.className = 'wda-message typing';
  div.id = 'wdaTypingIndicator';
  div.textContent = 'Thinking...';
  wdaChatContainer.appendChild(div);
  wdaChatContainer.scrollTop = wdaChatContainer.scrollHeight;
}
function wdaHideTyping() {
  const el = document.getElementById('wdaTypingIndicator');
  if (el) el.remove();
}
async function wdaSendMessage() {
  const text = wdaUserInput.value.trim();
  if (!text) return;
  wdaAddMessageToUI('user', text);
  wdaMessages.push({ role: 'user', content: text });
  wdaUserInput.value = '';
  wdaSendBtn.disabled = true;
  wdaShowTyping();
  try {
    const res = await fetch(WDA_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: wdaMessages }),
    });
    const data = await res.json();
    wdaHideTyping();
    if (!res.ok) {
      wdaAddMessageToUI('assistant', "Sorry, something went wrong on my end. Please try again in a moment.");
      return;
    }
    wdaAddMessageToUI('assistant', data.reply);
    wdaMessages.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    wdaHideTyping();
    wdaAddMessageToUI('assistant', "Sorry, I couldn't connect. Please check your connection and try again.");
  } finally {
    wdaSendBtn.disabled = false;
  }
}
wdaUserInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    wdaSendMessage();
  }
});
window.addEventListener('DOMContentLoaded', () => {
  const greeting = "Hey! I'm all ears — what's going on? To point you in the right direction, is this about:\n\n1. Building out a meal plan for your macros/calories\n2. Troubleshooting something like hunger, low energy, or a stalled week\n3. A fitness/form question\n\nOr just tell me what's up in your own words and we'll go from there.";
  wdaAddMessageToUI('assistant', greeting);
  wdaMessages.push({ role: 'assistant', content: greeting });
});
