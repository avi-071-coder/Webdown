const API = 'http://127.0.0.1:5000',
      $ = id => document.getElementById(id),
      state = { id: null, theme: 'blog' };

const setTheme = () => {
    document.body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
};

const call = async (url, method = 'GET', body) =>
    fetch(API + url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body && { body: JSON.stringify(body) })
    })
    .then(r => r.ok ? r.json() : null)
    .catch(() => null);

document.addEventListener('DOMContentLoaded', () => {
    const e = $('editor');
    ['focus', 'blur'].forEach(t => {
        e.addEventListener(t, () => {
            e.value.includes('Write') ? (e.value = '', e.style.color = 'var(--text-primary)') : null;
        });
    });
});

const updatePreview = async () => {
    const md = $('editor').value.replace('Write markdown here...', '').trim(),
          p = $('preview'),
          d = $('downloadBtn'),
          w = $('words'),
          t = $('readTime');

    d.disabled = true;
    w.textContent = '0';
    t.textContent = '0 min';

    if (!md) {
        p.innerHTML = "<div style='color:var(--text-secondary);text-align:center;padding:3rem'><h3>✨ Start writing</h3></div>";
        p.className = '';
        $('tableOfContents').innerHTML = '';
        return;
    }

    p.innerHTML = "<div style='padding:3rem;color:var(--text-secondary);text-align:center'>Loading...</div>";

    const data = await call('/convert', 'POST', { markdown: md, theme: state.theme });

    if (data?.html) {
        p.className = `preview-content ${state.theme}`;
        p.innerHTML = `<article class="webpage-article">${data.html}</article>`;
        $('tableOfContents').innerHTML = data.toc ? `<div class="toc-container">${data.toc}</div>` : '';
        w.textContent = data.word_count.toLocaleString();
        t.textContent = data.time;
        d.disabled = false;
        d.textContent = '⬇️ Export HTML';
        
        if (state.id) {
            call(`/project/${state.id}`, 'PUT', {
                preview_html: data.html,
                content: md,
                theme: state.theme
            });
        }
    }
};

// ✅ ALL LIGHT COLORS - Pink, Blue, Cyan, Peach, Mint, Lavender (NO DARK!)
const download = () => {
    const p = $('preview');
    const c = p.querySelector('.webpage-article')?.innerHTML;

    if (!c || p.innerHTML.includes('✨')) return alert("👆 Write markdown first!");

    // ✅ 18 LIGHT COLORS - Shared across ALL themes (random light paradise!)
    const lightBgs = [
        // Blues & Cyans
        'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)',      // Light cyan ✨
        'linear-gradient(135deg,#f5faff 0%,#e0f2ff 100%)',      // Perfect light blue ⭐
        'linear-gradient(135deg,#f0f8ff 0%,#dbeafe 100%)',      // Alice blue
        'linear-gradient(120deg,#e0f2fe 0%,#f0f9ff 100%)',      // Cyan gradient
        
        // Pinks & Peaches
        'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%)',      // Light pink
        'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)',      // Soft peach
        'linear-gradient(135deg,#fdf4ff 0%,#f3e8ff 100%)',      // Light lavender
        
        // Mints & Greens
        'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)',      // Light mint ⭐
        'linear-gradient(135deg,#f7fee7 0%,#d1fae5 100%)',      // Pale green
        'linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)',      // Mint cream
        
        // Neutrals & Whites
        '#f8fafc',                                               // Clean white-ish
        'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',      // Light slate
        '#fefefe',                                               // Pure white
        'linear-gradient(135deg,#fefefe 0%,#f8fafc 100%)',      // Bright white
        '#fafbfc',                                               // Off-white
        'linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 100%)'       // Cool light gray-blue
    ];

    const bg = lightBgs[Math.floor(Math.random() * lightBgs.length)];  // Pure random light!
    const ts = Date.now();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Index-${ts}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;max-width:900px;margin:0 auto;padding:4rem 2rem 6rem;line-height:1.75;background:${bg};color:#1a202c;min-height:100vh;position:relative}
body::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:${bg};z-index:-1}
.webpage-article{background:rgba(255,255,255,.95);backdrop-filter:blur(20px);padding:3rem;border-radius:24px;box-shadow:0 25px 50px rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.2)}
h1{font-size:2.8rem;margin-bottom:1.5rem;line-height:1.2}h1,h2{border-bottom:3px solid #3b82f6;padding-bottom:.75rem}
h2{font-size:2.2rem;margin:2.5rem 0 1.25rem}h3{font-size:1.7rem;margin:2rem 0 1rem;color:#059669}
p{margin-bottom:1.5rem;font-size:1.1rem}blockquote{border-left:5px solid #3b82f6;padding:1.5rem 2rem;margin:2.5rem 0;font-style:italic;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;position:relative}
blockquote::before{content:'"';font-size:4rem;color:#3b82f6;position:absolute;top:-10px;left:15px;opacity:.3}
ul,ol{padding-left:2rem;margin:1.5rem 0}li{margin-bottom:.5rem}strong{color:#1e40af}
code{background:#f8fafc;padding:.25em .5em;border-radius:6px;font-family:'Monaco',monospace;color:#dc2626;border:1px solid #e2e8f0}
pre{background:#f8f9fa;color:#1a202c;padding:2rem;border-radius:12px;overflow-x:auto;margin:2rem 0;box-shadow:0 10px 30px rgba(0,0,0,.1);border:1px solid #e2e8f0}
table{border-collapse:collapse;width:100%;margin:2rem 0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.1)}
th,td{border:1px solid #e5e7eb;padding:1rem 1.25rem;text-align:left}
th{background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
tr:nth-child(even){background:#f9fafb}
.toc-container{background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:2rem;border-radius:16px;margin:2rem 0;border-left:5px solid #3b82f6;box-shadow:0 10px 30px rgba(0,0,0,.1)}
.toc-container h4{margin-bottom:1.25rem;color:#1e40af;font-size:1.2rem}.toc-container ul{list-style:none;padding:0}.toc-container li{margin:.75rem 0}.toc-container a{color:#3b82f6;text-decoration:none;font-weight:500;transition:color .2s}.toc-container a:hover{color:#1d4ed8}
a[href^="mailto"],a[href^="tel"]{background:#10b981;color:#fff;padding:.5rem 1rem;border-radius:25px;text-decoration:none;font-weight:600}
@media (max-width:768px){body{padding:2rem 1rem}.webpage-article{padding:2rem 1.5rem;margin:1rem}h1{font-size:2rem}}
</style>
</head>
<body class="${state.theme}">
${c}
</body></html>
`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Index-${ts}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Save project
const saveProject = async () => {
    const content = $('editor').value.replace('Write markdown here...', '').trim();
    if (!content) return alert("👆 Write something before saving!");

    const n = prompt('Project Name:') || `Webpage ${new Date().toLocaleDateString()}`;
    if (!n) return;

    const data = { name: n, content, theme: state.theme };
    const res = await call(state.id ? `/project/${state.id}` : '/projects', state.id ? 'PUT' : 'POST', data);

    if (res?.id || state.id) {
        state.id = res?.id || state.id;
        loadProjects();
        alert("Project saved successfully ✅");
    }
};

// Load projects
const loadProjects = async () => {
    const projects = await call('/projects') || [];
    $('projectList').innerHTML = projects.length
        ? projects.map(p => `
            <div class="project-item ${state.id===p.id?'active':''}">
                <span onclick="loadProject('${p.id}')">${p.name}</span>
                <button class="delete-btn" onclick="deleteProject(event,'${p.id}')">🗑️</button>
            </div>
        `).join('')
        : '<div style="color:var(--text-secondary);">No projects yet</div>';
};

window.deleteProject = async (e, pid) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const res = await call(`/project/${pid}`, 'DELETE');
    if (res?.success) {
        if (state.id === pid) {
            state.id = null;
            $('editor').value = 'Write markdown here...';
            $('downloadBtn').disabled = true;
            updatePreview();
        }
        loadProjects();
        alert("Project deleted ✅");
    } else {
        alert("Failed to delete project ❌");
    }
};

window.loadProject = async pid => {
    const p = await call(`/project/${pid}`);
    if (p) {
        state.id = pid;
        $('editor').value = p.content || '';
        state.theme = p.theme || 'blog';
        
        document.querySelectorAll('.theme-btn').forEach(b => 
            b.classList.toggle('active', b.dataset.theme === state.theme)
        );
        
        if (p.preview_html) {
            const previewEl = $('preview');
            previewEl.className = `preview-content ${state.theme}`;
            previewEl.innerHTML = `<article class="webpage-article">${p.preview_html}</article>`;
            $('downloadBtn').disabled = false;
            $('downloadBtn').textContent = '⬇️ Export HTML';
        } else {
            updatePreview();
        }
        
        loadProjects();
    }
};

window.onload = () => {
    setTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
    $('editor').addEventListener('input', updatePreview);
    $('saveBtn').addEventListener('click', saveProject);
    $('downloadBtn').addEventListener('click', download);
    $('newBtn').addEventListener('click', () => {
        if (confirm('Clear editor?')) {
            state.id = null;
            $('editor').value = 'Write markdown here...';
            $('downloadBtn').disabled = true;
            updatePreview();
            loadProjects();
        }
    });
    document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', e => {
        document.querySelectorAll('.theme-btn').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.theme = e.currentTarget.dataset.theme;
        updatePreview();
    }));
    loadProjects();
    updatePreview();
};