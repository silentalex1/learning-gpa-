document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const navBtns = document.querySelectorAll('.nav-btn');
    const mathView = document.getElementById('mathView');
    const aiView = document.getElementById('aiView');
    const aiTitle = document.getElementById('aiTitle');
    
    const mathModeTrigger = document.getElementById('mathModeTrigger');
    const mathModeOptions = document.getElementById('mathModeOptions');
    let currentMathMode = 'solve_any';

    const mathInput = document.getElementById('mathInput');
    const degreeBtn = document.getElementById('degreeBtn');
    const solveBtn = document.getElementById('solveMathBtn');
    const solveMathAiBtn = document.getElementById('solveMathAiBtn');
    const solutionBox = document.getElementById('mathSolution');
    const graphCard = document.getElementById('graphCard');
    const canvas = document.getElementById('mathCanvas');
    const ctx = canvas.getContext('2d');

    const askAiBtn = document.getElementById('askAiBtn');
    const aiPrompt = document.getElementById('aiPrompt');
    const aiResponse = document.getElementById('aiResponse');

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const notesBtn = document.getElementById('notesBtn');
    const mobileNotesBtn = document.getElementById('mobileNotesBtn');
    
    const suggestionBtn = document.getElementById('suggestionBtn');
    const mobileSuggestionBtn = document.getElementById('mobileSuggestionBtn');
    const suggestionModal = document.getElementById('suggestionModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');

    const notesModal = document.getElementById('notesModal');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteContentInput = document.getElementById('noteContentInput');
    const notesTabs = document.getElementById('notesTabs');
    const notificationArea = document.getElementById('notificationArea');

    let currentSubject = 'math';
    let userNotes = [];
    let currentNoteIndex = -1;
    let gridScale = 25;

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        notificationArea.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3000);
    }

    const mathEngine = {
        gcd: (a, b) => {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) { a %= b; [a, b] = [b, a]; }
            return a;
        },

        formatFrac: (num, den) => {
            if (den === 0) return "undefined";
            const common = mathEngine.gcd(num, den);
            num /= common;
            den /= common;
            if (den < 0) { num = -num; den = -den; }
            if (den === 1) return `${num}`;
            return `<span class="frac"><span>${num}</span><span class="bottom">${den}</span></span>`;
        },

        parseCoords: (str) => {
            const matches = str.match(/-?\d+(\.\d+)?/g);
            if (!matches || matches.length < 4) return null;
            return {
                x1: parseFloat(matches[0]),
                y1: parseFloat(matches[1]),
                x2: parseFloat(matches[2]),
                y2: parseFloat(matches[3])
            };
        },

        solveLinear: (input) => {
            const clean = input.replace(/\s+/g, '').replace('y=', '');
            let m = 1, b = 0;
            
            if (!clean.includes('x')) {
                b = parseFloat(clean) || 0;
                m = 0;
            } else {
                const parts = clean.split('x');
                let mStr = parts[0];
                let bStr = parts[1] || '0';
                
                if (mStr === '' || mStr === '+') m = 1;
                else if (mStr === '-') m = -1;
                else m = parseFloat(mStr);
                
                b = parseFloat(bStr.replace('+', '')) || 0;
            }

            let steps = `<div class="step-card">Detected Slope (m): <span class="step-math">${m}</span></div>`;
            steps += `<div class="step-card">Detected Y-Intercept (b): <span class="step-math">${b}</span></div>`;
            
            if (m !== 0) {
                const xInt = -b / m;
                steps += `<div class="step-card">X-Intercept Calculation:<br>0 = ${m}x + ${b}<br>-${b} = ${m}x<span class="step-math">x = ${xInt.toFixed(2)}</span></div>`;
            }

            return { html: steps, m, b };
        },

        solveGeometry: (coords) => {
            const dx = coords.x2 - coords.x1;
            const dy = coords.y2 - coords.y1;
            const distance = Math.sqrt(dx*dx + dy*dy);
            const midX = (coords.x1 + coords.x2) / 2;
            const midY = (coords.y1 + coords.y2) / 2;
            
            let steps = `<div class="step-card">Distance Formula: √[(${coords.x2}-${coords.x1})² + (${coords.y2}-${coords.y1})²]<span class="step-math">${distance.toFixed(4)} units</span></div>`;
            steps += `<div class="step-card">Midpoint Formula: ( [x1+x2]/2 , [y1+y2]/2 )<span class="step-math">(${midX}, ${midY})</span></div>`;
            
            if (dx === 0) {
                steps += `<div class="step-card">Slope is undefined (Vertical Line)<span class="step-math">x = ${coords.x1}</span></div>`;
            } else {
                const m = dy / dx;
                const b = coords.y1 - m * coords.x1;
                steps += `<div class="step-card">Slope (m) Calculation: (y2-y1)/(x2-x1)<span class="step-math">m = ${m.toFixed(2)}</span></div>`;
                steps += `<div class="step-card">Equation (y = mx + b):<span class="step-math">y = ${m.toFixed(2)}x + ${b.toFixed(2)}</span></div>`;
            }
            return steps;
        }
    };

    const visualEngine = {
        drawGrid: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width, h = canvas.height;
            const centerX = w / 2, centerY = h / 2;

            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            for (let x = centerX % gridScale; x < w; x += gridScale) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = centerY % gridScale; y < h; y += gridScale) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
        },

        toCanvas: (x, y) => ({
            x: (canvas.width / 2) + (x * gridScale),
            y: (canvas.height / 2) - (y * gridScale)
        }),

        drawLine: (m, b, color = '#0984e3') => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            const x1 = -20;
            const y1 = m * x1 + b;
            const x2 = 20;
            const y2 = m * x2 + b;
            const p1 = visualEngine.toCanvas(x1, y1);
            const p2 = visualEngine.toCanvas(x2, y2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        },

        drawPoint: (x, y, color = '#d32f31') => {
            const p = visualEngine.toCanvas(x, y);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSubject = btn.dataset.subject;
            body.className = `theme-${currentSubject}`;
            
            if (currentSubject === 'math') {
                mathView.classList.remove('hidden');
                aiView.classList.add('hidden');
            } else {
                mathView.classList.add('hidden');
                aiView.classList.remove('hidden');
                aiTitle.textContent = `${currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Facilitator`;
            }
        });
    });

    mathModeTrigger.addEventListener('click', () => mathModeOptions.classList.toggle('hidden'));

    document.querySelectorAll('#mathModeOptions .custom-option').forEach(opt => {
        opt.addEventListener('click', () => {
            currentMathMode = opt.dataset.value;
            mathModeTrigger.textContent = opt.textContent;
            mathModeOptions.classList.add('hidden');
            if (['solve_any', 'triangle_in', 'triangle_ex'].includes(currentMathMode)) {
                graphCard.classList.add('hidden');
            } else {
                graphCard.classList.remove('hidden');
                visualEngine.drawGrid();
            }
        });
    });

    solveBtn.addEventListener('click', async () => {
        const input = mathInput.textContent.trim();
        if (!input) return;

        solutionBox.innerHTML = '<div class="empty-state">Computing logic...</div>';

        try {
            if (currentMathMode === 'solve_any') {
                const res = await callPuterAI(input, "System: Expert Math Solver. Output structured steps. No LaTeX blocks.");
                solutionBox.innerHTML = res;
            } else if (currentMathMode === 'linear') {
                const result = mathEngine.solveLinear(input);
                solutionBox.innerHTML = result.html;
                visualEngine.drawGrid();
                visualEngine.drawLine(result.m, result.b);
            } else if (currentMathMode === 'geometry') {
                const coords = mathEngine.parseCoords(input);
                if (!coords) throw new Error("Format: (x1, y1) and (x2, y2)");
                solutionBox.innerHTML = mathEngine.solveGeometry(coords);
                visualEngine.drawGrid();
                visualEngine.drawPoint(coords.x1, coords.y1);
                visualEngine.drawPoint(coords.x2, coords.y2);
            }
        } catch (e) {
            solutionBox.innerHTML = `<div style="color:#d63031; font-weight:700;">Logic Error: ${e.message}</div>`;
        }
    });

    async function callPuterAI(prompt, sys) {
        if (!window.puter) return "Initialization error.";
        try {
            const resp = await puter.ai.chat(`${sys}\n\nUser: ${prompt}`, { model: 'gpt-4o-mini' });
            return resp.message.content.replace(/\n/g, '<br>');
        } catch (e) {
            return "Connection interrupted.";
        }
    }

    solveMathAiBtn.addEventListener('click', async () => {
        const input = mathInput.textContent.trim();
        if (!input) return;
        solutionBox.innerHTML = '<div class="empty-state">Synthesizing intelligence...</div>';
        const res = await callPuterAI(input, "System: Professional Academic Tutor. Use vertical steps.");
        solutionBox.innerHTML = res;
    });

    askAiBtn.addEventListener('click', async () => {
        const prompt = aiPrompt.value.trim();
        if (!prompt) return;
        aiResponse.innerHTML = '<div class="empty-state">Analyzing query...</div>';
        const res = await callPuterAI(prompt, `System: Scholar in ${currentSubject}. Provide deep context.`);
        aiResponse.innerHTML = res;
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileSidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
    });

    const closeAll = () => {
        mobileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
        suggestionModal.classList.add('hidden');
        settingsModal.classList.add('hidden');
        notesModal.classList.add('hidden');
    };

    sidebarOverlay.addEventListener('click', closeAll);
    document.getElementById('closeSidebarBtn').addEventListener('click', closeAll);

    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    suggestionBtn.addEventListener('click', () => suggestionModal.classList.remove('hidden'));
    document.getElementById('closeSettingsBtn').addEventListener('click', closeAll);
    document.getElementById('closeSuggestionBtn').addEventListener('click', closeAll);

    notesBtn.addEventListener('click', () => {
        if (!puter.auth.isSignedIn()) {
            showNotification("Authentication required for notebook.");
            return;
        }
        notesModal.classList.remove('hidden');
        renderNotes();
    });

    document.getElementById('closeNotesBtn').addEventListener('click', closeAll);

    async function loadNotes() {
        if (!puter.auth.isSignedIn()) return;
        const data = await puter.kv.get('user_notes_v2');
        userNotes = data ? JSON.parse(data) : [];
    }

    function renderNotes() {
        notesTabs.innerHTML = '<div class="note-tab active">+ Session</div>';
        userNotes.forEach((n, i) => {
            const t = document.createElement('div');
            t.className = 'note-tab';
            t.textContent = n.title || 'Untitled';
            t.onclick = () => loadNoteIndex(i);
            notesTabs.appendChild(t);
        });
    }

    function loadNoteIndex(i) {
        currentNoteIndex = i;
        noteTitleInput.value = userNotes[i].title;
        noteContentInput.innerHTML = userNotes[i].content;
        document.querySelectorAll('.note-tab').forEach((t, idx) => {
            t.classList.toggle('active', idx === i + 1);
        });
    }

    document.getElementById('saveNoteBtn').addEventListener('click', async () => {
        const note = { title: noteTitleInput.value || 'Untitled', content: noteContentInput.innerHTML };
        if (currentNoteIndex === -1) userNotes.push(note);
        else userNotes[currentNoteIndex] = note;
        await puter.kv.set('user_notes_v2', JSON.stringify(userNotes));
        showNotification("Session recorded.");
        renderNotes();
    });

    const checkAuth = async () => {
        if (puter.auth.isSignedIn()) {
            loginBtn.textContent = "Exit Session";
            notesBtn.classList.remove('hidden');
            loadNotes();
        } else {
            loginBtn.textContent = "Access Account";
            notesBtn.classList.add('hidden');
        }
    };

    loginBtn.addEventListener('click', async () => {
        if (puter.auth.isSignedIn()) await puter.auth.signOut();
        else await puter.auth.signIn();
        checkAuth();
    });

    document.getElementById('boldTextBtn').addEventListener('click', () => document.execCommand('bold'));
    document.getElementById('italicTextBtn').addEventListener('click', () => document.execCommand('italic'));
    document.getElementById('underlineTextBtn').addEventListener('click', () => document.execCommand('underline'));

    visualEngine.drawGrid();
    checkAuth();

    document.getElementById('zoomIn').addEventListener('click', () => {
        gridScale += 5;
        visualEngine.drawGrid();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        if (gridScale > 10) gridScale -= 5;
        visualEngine.drawGrid();
    });

    document.getElementById('discordBtn').addEventListener('click', () => {
        navigator.clipboard.writeText("https://discord.gg/eKC5CgEZbT");
        showNotification("Community link secured to clipboard.");
    });
});
