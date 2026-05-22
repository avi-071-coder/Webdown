const API = 'http://127.0.0.1:5000',
      $ = id => document.getElementById(id),
      state = { id: null };

let writingSeconds = 0;
let writingTimer = null;
let saveTimeout = null;

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
    
    // Writing Time Tracker logic
    e.addEventListener('input', () => {
        // Start timer if not started
        if (!writingTimer) {
            writingTimer = setInterval(() => {
                writingSeconds++;
                
                // Format display
                let timeStr = '';
                if (writingSeconds < 60) timeStr = `${writingSeconds}s`;
                else {
                    const m = Math.floor(writingSeconds / 60);
                    const s = writingSeconds % 60;
                    timeStr = `${m}m ${s}s`;
                }
                $('readTime').textContent = timeStr;
            }, 1000);
        }

        // Auto-save logic
        if (state.id) {
            clearTimeout(saveTimeout);
            $('saveBtn').textContent = 'Saving...';
            saveTimeout = setTimeout(async () => {
                await autoSave();
                $('saveBtn').textContent = 'Saved!';
                setTimeout(() => {
                    if ($('saveBtn').textContent === 'Saved!') $('saveBtn').textContent = 'Save';
                }, 2000);
            }, 1500); // Save 1.5 seconds after they stop typing
        }

        updatePreview();
    });

    // Pause timer when they click away
    e.addEventListener('blur', () => {
        clearInterval(writingTimer);
        writingTimer = null;
        if (e.value.includes('Write')) {
            e.value = '';
            e.style.color = 'var(--text-primary)';
        }
    });

    e.addEventListener('focus', () => {
        if (e.value.includes('Write')) {
            e.value = '';
            e.style.color = 'var(--text-primary)';
        }
    });
    
    // AI Generate Logic
    $('aiGenerateBtn').addEventListener('click', async () => {
        const text = e.value.replace('Write normally here...', '').trim();
        if (!text) return alert("👆 Write something first!");
        
        const btn = $('aiGenerateBtn');
        const ogText = btn.textContent;
        btn.textContent = '✨ Generating...';
        btn.disabled = true;
        
        const res = await call('/ai-format', 'POST', { text });
        
        if (res && res.markdown) {
            e.value = res.markdown;
            updatePreview();
            
            // Auto-save after generating if there is an id
            if (state.id) {
                await autoSave();
            }
        } else {
            alert("Failed to generate markdown ❌");
        }
        
        btn.textContent = ogText;
        btn.disabled = false;
    });
});

const updatePreview = async () => {
    const md = $('editor').value.replace('Write normally here...', '').trim(),
          p = $('preview'),
          d = $('downloadBtn'),
          w = $('words');

    if (!md) {
        d.disabled = true;
        w.textContent = '0';
        p.innerHTML = "<div style='color:var(--text-secondary);text-align:center;padding:3rem'><h3>✨ Start writing</h3></div>";
        p.className = '';
        $('tableOfContents').innerHTML = '';
        return;
    }

    p.innerHTML = "<div style='padding:3rem;color:var(--text-secondary);text-align:center'>Loading...</div>";

    const data = await call('/convert', 'POST', { markdown: md });

    if (data?.html) {
        p.className = `preview-content`;
        p.innerHTML = `<article class="webpage-article">${data.html}</article>`;
        $('tableOfContents').innerHTML = data.toc ? `<div class="toc-container">${data.toc}</div>` : '';
        w.textContent = data.word_count.toLocaleString();
        
        d.disabled = false;
        d.textContent = '⬇️ Export HTML';
        
        // Removed the implicit save from here since we use autoSave() now
    }
};

const download = () => {
    const p = $('preview');
    const c = p.querySelector('.webpage-article')?.innerHTML;

    if (!c || p.innerHTML.includes('✨')) return alert("👆 Write markdown first!");

    const lightBgs = [
        'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)',
        'linear-gradient(135deg,#f5faff 0%,#e0f2ff 100%)',
        'linear-gradient(135deg,#f0f8ff 0%,#dbeafe 100%)',
        'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%)',
        'linear-gradient(135deg,#fdf4ff 0%,#f3e8ff 100%)',
        'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)',
        '#f8fafc',
        '#fefefe',
        '#fafbfc'
    ];

    const bg = lightBgs[Math.floor(Math.random() * lightBgs.length)];
    const ts = Date.now();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Generated Webpage</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;max-width:900px;margin:0 auto;padding:4rem 2rem 6rem;line-height:1.75;background:${bg};color:#334155;min-height:100vh;position:relative}
body::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:${bg};z-index:-1}
.webpage-article{background:rgba(255,255,255,.95);backdrop-filter:blur(20px);padding:3rem;border-radius:24px;box-shadow:0 25px 50px rgba(0,0,0,.05);border:1px solid rgba(255,255,255,.5)}
h1{color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:.5rem;margin-top:1.5rem;margin-bottom:1rem;font-size:2.2rem;font-weight:700;letter-spacing:-.02em}
h2{color:#334155;margin-top:2rem;margin-bottom:1rem;font-size:1.8rem;font-weight:600;letter-spacing:-.01em}
h3{color:#475569;margin-top:1.5rem;margin-bottom:.75rem;font-size:1.4rem;font-weight:600}
p{color:#334155;margin-bottom:1.25rem;font-size:1.1rem;line-height:1.8}
blockquote{border-left:4px solid #8b5cf6;padding:1rem 1.5rem;margin:1.5rem 0;font-style:italic;background:linear-gradient(to right,rgba(139,92,246,.1),transparent);color:#4c1d95;border-radius:0 8px 8px 0}
ul,ol{margin-left:1.5rem;margin-bottom:1.25rem;color:#334155;font-size:1.1rem;line-height:1.8}
li{margin-bottom:.5rem}
strong{color:#0f172a;font-weight:600}
code{background:#f1f5f9;padding:.2em .4em;border-radius:6px;font-family:'Monaco',monospace;color:#ec4899;font-size:.9em;border:1px solid #e2e8f0}
pre{background:#0f172a;color:#f8fafc;padding:1.5rem;border-radius:12px;overflow-x:auto;margin:1.5rem 0;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);border:1px solid #334155}
pre code{background:transparent;padding:0;color:inherit;border:none}
table{border-collapse:collapse;width:100%;margin:2rem 0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.05)}
th,td{border:1px solid #e5e7eb;padding:1rem 1.25rem;text-align:left}
th{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
tr:nth-child(even){background:#f8fafc}
a{color:#6366f1;text-decoration:none;font-weight:500}a:hover{color:#4f46e5;text-decoration:underline}
.toc-container{background:rgba(255,255,255,0.8);padding:2rem;border-radius:16px;margin:2rem 0;border-left:4px solid #8b5cf6;box-shadow:0 10px 30px rgba(0,0,0,.05);border:1px solid rgba(255,255,255,.5)}
.toc-container h4{margin-bottom:1.25rem;color:#4c1d95;font-size:1.2rem}
.toc-container ul{list-style:none;padding:0}
.toc-container li{margin:.75rem 0}
@media (max-width:768px){body{padding:2rem 1rem}.webpage-article{padding:2rem 1.5rem;margin:1rem}h1{font-size:2rem}}
</style>
</head>
<body>
${c}
</body></html>
`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Webpage-${ts}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const autoSave = async () => {
    if (!state.id) return;
    const content = $('editor').value.replace('Write normally here...', '').trim();
    if (!content) return;

    const p = $('preview');
    const preview_html = p.querySelector('.webpage-article')?.innerHTML || '';

    const data = { content, preview_html };
    await call(`/project/${state.id}`, 'PUT', data);
};

// Save project explicitly
const saveProject = async () => {
    const content = $('editor').value.replace('Write normally here...', '').trim();
    if (!content) return alert("👆 Write something before saving!");

    if (state.id) {
        await autoSave();
        alert("Project saved successfully ✅");
        return;
    }

    const n = prompt('Project Name:') || `Webpage ${new Date().toLocaleDateString()}`;
    if (!n) return;

    const p = $('preview');
    const preview_html = p.querySelector('.webpage-article')?.innerHTML || '';

    const data = { name: n, content, preview_html };
    const res = await call('/projects', 'POST', data);

    if (res?.id) {
        state.id = res.id;
        loadProjects();
        alert("Project created and saved successfully ✅");
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
            $('editor').value = 'Write normally here...';
            $('downloadBtn').disabled = true;
            $('readTime').textContent = '0s';
            writingSeconds = 0;
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
        $('readTime').textContent = '0s';
        writingSeconds = 0;
        
        if (p.preview_html) {
            const previewEl = $('preview');
            previewEl.className = `preview-content`;
            previewEl.innerHTML = `<article class="webpage-article">${p.preview_html}</article>`;
            $('downloadBtn').disabled = false;
            $('downloadBtn').textContent = '⬇️ Export HTML';
            
            // Also need to get words and toc if possible, 
            // but we can just trigger updatePreview() to cleanly reload it
            updatePreview();
        } else {
            updatePreview();
        }
        
        loadProjects();
    }
};

window.onload = () => {
    setTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
    
    $('saveBtn').addEventListener('click', saveProject);
    $('downloadBtn').addEventListener('click', download);
    $('newBtn').addEventListener('click', () => {
        if (confirm('Create a new page?')) {
            state.id = null;
            $('editor').value = 'Write normally here...';
            $('downloadBtn').disabled = true;
            $('readTime').textContent = '0s';
            writingSeconds = 0;
            updatePreview();
            loadProjects();
        }
    });
    
    loadProjects();
    updatePreview();
};