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
    
    const discordBtn = document.getElementById('discordBtn');
    const mobileDiscordBtn = document.getElementById('mobileDiscordBtn');
    const docsBtn = document.getElementById('docsBtn');
    const mobileDocsBtn = document.getElementById('mobileDocsBtn');

    const suggestionBtn = document.getElementById('suggestionBtn');
    const mobileSuggestionBtn = document.getElementById('mobileSuggestionBtn');
    const suggestionModal = document.getElementById('suggestionModal');
    const closeSuggestionBtn = document.getElementById('closeSuggestionBtn');
    const suggestionGenreTrigger = document.getElementById('suggestionGenreTrigger');
    const suggestionGenreOptions = document.getElementById('suggestionGenreOptions');
    const suggestionLabel = document.getElementById('suggestionLabel');
    const suggestionInput = document.getElementById('suggestionInput');
    const submitSuggestionBtn = document.getElementById('submitSuggestionBtn');

    const settingsBtn = document.getElementById('settingsBtn');
    const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const iconUpload = document.getElementById('iconUpload');
    const fileNameDisplay = document.getElementById('fileName');
    const settingsTitleInput = document.getElementById('settingsTitleInput');
    const settingsIconUrlInput = document.getElementById('settingsIconUrlInput');
    const applySettingsBtn = document.getElementById('applySettingsBtn');

    const notesModal = document.getElementById('notesModal');
    const closeNotesBtn = document.getElementById('closeNotesBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteContentInput = document.getElementById('noteContentInput');
    const boldTextBtn = document.getElementById('boldTextBtn');
    const notesTabs = document.getElementById('notesTabs');
    const contextMenu = document.getElementById('contextMenu');
    const renameNoteOption = document.getElementById('renameNoteOption');
    const notificationArea = document.getElementById('notificationArea');

    let currentSubject = 'math';
    let userNotes = [];
    let currentNoteIndex = -1;
    let rightClickedTabIndex = -1;

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const subject = btn.dataset.subject;
            currentSubject = subject;
            body.className = `theme-${subject}`;

            if (subject === 'math') {
                mathView.classList.remove('hidden');
                aiView.classList.add('hidden');
                setTimeout(drawGrid, 50);
            } else {
                mathView.classList.add('hidden');
                aiView.classList.remove('hidden');
                aiTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1) + " Helper";
                aiResponse.innerHTML = `<div class="empty-state"><span>I am ready to help you with ${subject}.</span></div>`;
            }
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileSidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
    });

    function closeSidebar() {
        mobileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    }

    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    mathModeTrigger.addEventListener('click', () => {
        mathModeOptions.classList.toggle('hidden');
    });

    document.querySelectorAll('#mathModeOptions .custom-option').forEach(option => {
        option.addEventListener('click', () => {
            currentMathMode = option.dataset.value;
            mathModeTrigger.textContent = option.textContent;
            mathModeOptions.classList.add('hidden');
            
            solutionBox.innerHTML = '<div class="empty-state"><span>Answer and steps will appear here.</span></div>';
            mathInput.textContent = '';
            
            const noGraphModes = ['triangle_in', 'triangle_ex', 'solve_any'];
            if (noGraphModes.includes(currentMathMode)) {
                graphCard.classList.add('hidden');
            } else {
                graphCard.classList.remove('hidden');
                setTimeout(drawGrid, 50);
            }

            const placeholders = {
                'solve_any': "Type any algebra question...",
                'algebra': "Ex: 3(x+2) = 15 or 5 + 10 / 2",
                'linear': "Ex: y = -x - 5",
                'intercepts': "Ex: x-intercept 2, y-intercept 3",
                'geometry': "Ex: (1,2) and (4,6)",
                'triangle_in': "Ex: 35 and 58",
                'triangle_ex': "Ex: 35 and 58"
            };
            mathInput.setAttribute('placeholder', placeholders[currentMathMode]);
        });
    });

    suggestionGenreTrigger.addEventListener('click', () => {
        suggestionGenreOptions.classList.toggle('hidden');
    });

    document.querySelectorAll('#suggestionGenreOptions .custom-option').forEach(option => {
        option.addEventListener('click', () => {
            const val = option.dataset.value;
            suggestionGenreTrigger.textContent = val;
            suggestionGenreOptions.classList.add('hidden');
            
            const mapping = {
                'AI Features': ["What AI Features should be changed / added?", "what ai features should i add onto the site?"],
                'Website changes': ["What Website changes should be changed / added?", "what should i change of the website design?"],
                'Geometry changes': ["What Geometry changes should be changed / added?", "what should i add onto this website for more geometry questions that will be more supported?"]
            };
            
            suggestionLabel.textContent = mapping[val][0];
            suggestionInput.placeholder = mapping[val][1];
        });
    });

    document.addEventListener('click', (e) => {
        if (!mathModeTrigger.contains(e.target) && !mathModeOptions.contains(e.target)) {
            mathModeOptions.classList.add('hidden');
        }
        if (!suggestionGenreTrigger.contains(e.target) && !suggestionGenreOptions.contains(e.target)) {
            suggestionGenreOptions.classList.add('hidden');
        }
    });

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        notificationArea.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, 3500);
    }

    function handleDiscordClick(btn) {
        navigator.clipboard.writeText("https://discord.gg/eKC5CgEZbT");
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add('copied');
        showNotification("Link copied!");
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }

    discordBtn.addEventListener('click', () => handleDiscordClick(discordBtn));
    mobileDiscordBtn.addEventListener('click', () => handleDiscordClick(mobileDiscordBtn));
    docsBtn.addEventListener('click', () => window.location.href = 'document/');
    mobileDocsBtn.addEventListener('click', () => window.location.href = 'document/');

    suggestionBtn.addEventListener('click', () => { suggestionModal.classList.remove('hidden'); closeSidebar(); });
    mobileSuggestionBtn.addEventListener('click', () => { suggestionModal.classList.remove('hidden'); closeSidebar(); });
    closeSuggestionBtn.addEventListener('click', () => suggestionModal.classList.add('hidden'));

    submitSuggestionBtn.addEventListener('click', async () => {
        const genre = suggestionGenreTrigger.textContent;
        const text = suggestionInput.value.trim();
        if (!text) return alert("Please type a suggestion.");

        const username = window.puter && puter.auth.isSignedIn() ? (await puter.auth.getUser()).username : "Guest";
        const payload = {
            embeds: [{
                title: `${genre} Posted`,
                description: text,
                footer: { text: `By ${username}` },
                color: 5814783
            }]
        };

        fetch("https://discord.com/api/webhooks/1450742401827344527/EOCnELh67IQvsrUelvM1zO4Ga_S1IxAb2_OEfsgVvMaRGGg97Xi6LHGI6ZMfy7oqzVzm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(() => {
            showNotification("Suggestion Submitted!");
            suggestionModal.classList.add('hidden');
            suggestionInput.value = "";
        });
    });

    settingsBtn.addEventListener('click', () => { settingsModal.classList.remove('hidden'); closeSidebar(); });
    mobileSettingsBtn.addEventListener('click', () => { settingsModal.classList.remove('hidden'); closeSidebar(); });
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

    applySettingsBtn.addEventListener('click', () => {
        if(settingsTitleInput.value.trim()) document.title = settingsTitleInput.value.trim();
        if(settingsIconUrlInput.value.trim()) document.getElementById('dynamicFavicon').href = settingsIconUrlInput.value.trim();
        showNotification("Settings Applied!");
        settingsModal.classList.add('hidden');
    });

    iconUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        fileNameDisplay.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('dynamicFavicon').href = e.target.result;
            showNotification("Icon Updated!");
        };
        reader.readAsDataURL(file);
    });

    async function checkAuth() {
        if (!window.puter) return;
        const signedIn = puter.auth.isSignedIn();
        const btns = [loginBtn, mobileLoginBtn];
        btns.forEach(b => b.textContent = signedIn ? "Logout" : "Login");
        [notesBtn, mobileNotesBtn].forEach(b => b.classList.toggle('hidden', !signedIn));
        if (signedIn) loadNotes();
    }

    async function handleAuth() {
        puter.auth.isSignedIn() ? await puter.auth.signOut() : await puter.auth.signIn();
        checkAuth();
        closeSidebar();
    }

    loginBtn.addEventListener('click', handleAuth);
    mobileLoginBtn.addEventListener('click', handleAuth);

    notesBtn.addEventListener('click', () => { notesModal.classList.remove('hidden'); renderTabs(); closeSidebar(); });
    mobileNotesBtn.addEventListener('click', () => { notesModal.classList.remove('hidden'); renderTabs(); closeSidebar(); });
    closeNotesBtn.addEventListener('click', () => notesModal.classList.add('hidden'));

    async function loadNotes() {
        const data = await puter.kv.get('user_notes');
        userNotes = data ? JSON.parse(data) : [];
    }

    async function saveNotesToCloud() {
        await puter.kv.set('user_notes', JSON.stringify(userNotes));
    }

    function renderTabs() {
        notesTabs.innerHTML = '';
        const newTab = document.createElement('div');
        newTab.className = `note-tab ${currentNoteIndex === -1 ? 'active' : ''}`;
        newTab.textContent = '+ New Note';
        newTab.onclick = () => selectNote(-1);
        notesTabs.appendChild(newTab);

        userNotes.forEach((note, index) => {
            const tab = document.createElement('div');
            tab.className = `note-tab ${currentNoteIndex === index ? 'active' : ''}`;
            tab.textContent = note.title || 'Untitled';
            tab.onclick = () => selectNote(index);
            tab.oncontextmenu = (e) => {
                e.preventDefault();
                rightClickedTabIndex = index;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.classList.remove('hidden');
            };
            notesTabs.appendChild(tab);
        });
    }

    function selectNote(index) {
        currentNoteIndex = index;
        if (index === -1) {
            noteTitleInput.value = '';
            noteContentInput.innerHTML = '';
            deleteNoteBtn.classList.add('hidden');
        } else {
            noteTitleInput.value = userNotes[index].title;
            noteContentInput.innerHTML = userNotes[index].content;
            deleteNoteBtn.classList.remove('hidden');
        }
        renderTabs();
    }

    saveNoteBtn.addEventListener('click', async () => {
        const title = noteTitleInput.value.trim() || 'Untitled Note';
        const content = noteContentInput.innerHTML;
        if (currentNoteIndex === -1) {
            userNotes.push({ title, content });
            currentNoteIndex = userNotes.length - 1;
        } else {
            userNotes[currentNoteIndex] = { title, content };
        }
        await saveNotesToCloud();
        showNotification("Note Saved!");
        renderTabs();
    });

    deleteNoteBtn.addEventListener('click', async () => {
        userNotes.splice(currentNoteIndex, 1);
        currentNoteIndex = -1;
        selectNote(-1);
        await saveNotesToCloud();
        renderTabs();
    });

    renameNoteOption.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
        const newName = prompt("Enter new title:", userNotes[rightClickedTabIndex].title);
        if (newName) {
            userNotes[rightClickedTabIndex].title = newName;
            saveNotesToCloud();
            renderTabs();
        }
    });

    document.addEventListener('click', () => contextMenu.classList.add('hidden'));

    solveBtn.addEventListener('click', async () => {
        const input = mathInput.textContent.trim();
        if (!input) return solutionBox.innerHTML = '<span style="color:#e53e3e">Type a problem.</span>';
        solutionBox.innerHTML = 'Computing...';

        try {
            if (currentMathMode === 'solve_any') {
                const res = await callPuterAI(input, "Solve this math problem. Final answer only.");
                solutionBox.innerHTML = res;
            } else if (currentMathMode === 'algebra') solveAlgebra(input);
            else if (currentMathMode === 'linear') solveLinear(input);
            else if (currentMathMode === 'intercepts') solveIntercepts(input);
            else if (currentMathMode === 'geometry') solveGeometry(input);
            else if (currentMathMode === 'triangle_in') solveTriangleInterior(input);
            else if (currentMathMode === 'triangle_ex') solveTriangleExterior(input);
        } catch (e) {
            solutionBox.innerHTML = `<span style="color:#e53e3e">${e.message}</span>`;
        }
    });

    solveMathAiBtn.addEventListener('click', async () => {
        const input = mathInput.textContent.trim();
        if (!input) return;
        solutionBox.innerHTML = 'Thinking...';
        const res = await callPuterAI(input, "Solve step-by-step. Use plain text. No LaTeX. Use vertical fractions.");
        solutionBox.innerHTML = res;
    });

    function cleanMathOutput(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/### (.*$)/gm, '<h3>$1</h3>')
                   .replace(/\n/g, '<br>')
                   .replace(/(\d+)\/(\d+)/g, '<span class="frac"><span>$1</span><span class="symbol">/</span><span class="bottom">$2</span></span>');
    }

    async function callPuterAI(prompt, system) {
        if (!puter.auth.isSignedIn()) { await puter.auth.signIn(); return "Login to use AI."; }
        const resp = await puter.ai.chat(`${system}\n\nQuestion: ${prompt}`);
        return cleanMathOutput(resp.message.content);
    }

    function solveAlgebra(input) {
        const clean = input.replace(/[^-0-9+*/().]/g, '');
        const res = eval(clean);
        solutionBox.innerHTML = `<span class="step-header">Result</span>${input} = <strong>${res}</strong>`;
    }

    function solveLinear(input) {
        const str = input.replace(/\s/g, '').replace('y=', '');
        let m = 1, b = 0;
        
        if (str.includes('x')) {
            const parts = str.split('x');
            const mStr = parts[0];
            const bStr = parts[1];
            
            if (mStr === '') m = 1;
            else if (mStr === '-') m = -1;
            else m = parseFloat(mStr);
            
            if (bStr) b = parseFloat(bStr);
        } else {
            b = parseFloat(str);
            m = 0;
        }

        const xInt = m !== 0 ? -b/m : null;
        solutionBox.innerHTML = `<span class="step-header">Linear Analysis</span>Slope: ${m}<br>Y-Int: (0, ${b})<br>X-Int: ${xInt !== null ? `(${xInt.toFixed(2)}, 0)` : 'None'}`;
        drawGrid();
        drawLine(m, b);
    }

    function solveGeometry(input) {
        const nums = input.match(/-?\d+(\.\d+)?/g);
        if (!nums || nums.length < 4) throw new Error("Need 2 points.");
        const x1 = parseFloat(nums[0]), y1 = parseFloat(nums[1]);
        const x2 = parseFloat(nums[2]), y2 = parseFloat(nums[3]);
        const d = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const m = (x2-x1) !== 0 ? (y2-y1)/(x2-x1) : Infinity;
        solutionBox.innerHTML = `<span class="step-header">Geometry</span>Distance: ${d.toFixed(2)}<br>Slope: ${m === Infinity ? 'Undefined' : m.toFixed(2)}`;
        drawGrid();
        drawPoint(x1, y1, '#2563eb');
        drawPoint(x2, y2, '#2563eb');
    }

    function solveTriangleInterior(input) {
        const nums = input.match(/\d+/g);
        const sum = parseInt(nums[0]) + parseInt(nums[1]);
        solutionBox.innerHTML = `<span class="step-header">Triangle</span>Missing Angle: <strong>${180 - sum}°</strong>`;
    }

    function solveTriangleExterior(input) {
        const nums = input.match(/\d+/g);
        solutionBox.innerHTML = `<span class="step-header">Exterior Angle</span>Value: <strong>${parseInt(nums[0]) + parseInt(nums[1])}°</strong>`;
    }

    function drawGrid() {
        ctx.clearRect(0,0,600,400);
        ctx.strokeStyle = '#e2e8f0';
        for(let i=0; i<600; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,400); ctx.stroke(); }
        for(let i=0; i<400; i+=20) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(600,i); ctx.stroke(); }
        ctx.strokeStyle = '#64748b';
        ctx.beginPath(); ctx.moveTo(300,0); ctx.lineTo(300,400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,200); ctx.lineTo(600,200); ctx.stroke();
    }

    function drawLine(m, b) {
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const x1 = -15, y1 = m*x1 + b;
        const x2 = 15, y2 = m*x2 + b;
        ctx.moveTo(300 + x1*20, 200 - y1*20);
        ctx.lineTo(300 + x2*20, 200 - y2*20);
        ctx.stroke();
    }

    function drawPoint(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(300 + x*20, 200 - y*20, 5, 0, Math.PI*2);
        ctx.fill();
    }

    checkAuth();
    drawGrid();
});
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
