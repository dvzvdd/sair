let selectedDate = '';
let selectedCategory = 'Comida';
let selectedChoice = '';
let userNotes = '';

const ADMIN_PASSWORD = 'k9#mQ2!vL8$xP4&zN7*wT1@yR5^bC3~fK9%dJ2#hM6!pS8&vZ4*xN1@qW7$yL3^tR8~cK2%mP5#vJ9!zT4&xN7*wQ1@yR6^bC2~fL8%dJ3#hM5!pS7&vZ1*xN9@qW4$yL2^tR6~cK8%mP1#vJ7!zT3';

const targetPhoneNumber = '5531991862668';

const progressFill = document.getElementById('progressFill');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const stepFinal = document.getElementById('stepFinal');

const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const btnGoToStep3 = document.getElementById('btnGoToStep3');
const btnBackToStep2 = document.getElementById('btnBackToStep2');
const btnConfirm = document.getElementById('btnConfirm');
const btnWhatsapp = document.getElementById('btnWhatsapp');

const datetimeInput = document.getElementById('datetimeInput');
const obsInput = document.getElementById('obsInput');
const optionCards = document.querySelectorAll('.option-card, .food-card');

const btnOpenAdmin = document.getElementById('btnOpenAdmin');
const btnCloseAdmin = document.getElementById('btnCloseAdmin');
const adminModal = document.getElementById('adminModal');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const btnLoginAdmin = document.getElementById('btnLoginAdmin');
const responsesContainer = document.getElementById('responsesContainer');
const btnClearResponses = document.getElementById('btnClearResponses');

function moveNoButton() {
  const margin = 20;
  const btnWidth = btnNo.offsetWidth || 80;
  const btnHeight = btnNo.offsetHeight || 40;

  const maxX = window.innerWidth - btnWidth - margin;
  const maxY = window.innerHeight - btnHeight - margin;

  const randomX = Math.floor(Math.random() * (maxX - margin)) + margin;
  const randomY = Math.floor(Math.random() * (maxY - margin)) + margin;

  btnNo.style.position = 'fixed';
  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
}

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('click', (e) => { e.preventDefault(); moveNoButton(); });
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });

btnYes.addEventListener('click', () => {
  step1.classList.add('hidden');
  step2.classList.remove('hidden');
  if (progressFill) progressFill.style.width = '66.66%';
});

btnGoToStep3.addEventListener('click', () => {
  if (!datetimeInput.value) {
    alert('Por favor, escolha uma data e hora para o nosso encontro!');
    return;
  }
  
  const dt = new Date(datetimeInput.value);
  selectedDate = dt.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  step2.classList.add('hidden');
  step3.classList.remove('hidden');
  if (progressFill) progressFill.style.width = '100%';
});

btnBackToStep2.addEventListener('click', () => {
  step3.classList.add('hidden');
  step2.classList.remove('hidden');
  if (progressFill) progressFill.style.width = '66.66%';
});

optionCards.forEach(card => {
  card.addEventListener('click', () => {
    optionCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedCategory = card.getAttribute('data-category') || 'Comida';
    selectedChoice = card.getAttribute('data-value') || card.getAttribute('data-food');
  });
});

btnConfirm.addEventListener('click', () => {
  if (!selectedChoice) {
    alert('Por favor, selecione uma opção de comida!');
    return;
  }

  userNotes = obsInput.value.trim() || 'Nenhuma observação especial.';

  const responseData = {
    date: selectedDate,
    choice: selectedChoice,
    notes: userNotes,
    timestamp: new Date().toLocaleString('pt-BR')
  };

  saveResponseLocal(responseData);

  saveResponseToCloud(responseData);

  step3.classList.add('hidden');
  stepFinal.classList.remove('hidden');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
});

btnWhatsapp.addEventListener('click', () => {
  const textMsg = `Aceitei o convite!\n\nData: ${selectedDate}\nComida: ${selectedChoice}\nObs: ${userNotes}`;
  
  const encodedText = encodeURIComponent(textMsg);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhoneNumber}&text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank');
});

function saveResponseLocal(data) {
  let responses = JSON.parse(localStorage.getItem('invite_responses') || '[]');
  responses.unshift(data);
  localStorage.setItem('invite_responses', JSON.stringify(responses));
}

function saveResponseToCloud(data) {
}

btnOpenAdmin.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
});

btnCloseAdmin.addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

btnLoginAdmin.addEventListener('click', () => {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    adminLoginView.classList.add('hidden');
    adminDashboardView.classList.remove('hidden');
    renderResponses();
  } else {
    alert('Senha incorreta!');
  }
});

function renderResponses() {
  const responses = JSON.parse(localStorage.getItem('invite_responses') || '[]');
  responsesContainer.innerHTML = '';

  if (responses.length === 0) {
    responsesContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhuma resposta registrada ainda.</p>';
    return;
  }

  responses.forEach(res => {
    const card = document.createElement('div');
    card.className = 'response-card';
    card.innerHTML = `
      <div class="response-time">Recebido em: ${res.timestamp}</div>
      <div><strong>📅 Data:</strong> ${res.date}</div>
      <div><strong>🍽️ Opção:</strong> ${res.choice}</div>
      <div><strong>📝 Obs:</strong> ${res.notes}</div>
    `;
    responsesContainer.appendChild(card);
  });
}

btnClearResponses.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja apagar o histórico de respostas?')) {
    localStorage.removeItem('invite_responses');
    renderResponses();
  }
});