const CONTACT_API_BASE = 'https://offjdeutxvcrybniftyl.supabase.co/functions/v1';

function setMessage(element, text, type = '') {
  if (!element) return;
  element.textContent = text;
  element.className = `contact-status ${type}`.trim();
}

function formatContactDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
}

async function callContactFunction(name, payload) {
  const response = await fetch(`${CONTACT_API_BASE}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Layanan belum dapat diakses.');
  return data;
}

function saveTicketAccess(code, token) {
  localStorage.setItem('kb3_contact_ticket_code', code);
  localStorage.setItem('kb3_contact_access_token', token);
}

function loadSavedTicketAccess() {
  return {
    code: localStorage.getItem('kb3_contact_ticket_code') || '',
    token: localStorage.getItem('kb3_contact_access_token') || ''
  };
}

function renderTicket(ticket) {
  const target = document.querySelector('[data-ticket-result]');
  if (!target) return;
  const replies = (ticket.replies || []).map(reply => `
    <div class="reply-item">
      <div class="reply-meta"><strong>${reply.author_name || 'Admin Website'}</strong><span>${formatContactDate(reply.created_at)}</span></div>
      <p>${String(reply.message || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</p>
    </div>`).join('');
  target.innerHTML = `
    <div class="ticket-summary">
      <div><span>Kode tiket</span><strong>${ticket.ticket_code}</strong></div>
      <div><span>Status</span><strong>${ticket.status}</strong></div>
      <div><span>Kategori</span><strong>${ticket.category}</strong></div>
      <div><span>Dikirim</span><strong>${formatContactDate(ticket.created_at)}</strong></div>
    </div>
    <div class="ticket-message"><h3>${ticket.subject}</h3><p>${String(ticket.message || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</p></div>
    <div class="ticket-replies"><h3>Balasan Admin</h3>${replies || '<p class="empty-replies">Belum ada balasan dari admin website.</p>'}</div>`;
  target.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  const sendForm = document.querySelector('[data-contact-send]');
  const sendStatus = document.querySelector('[data-send-status]');
  const successBox = document.querySelector('[data-send-success]');

  sendForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = sendForm.querySelector('button[type="submit"]');
    button.disabled = true;
    setMessage(sendStatus, 'Mengirim pesan...');
    successBox.hidden = true;
    const form = new FormData(sendForm);
    try {
      const data = await callContactFunction('submit-contact-ticket', {
        sender_name: form.get('sender_name'),
        sender_role: form.get('sender_role'),
        category: form.get('category'),
        subject: form.get('subject'),
        message: form.get('message'),
        website: form.get('website')
      });
      saveTicketAccess(data.ticket_code, data.access_token);
      successBox.innerHTML = `<h3>Pesan berhasil dikirim</h3><p>Simpan kode tiket berikut untuk referensi:</p><div class="ticket-code">${data.ticket_code}</div><p>Akses privat tiket sudah disimpan pada browser ini. Gunakan tombol <strong>Cek Pesan & Balasan</strong> di bawah untuk melihat status atau balasan admin.</p>`;
      successBox.hidden = false;
      setMessage(sendStatus, 'Pesan berhasil diterima sekolah.', 'success');
      sendForm.reset();
      const checkCode = document.querySelector('[name="ticket_code"]');
      if (checkCode) checkCode.value = data.ticket_code;
    } catch (error) {
      setMessage(sendStatus, error.message || 'Pesan gagal dikirim.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  const checkForm = document.querySelector('[data-contact-check]');
  const checkStatus = document.querySelector('[data-check-status]');
  const saved = loadSavedTicketAccess();
  const codeInput = checkForm?.querySelector('[name="ticket_code"]');
  if (codeInput && saved.code) codeInput.value = saved.code;

  checkForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = checkForm.querySelector('button[type="submit"]');
    const code = String(new FormData(checkForm).get('ticket_code') || '').trim().toUpperCase();
    const stored = loadSavedTicketAccess();
    if (!stored.token || !stored.code || stored.code.toUpperCase() !== code) {
      setMessage(checkStatus, 'Kode tiket ini tidak tersimpan pada browser ini. Gunakan perangkat/browser yang dipakai saat mengirim pesan.', 'error');
      return;
    }
    button.disabled = true;
    setMessage(checkStatus, 'Memuat tiket...');
    try {
      const data = await callContactFunction('get-contact-ticket', { ticket_code: code, access_token: stored.token });
      renderTicket(data.ticket);
      setMessage(checkStatus, 'Tiket berhasil dimuat.', 'success');
    } catch (error) {
      setMessage(checkStatus, error.message || 'Tiket tidak dapat dimuat.', 'error');
    } finally {
      button.disabled = false;
    }
  });
});