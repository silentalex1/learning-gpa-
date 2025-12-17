document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const navBtns = document.querySelectorAll('.nav-btn');
    const mathView = document.getElementById('mathView');
    const aiView = document.getElementById('aiView');
    const aiTitle = document.getElementById('aiTitle');
    
    const mathMode = document.getElementById('mathMode');
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
    
    const notesModal = document.getElementById('notesModal');
    const closeNotesBtn = document.getElementById('closeNotesBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteContentInput = document.getElementById('noteContentInput');
    const notesTabs = document.getElementById('notesTabs');
    const contextMenu = document.getElementById('contextMenu');
    const renameNoteOption = document.getElementById('renameNoteOption');

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
                setTimeout(drawGrid, 10);
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

    async function checkAuth() {
        try {
            if (puter.auth.isSignedIn()) {
                const user = await puter.auth.getUser();
                loginBtn.textContent = "Logout";
                mobileLoginBtn.textContent = "Logout";
                notesBtn.classList.remove('hidden');
                mobileNotesBtn.classList.remove('hidden');
                loadNotes();
            } else {
                loginBtn.textContent = "Login";
                mobileLoginBtn.textContent = "Login";
                notesBtn.classList.add('hidden');
                mobileNotesBtn.classList.add('hidden');
            }
        } catch (e) {
            console.error("Auth check failed", e);
        }
    }

    async function handleAuth() {
        try {
            if (puter.auth.isSignedIn()) {
                await puter.auth.signOut();
            } else {
                await puter.auth.signIn();
            }
            checkAuth();
            closeSidebar();
        } catch (e) {
            alert("Unable to connect to authentication service.");
        }
    }

    loginBtn.addEventListener('click', handleAuth);
    mobileLoginBtn.addEventListener('click', handleAuth);

    function openNotes() {
        if (!puter.auth.isSignedIn()) return;
        notesModal.classList.remove('hidden');
        renderTabs();
        closeSidebar();
    }

    notesBtn.addEventListener('click', openNotes);
    mobileNotesBtn.addEventListener('click', openNotes);
    closeNotesBtn.addEventListener('click', () => notesModal.classList.add('hidden'));

    noteContentInput.addEventListener('paste', (e) => {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData('text/html') || (e.clipboardData || window.clipboardData).getData('text');
        
        let cleanText = text
            .replace(/<a[^>]*>/g, "") 
            .replace(/<\/a>/g, "") 
            .replace(/🔗/g, "")
            .replace(/(\r\n|\n|\r)/gm, "<br>");
        
        document.execCommand('insertHTML', false, cleanText);
    });

    async function loadNotes() {
        try {
            const data = await puter.kv.get('user_notes');
            if (data) {
                userNotes = JSON.parse(data);
            } else {
                userNotes = [];
            }
        } catch (e) {
            userNotes = [];
        }
    }

    async function saveNotesToCloud() {
        try {
            await puter.kv.set('user_notes', JSON.stringify(userNotes));
        } catch (e) {
            console.warn("Save failed");
        }
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
            
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                rightClickedTabIndex = index;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.classList.remove('hidden');
            });

            notesTabs.appendChild(tab);
        });
    }

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.classList.add('hidden');
        }
    });

    renameNoteOption.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
        if (rightClickedTabIndex === -1) return;
        
        const tabs = notesTabs.querySelectorAll('.note-tab');
        const targetTab = tabs[rightClickedTabIndex + 1]; 
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = userNotes[rightClickedTabIndex].title;
        input.className = 'tab-edit-input';
        
        targetTab.textContent = '';
        targetTab.appendChild(input);
        input.focus();

        const saveRename = async () => {
            const newTitle = input.value.trim() || 'Untitled';
            userNotes[rightClickedTabIndex].title = newTitle;
            if (currentNoteIndex === rightClickedTabIndex) {
                noteTitleInput.value = newTitle;
            }
            await saveNotesToCloud();
            renderTabs();
        };

        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                await saveRename();
            }
        });
        
        input.addEventListener('blur', saveRename);
    });

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
        renderTabs();
    });

    deleteNoteBtn.addEventListener('click', async () => {
        if (currentNoteIndex > -1) {
            userNotes.splice(currentNoteIndex, 1);
            currentNoteIndex = -1;
            selectNote(-1);
            await saveNotesToCloud();
        }
    });

    mathMode.addEventListener('change', () => {
        solutionBox.innerHTML = '<div class="empty-state"><span>Answer and steps will appear here.</span></div>';
        mathInput.value = '';
        const mode = mathMode.value;

        if (mode.includes('triangle')) {
            graphCard.classList.add('hidden');
            mathInput.placeholder = "Ex: 35 and 58";
        } else {
            graphCard.classList.remove('hidden');
            setTimeout(drawGrid, 10);
            if (mode === 'linear') mathInput.placeholder = "Ex: y = -x - 5";
            if (mode === 'intercepts') mathInput.placeholder = "Ex: x-intercept 2, y-intercept 3";
            if (mode === 'geometry') mathInput.placeholder = "Ex: (1,2) and (4,6)";
        }
    });

    degreeBtn.addEventListener('click', () => {
        mathInput.value += '°';
        mathInput.focus();
    });

    solveBtn.addEventListener('click', () => {
        const input = mathInput.value.toLowerCase().trim();
        const mode = mathMode.value;
        solutionBox.innerHTML = '';

        if (!input) {
            solutionBox.innerHTML = '<span style="color:red">Please type a problem first.</span>';
            return;
        }

        try {
            if (mode === 'linear') solveLinear(input);
            else if (mode === 'intercepts') solveIntercepts(input);
            else if (mode === 'geometry') solveGeometry(input);
            else if (mode === 'triangle_in') solveTriangleInterior(input);
            else if (mode === 'triangle_ex') solveTriangleExterior(input);
        } catch (e) {
            solutionBox.innerHTML = `<span style="color:red"><strong>Error:</strong> ${e.message}</span>`;
        }
    });

    function cleanMathOutput(text) {
        let cleaned = text
            .replace(/\\\[/g, '') 
            .replace(/\\\]/g, '')
            .replace(/\\\(/g, '')
            .replace(/\\\)/g, '')
            .replace(/\\circ/g, '°')
            .replace(/\\times/g, '×')
            .replace(/\\cdot/g, '•')
            .replace(/\\pm/g, '±')
            .replace(/\\sqrt\{([^}]+)\}/g, '√$1')
            .replace(/\\le/g, '≤')
            .replace(/\\ge/g, '≥')
            .replace(/\\angle/g, '∠')
            .replace(/\^\{?\\circ\}?/g, '°')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '<span class="frac"><span>$1</span><span class="symbol">/</span><span class="bottom">$2</span></span>');
        
        return cleaned;
    }

    async function callPuterAI(prompt, systemPrompt) {
        try {
            if (!puter.auth.isSignedIn()) {
                await puter.auth.signIn();
                return "Please try again after logging in.";
            }

            const resp = await puter.ai.chat(`${systemPrompt}\n\nUser Question: ${prompt}`, { model: 'openai/gpt-4o' });
            return cleanMathOutput(resp.message.content);
        } catch (e) {
            console.error(e);
            return "Unable to connect to AI. If you are on a school network, this feature may be blocked.";
        }
    }

    solveMathAiBtn.addEventListener('click', async () => {
        const input = mathInput.value.trim();
        if (!input) {
            solutionBox.innerHTML = '<span style="color:red">Please type a problem first.</span>';
            return;
        }

        solutionBox.innerHTML = '<span style="color:var(--primary)">Thinking with AI...</span>';

        try {
            const result = await callPuterAI(input, "You are a Math expert. Do not use LaTeX blocks like \\[. Use plain text symbols (like °, x, /). Use vertical fractions. Solve step-by-step.");
            solutionBox.innerHTML = result;
        } catch (e) {
            solutionBox.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
        }
    });

    askAiBtn.addEventListener('click', async () => {
        const prompt = aiPrompt.value.trim();
        if (!prompt) return;

        aiResponse.innerHTML = '<span style="color:var(--primary)">Thinking...</span>';

        let sysPrompt = "You are a helpful tutor. Do not use LaTeX. Use simple readable symbols.";
        if (currentSubject === 'math') sysPrompt = "You are a Math tutor. Be very precise. Solve step-by-step using simple words. No LaTeX code.";
        if (currentSubject === 'english') sysPrompt = "You are an English tutor. Help with essays, grammar, and literature. Be concise and accurate.";
        if (currentSubject === 'history') sysPrompt = "You are a History tutor. Explain context, dates, and events accurately. Be concise.";
        if (currentSubject === 'science') sysPrompt = "You are a Science tutor. Explain biology, chemistry, and physics concepts accurately. Be concise.";

        try {
            const result = await callPuterAI(prompt, sysPrompt);
            aiResponse.innerHTML = result;
        } catch (e) {
            aiResponse.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
        }
    });

    function solveTriangleExterior(input) {
        const nums = input.match(/(\d+(\.\d+)?)/g);
        if (!nums || nums.length < 2) throw new Error("Need two interior angles.");
        
        const a1 = parseFloat(nums[0]);
        const a2 = parseFloat(nums[1]);

        if (a1 <= 0 || a2 <= 0) throw new Error("Angles must be positive.");
        if (a1 + a2 >= 180) throw new Error("Sum of two angles must be < 180° for a triangle.");

        const exterior = parseFloat((a1 + a2).toFixed(2));

        let html = `<span class="step-header">Given Interior Angles</span>`;
        html += `Angle A = ${a1}°<br>Angle B = ${a2}°`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Theorem: Exterior Angle Theorem</span>`;
        html += `The measure of an exterior angle of a triangle is equal to the sum of the measures of its two remote interior angles.<br><br>`;
        html += `Formula: x = Angle A + Angle B<br>`;
        html += `Substitution: x = ${a1} + ${a2}<br>`;
        html += `<hr class="step-line">`;
        html += `<strong>Final Answer: x = ${exterior}°</strong>`;

        solutionBox.innerHTML = html;
    }

    function solveTriangleInterior(input) {
        const nums = input.match(/(\d+(\.\d+)?)/g);
        if (!nums || nums.length < 2) throw new Error("Need two angles.");
        
        const a1 = parseFloat(nums[0]);
        const a2 = parseFloat(nums[1]);

        if (a1 + a2 >= 180) throw new Error("Sum is too large to form a triangle.");

        const a3 = parseFloat((180 - (a1 + a2)).toFixed(2));

        let html = `<span class="step-header">Given Angles</span>`;
        html += `Angle A = ${a1}°<br>Angle B = ${a2}°`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Theorem: Triangle Sum Theorem</span>`;
        html += `The sum of angles in a triangle is always 180°.<br><br>`;
        html += `Formula: x + ${a1} + ${a2} = 180<br>`;
        html += `Simplify: x + ${parseFloat((a1+a2).toFixed(2))} = 180<br>`;
        html += `Solve: x = 180 - ${parseFloat((a1+a2).toFixed(2))}<br>`;
        html += `<hr class="step-line">`;
        html += `<strong>Final Answer: x = ${a3}°</strong>`;

        solutionBox.innerHTML = html;
    }

    function solveLinear(input) {
        let clean = input.replace(/\s+/g, '').replace('y=', '');
        
        if (clean === '-x') clean = '-1x';
        if (clean === 'x') clean = '1x';
        if (clean.startsWith('x')) clean = '1' + clean;
        if (clean.startsWith('-x')) clean = '-1' + clean.substring(2);

        let m = 0, b = 0;

        if (clean.includes('x')) {
            const parts = clean.split('x');
            let mStr = parts[0];
            let bStr = parts[1];

            if (mStr === '' || mStr === '+') m = 1;
            else if (mStr === '-') m = -1;
            else m = parseFloat(mStr);

            if (!bStr || bStr === '') b = 0;
            else b = parseFloat(bStr);
        } else {
            m = 0;
            b = parseFloat(clean);
        }

        if (isNaN(m) || isNaN(b)) throw new Error("Could not understand equation.");

        const xInt = m !== 0 ? -b/m : null;

        let html = `<span class="step-header">Identify Parts</span>`;
        html += `Slope (m) = ${m}<br>Y-Intercept (b) = ${b}`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Plotting Steps</span>`;
        html += `1. Start at the Y-intercept: (0, ${b})<br>`;
        html += `2. Use slope ${m} (rise/run) to find the next point.<br>`;
        html += `   Next Point: (1, ${parseFloat((m*1+b).toFixed(2))})<br>`;
        
        if (xInt !== null) {
            html += `3. Find X-intercept (where y=0):<br>`;
            html += `   0 = ${m}x + ${b} → ${-b} = ${m}x → x = ${parseFloat(xInt.toFixed(2))}<br>`;
            html += `   Point: (${parseFloat(xInt.toFixed(2))}, 0)`;
        }

        solutionBox.innerHTML = html;
        drawGrid();
        drawLine(m, b);
        drawPoint(0, b, '#d32f2f');
        if(xInt !== null) drawPoint(xInt, 0, '#1976d2');
    }

    function solveIntercepts(input) {
        const xMatch = input.match(/x.*?(-?\d+\.?\d*)/);
        const yMatch = input.match(/y.*?(-?\d+\.?\d*)/);

        if (!xMatch || !yMatch) throw new Error("Please type 'x-intercept 2' and 'y-intercept 3'.");

        const xInt = parseFloat(xMatch[1]);
        const yInt = parseFloat(yMatch[1]);

        if (xInt === 0 && yInt === 0) throw new Error("Intercepts at origin needs more info to graph line.");

        const m = (yInt - 0) / (0 - xInt);
        const eq = `y = ${parseFloat(m.toFixed(2))}x + ${yInt}`;

        let html = `<span class="step-header">Given Points</span>`;
        html += `X-Intercept: (${xInt}, 0)<br>Y-Intercept: (0, ${yInt})`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Find Equation</span>`;
        html += `Slope (m) = (y2 - y1) / (x2 - x1)<br>`;
        html += `m = (${yInt} - 0) / (0 - ${xInt}) = ${parseFloat(m.toFixed(2))}<br>`;
        html += `<strong>Equation: ${eq}</strong>`;

        solutionBox.innerHTML = html;
        drawGrid();
        drawPoint(xInt, 0, '#1976d2');
        drawPoint(0, yInt, '#d32f2f');
        drawLine(m, yInt);
    }

    function solveGeometry(input) {
        const nums = input.match(/-?\d+(\.\d+)?/g);
        if (!nums || nums.length < 4) throw new Error("Enter two points like (1,2) and (4,6).");

        const x1 = parseFloat(nums[0]), y1 = parseFloat(nums[1]);
        const x2 = parseFloat(nums[2]), y2 = parseFloat(nums[3]);

        if (x1 === x2 && y1 === y2) throw new Error("Points are the same.");

        const dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        const mx = (x1+x2)/2;
        const my = (y1+y2)/2;

        let m = null, b = null, eq = "";
        let isVertical = false;

        if (x1 === x2) {
            isVertical = true;
            eq = `x = ${x1}`;
        } else {
            m = (y2-y1)/(x2-x1);
            b = y1 - (m * x1);
            eq = `y = ${parseFloat(m.toFixed(2))}x + ${parseFloat(b.toFixed(2))}`;
        }

        let html = `<span class="step-header">Points Analyzed</span>`;
        html += `Point A: (${x1}, ${y1})<br>Point B: (${x2}, ${y2})`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Calculations</span>`;
        html += `<strong>Distance:</strong> √[(${x2}-${x1})² + (${y2}-${y1})²] = ${parseFloat(dist.toFixed(2))}<br>`;
        html += `<strong>Midpoint:</strong> (${mx}, ${my})<br>`;
        html += `<strong>Slope:</strong> ${isVertical ? 'Undefined' : parseFloat(m.toFixed(2))}<br>`;
        html += `<strong>Equation:</strong> ${eq}`;

        solutionBox.innerHTML = html;
        drawGrid();
        drawPoint(x1, y1, '#1976d2');
        drawPoint(x2, y2, '#1976d2');
        drawPoint(mx, my, '#388e3c');

        if (isVertical) {
            ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(mapX(x1), 0); ctx.lineTo(mapX(x1), canvas.height);
            ctx.stroke();
        } else {
            drawLine(m, b);
        }
    }

    function mapX(x) { return (canvas.width / 2) + (x * 20); }
    function mapY(y) { return (canvas.height / 2) - (y * 20); }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height, s = 20;

        ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1;
        ctx.fillStyle = '#757575'; ctx.font = '10px Arial'; ctx.textAlign = 'center';

        for (let x = 0; x <= w; x += s) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            if (x % (s*2) === 0 && x !== w/2) ctx.fillText((x-w/2)/s, x, h/2 + 15);
        }
        for (let y = 0; y <= h; y += s) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            if (y % (s*2) === 0 && y !== h/2) ctx.fillText((h/2-y)/s, w/2 - 15, y + 4);
        }

        ctx.strokeStyle = '#424242'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
    }

    function drawPoint(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(mapX(x), mapY(y), 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawLine(m, b) {
        ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 3;
        ctx.beginPath();
        const x1 = -20, y1 = m * x1 + b;
        const x2 = 20, y2 = m * x2 + b;
        ctx.moveTo(mapX(x1), mapY(y1));
        ctx.lineTo(mapX(x2), mapY(y2));
        ctx.stroke();
    }

    checkAuth();
});
