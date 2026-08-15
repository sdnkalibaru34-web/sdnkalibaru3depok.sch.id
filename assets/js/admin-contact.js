const ADMIN_API = 'https://offjdeutxvcrybniftyl.supabase.co/functions/v1/admin-contact-tickets';
const TOKEN_KEY = 'kb3_contact_admin_token';

const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = (value) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-';
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let token = localStorage.getItem(TOKEN_KEY) || '';
let currentId = '';

async function api(payload) {
  const response = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Permintaan gagal');
  return data;
}

function setAuthState(authenticated) {
  qs('#admin-login').hidden = authenticated;
  qs('#admin-app').hidden = !authenticated;
}

async function login() {
  const value = qs('#admin-token').value.trim();
  if (!value) return;
  token = value;
  try {
    await api({ action: 'list' });
    localStorage.setItem(TOKEN_KEY, token);
    qs('#admin-token').value = '';
    qs('#login-error').textContent = '';
    setAuthState(true);
    await loadTickets();
  } catch (error) {
    token = '';
    localStorage.removeItem(TOKEN_KEY);
    qs('#login-error').textContent = 'Token admin tidak valid.';
  }
}

function logout() {
  token = '';
  currentId = '';
  localStorage.removeItem(TOKEN_KEY);
  setAuthState(false);
}

async function loadTickets() {
  const status = qs('#status-filter').value;
  qs('#ticket-list').innerHTML = '<div class="admin-empty">Memuat tiket...</div>';
  try {
    const { tickets } = await api({ action: 'list', status });
    qs('#ticket-count').textContent = `${tickets.length} tiket`;
    qs('#ticket-list').innerHTML = tickets.length ? tickets.map(item => `
      <button class="admin-ticket-item${item.id===currentId?' active':''}" data-id="${esc(item.id)}" type="button">
        <div class="admin-ticket-top"><strong>${esc(item.ticket_code)}</strong><span class="admin-status status-${esc(item.status.toLowerCase())}">${esc(item.status)}</span></div>
        <h3>${esc(item.subject)}</h3>
        <p>${esc(item.sender_name)} · ${esc(item.category)}</p>
        <small>${esc(fmt(item.created_at))}</small>
      </button>`).join('') : '<div class="admin-empty">Belum ada tiket pada filter ini.</div>';
    qsa('.admin-ticket-item').forEach(btn => btn.addEventListener('click', () => openTicket(btn.dataset.id)));
  } catch (error) {
    if (String(error.message).toLowerCase().includes('unauthorized')) return logout();
    qs('#ticket-list').innerHTML = `<div class="admin-empty">${esc(error.message)}</div>`;
  }
}

async function openTicket(id) {
  currentId = id;
  qsa('.admin-ticket-item').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  qs('#ticket-detail').innerHTML = '<div class="admin-empty">Memuat detail...</div>';
  try {
    const { ticket, replies, faq } = await api({ action: 'detail', id });
    const latestReply = replies.length ? replies[replies.length - 1].message : '';
    const faqQuestion = faq?.question || ticket.subject;
    const faqAnswer = faq?.answer || latestReply;
    const faqPublished = Boolean(faq?.is_published);

    qs('#ticket-detail').innerHTML = `
      <div class="admin-detail-head">
        <div><div class="section-label">${esc(ticket.ticket_code)}</div><h2>${esc(ticket.subject)}</h2></div>
        <select id="ticket-status" class="admin-select">
          ${['Baru','Diproses','Dijawab','Selesai'].map(s => `<option ${s===ticket.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="admin-meta"><span><strong>Pengirim:</strong> ${esc(ticket.sender_name)}</span><span><strong>Sebagai:</strong> ${esc(ticket.sender_role)}</span><span><strong>Kategori:</strong> ${esc(ticket.category)}</span><span><strong>Dikirim:</strong> ${esc(fmt(ticket.created_at))}</span></div>
      <div class="admin-message visitor-message"><div class="admin-message-label">Pesan pengunjung</div><p>${esc(ticket.message).replace(/\n/g,'<br>')}</p></div>
      <div class="admin-thread">
        ${replies.length ? replies.map(reply => `<div class="admin-message admin-reply"><div class="admin-message-label">${esc(reply.author_name)} · ${esc(fmt(reply.created_at))}</div><p>${esc(reply.message).replace(/\n/g,'<br>')}</p></div>`).join('') : '<div class="admin-empty compact">Belum ada balasan.</div>'}
      </div>
      <form id="reply-form" class="admin-reply-form">
        <label>Nama admin<input id="reply-author" value="Admin Website" maxlength="100"></label>
        <label>Balasan<textarea id="reply-message" rows="5" maxlength="5000" required placeholder="Tulis balasan kepada pengunjung..."></textarea></label>
        <div class="admin-actions"><button class="button" type="submit">Kirim Balasan →</button><span id="reply-status" class="admin-inline-status"></span></div>
      </form>
      <section class="admin-faq-box">
        <div class="admin-faq-head"><div><div class="section-label">Tanya Jawab Publik</div><h3>${faqPublished ? 'Sudah dipublikasikan' : 'Publikasikan sebagai Tanya Jawab'}</h3></div>${faqPublished ? '<span class="admin-faq-badge">Publik</span>' : ''}</div>
        <p class="admin-muted">Edit terlebih dahulu agar nama pengirim, data siswa, atau informasi pribadi tidak ikut tampil ke publik.</p>
        <div class="admin-faq-form">
          <label>Pertanyaan publik<input id="faq-question" maxlength="300" value="${esc(faqQuestion)}" placeholder="Contoh: Bagaimana cara mengakses Jurnal 7 KAIH?"></label>
          <label>Jawaban publik<textarea id="faq-answer" rows="5" maxlength="5000" placeholder="Tulis jawaban yang aman untuk ditampilkan kepada publik...">${esc(faqAnswer)}</textarea></label>
          <div class="admin-actions">
            <button id="faq-publish" class="button" type="button">${faqPublished ? 'Simpan Perubahan' : 'Publikasikan sebagai Tanya Jawab'} →</button>
            ${faqPublished ? '<button id="faq-unpublish" class="button admin-logout" type="button">Batalkan Publikasi</button>' : ''}
            <span id="faq-status" class="admin-inline-status"></span>
          </div>
        </div>
      </section>`;

    qs('#ticket-status').addEventListener('change', async (e) => {
      await api({ action: 'status', id, status: e.target.value });
      await loadTickets();
    });

    qs('#reply-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = qs('#reply-message').value.trim();
      const author_name = qs('#reply-author').value.trim() || 'Admin Website';
      if (!message) return;
      const status = qs('#reply-status');
      status.textContent = 'Mengirim...';
      try {
        await api({ action: 'reply', id, message, author_name });
        status.textContent = 'Balasan terkirim.';
        await openTicket(id);
        await loadTickets();
      } catch (error) { status.textContent = error.message; }
    });

    qs('#faq-publish').addEventListener('click', async () => {
      const question = qs('#faq-question').value.trim();
      const answer = qs('#faq-answer').value.trim();
      const status = qs('#faq-status');
      if (!question || !answer) {
        status.textContent = 'Pertanyaan dan jawaban publik wajib diisi.';
        return;
      }
      status.textContent = 'Menyimpan...';
      try {
        await api({ action: faq ? 'update_faq' : 'publish_faq', id, question, answer });
        status.textContent = 'Tanya jawab berhasil dipublikasikan.';
        await openTicket(id);
      } catch (error) { status.textContent = error.message; }
    });

    qs('#faq-unpublish')?.addEventListener('click', async () => {
      const status = qs('#faq-status');
      status.textContent = 'Membatalkan publikasi...';
      try {
        await api({ action: 'unpublish_faq', id });
        status.textContent = 'Publikasi dibatalkan.';
        await openTicket(id);
      } catch (error) { status.textContent = error.message; }
    });
  } catch (error) {
    qs('#ticket-detail').innerHTML = `<div class="admin-empty">${esc(error.message)}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  qs('#admin-login-form').addEventListener('submit', e => { e.preventDefault(); login(); });
  qs('#admin-logout').addEventListener('click', logout);
  qs('#status-filter').addEventListener('change', loadTickets);
  qs('#refresh-tickets').addEventListener('click', loadTickets);

  if (token) {
    try {
      await api({ action: 'list' });
      setAuthState(true);
      await loadTickets();
    } catch {
      logout();
    }
  } else setAuthState(false);
});