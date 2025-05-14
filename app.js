// منطق الدردشة وربط النماذج مع Puter.js
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const modelSelect = document.getElementById('modelSelect');
const sendBtn = document.getElementById('sendBtn');

function showPuterError(msg) {
  const errorDiv = document.createElement('div');
  errorDiv.style.background = '#ffbaba';
  errorDiv.style.color = '#7c0000';
  errorDiv.style.padding = '12px 18px';
  errorDiv.style.borderRadius = '8px';
  errorDiv.style.margin = '18px 32px 0 32px';
  errorDiv.style.fontSize = '1.05rem';
  errorDiv.style.textAlign = 'right';
  errorDiv.style.border = '1px solid #ff8a8a';
  errorDiv.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)';
  errorDiv.innerHTML = '<b>خطأ:</b> ' + msg;
  document.querySelector('.main').prepend(errorDiv);
}

if (typeof window.puter === 'undefined' || !window.puter.ai) {
  showPuterError('لم يتم تحميل مكتبة Puter.js بشكل صحيح. تأكد من تشغيل الصفحة عبر خادم HTTPS أو GitHub Pages، أو تحقق من اتصال الإنترنت.');
}

function addMessage(text, sender = 'user', streaming = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = sender === 'user' ? 'أنت' : 'Claude';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = text;
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  userInput.value = '';
  sendBtn.disabled = true;
  const userBubble = addMessage(text, 'user');
  const model = modelSelect.value;
  const aiBubble = addMessage('<span style="color:#aaa">جاري الكتابة...</span>', 'ai', true);
  let aiText = '';
  try {
    const response = await puter.ai.chat(text, {model: model, stream: true});
    for await (const part of response) {
      aiText += part?.text || '';
      aiBubble.innerHTML = aiText.replace(/\n/g, '<br>');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    if (!aiText) aiBubble.innerHTML = '<span style="color:#f66">لم يتم الحصول على رد.</span>';
  } catch (err) {
    aiBubble.innerHTML = '<span style="color:#f66">حدث خطأ أثناء الاتصال بالنموذج.</span>';
  }
  sendBtn.disabled = false;
  userInput.focus();
});