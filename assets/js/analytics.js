(() => {
  if (document.body?.classList.contains('admin-page') || window.location.pathname.includes('/halaman/admin')) return;
  const endpoint = 'https://offjdeutxvcrybniftyl.supabase.co/functions/v1/track-site-visit';
  const key = 'kb3_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  const path = window.location.pathname;
  fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({visitor_id: visitorId, path}),
    keepalive: true
  }).catch(() => {});
})();
