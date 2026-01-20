// VERY small, well-tested handlers and dynamic flags (not literal in HTML)
function build(chars){ return chars.map(c=>String.fromCharCode(c)).join(''); }

const FLAGS = {
  SQLI: ()=>build([70,76,65,71,123,83,81,76,73,95,87,79,82,75,83,125]),      // FLAG{SQLI_WORKS}
  REFLECT: ()=>build([70,76,65,71,123,82,69,70,76,69,67,84,69,68,125]),       // FLAG{REFLECTED}
  DOM: ()=>build([70,76,65,71,123,68,79,77,95,88,83,83,125]),                // FLAG{DOM_XSS}
  LFI: ()=>build([70,76,65,71,123,76,70,73,95,83,72,79,87,78,125])          // FLAG{LFI_SHOWN}
};

// Helper: safely get URL params
const params = new URLSearchParams(location.search);

// ----------------------
// LFI-like page param
// ----------------------
if(params.get('page') === 'flag'){
  document.getElementById('content').innerHTML = '<p><strong>' + FLAGS.LFI() + '</strong></p>';
}

// ----------------------
// Reflected XSS (via ?q=)
// ----------------------
const q = params.get('q');
if(q){
  // intentionally vulnerable sink: reflect raw HTML
  document.getElementById('search-results').innerHTML = q;

  // reveal flag if a script/img payload (basic detection)
  if(q.toLowerCase().includes('<img') || q.toLowerCase().includes('<script') || q.toLowerCase().includes('onerror')){
    document.getElementById('search-results').innerHTML += '<p><strong>' + FLAGS.REFLECT() + '</strong></p>';
  }
}

// ----------------------
// DOM XSS via hash (#)
// ----------------------
if(location.hash){
  // take everything after # and inject into feedback-box (vulnerable)
  const payload = decodeURIComponent(location.hash.slice(1));
  document.getElementById('feedback-box').innerHTML = payload;

  if(payload.includes('<img') || payload.includes('<script') || payload.includes('onerror')){
    document.getElementById('feedback-box').innerHTML += '<p><strong>' + FLAGS.DOM() + '</strong></p>';
  }
}

// ----------------------
// SQLi simulation (form)
// ----------------------
document.getElementById('login-form').addEventListener('submit', function(e){
  e.preventDefault();
  const u = (e.target.u.value || '').toLowerCase();
  const p = (e.target.p.value || '').toLowerCase();

  // simple logic-based detection of classic payloads
  if(u.includes("'") || u.includes("or 1=1") || p.includes("'")){
    document.getElementById('login-out').innerText = FLAGS.SQLI();
  } else {
    document.getElementById('login-out').innerText = 'Login failed';
  }
});

// ----------------------
// Stored-like feedback (basic)
// ----------------------
document.getElementById('feedback-form').addEventListener('submit', function(e){
  e.preventDefault();
  const m = e.target.m.value || '';
  // append unsanitized (so if a user injects <script> it will execute when rendered)
  const box = document.getElementById('feedback-box');
  box.innerHTML += '<p>' + m + '</p>';
});
