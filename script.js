document.addEventListener('DOMContentLoaded', () => {

    const appState = {
        subject: 'math',
        mathMode: 'solve_any',
        user: null,
        notes: [],
        currentIndex: -1
    };

    const ui = {
        body: document.body,
        navBtns: document.querySelectorAll('.subj-btn'),
        mathView: document.getElementById('mathView'),
        aiView: document.getElementById('aiView'),
        aiTitle: document.getElementById('aiTitle'),
        mathModeTrigger: document.getElementById('mathModeTrigger'),
        mathModeOptions: document.getElementById('mathModeOptions'),
        mathInput: document.getElementById('mathInput'),
        solveBtn: document.getElementById('solveMathBtn'),
        aiSolveBtn: document.getElementById('solveMathAiBtn'),
        solutionBox: document.getElementById('mathSolution'),
        canvas: document.getElementById('mathCanvas'),
        ctx: document.getElementById('mathCanvas').getContext('2d'),
        aiPrompt: document.getElementById('aiPrompt'),
        aiResponse: document.getElementById('aiResponse'),
        askAiBtn: document.getElementById('askAiBtn'),
        loginBtn: document.getElementById('loginBtn'),
        notesBtn: document.getElementById('notesBtn'),
        notesModal: document.getElementById('notesModal'),
        notesTabs: document.getElementById('notesTabs'),
        noteTitle: document.getElementById('noteTitleInput'),
        noteContent: document.getElementById('noteContentInput'),
        saveNoteBtn: document.getElementById('saveNoteBtn'),
        deleteNoteBtn: document.getElementById('deleteNoteBtn'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        sidebar: document.getElementById('mobileSidebar'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        settingsBtn: document.getElementById('settingsBtn'),
        settingsModal: document.getElementById('settingsModal'),
        applySettingsBtn: document.getElementById('applySettingsBtn'),
        notifArea: document.getElementById('notificationArea'),
        graphCard: document.getElementById('graphCard')
    };

    const setupUI = () => {
        ui.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sub = btn.dataset.subject;
                appState.subject = sub;
                ui.navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ui.body.className = `theme-${sub}`;
                
                if (sub === 'math') {
                    ui.mathView.classList.remove('hidden');
                    ui.aiView.classList.add('hidden');
                } else {
                    ui.mathView.classList.add('hidden');
                    ui.aiView.classList.remove('hidden');
                    ui.aiTitle.innerText = sub.charAt(0).toUpperCase() + sub.slice(1) + " Assistant";
                }
            });
        });

        ui.mathModeTrigger.addEventListener('click', () => {
            ui.mathModeOptions.classList.toggle('hidden');
        });

        document.querySelectorAll('#mathModeOptions .custom-option').forEach(opt => {
            opt.addEventListener('click', () => {
                appState.mathMode = opt.dataset.value;
                ui.mathModeTrigger.innerText = opt.innerText;
                ui.mathModeOptions.classList.add('hidden');
                
                if (appState.mathMode.includes('triangle') || appState.mathMode === 'solve_any') {
                    ui.graphCard.classList.add('hidden');
                } else {
                    ui.graphCard.classList.remove('hidden');
                    drawCoordinateSystem();
                }
            });
        });

        ui.mobileMenuBtn.addEventListener('click', () => {
            ui.sidebar.classList.add('open');
            ui.sidebarOverlay.classList.add('open');
        });

        const closeSidebar = () => {
            ui.sidebar.classList.remove('open');
            ui.sidebarOverlay.classList.remove('open');
        };

        ui.sidebarOverlay.addEventListener('click', closeSidebar);
        document.getElementById('closeSidebarBtn').addEventListener('click', closeSidebar);
    };

    const notify = (msg) => {
        const div = document.createElement('div');
        div.className = 'notification';
        div.innerText = msg;
        ui.notifArea.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    };

    const mathEngine = {
        parseFraction: (num, den) => {
            return `<span class="frac"><span>${num}</span><span class="bottom">${den}</span></span>`;
        },

        evaluateExpression: (str) => {
            try {
                const sanitized = str.replace(/[^-()\d/*+.]/g, '');
                return Function(`'use strict'; return (${sanitized})`)();
            } catch (e) {
                return null;
            }
        },

        formatStep: (label, val) => {
            return `<div class="step-block"><span class="step-label">${label}</span><div class="step-val">${val}</div></div>`;
        },

        solveLinear: (input) => {
            let equation = input.replace(/\s+/g, '');
            if (!equation.includes('y=')) equation = 'y=' + equation;
            
            const regex = /y=([-+]?\d*\.?\d*)?x?([-+]?\d*\.?\d*)?/;
            const match = equation.match(regex);
            
            if (!match) throw new Error("Format error. Use y = mx + b");
            
            let m = parseFloat(match[1]);
            if (isNaN(m)) m = equation.includes('-x') ? -1 : 1;
            if (!equation.includes('x')) m = 0;
            
            let b = parseFloat(match[2]) || 0;
            if (m === 0) b = parseFloat(match[1]) || 0;

            let html = mathEngine.formatStep("Equation Type", "Linear Slope-Intercept");
            html += mathEngine.formatStep("Slope (m)", m);
            html += mathEngine.formatStep("Y-Intercept (b)", b);
            
            if (m !== 0) {
                const xInt = -b / m;
                html += mathEngine.formatStep("X-Intercept", `(${xInt.toFixed(2)}, 0)`);
            }
            
            html += `<div class="final-ans">Line graphs through (0, ${b}) with a slope of ${m}</div>`;
            ui.solutionBox.innerHTML = html;
            
            drawCoordinateSystem();
            drawLinearLine(m, b);
        },

        solveGeometry: (input) => {
            const points = input.match(/-?\d+(\.\d+)?/g);
            if (!points || points.length < 4) throw new Error("Provide 2 points: (x,y) (x,y)");
            
            const x1 = parseFloat(points[0]), y1 = parseFloat(points[1]);
            const x2 = parseFloat(points[2]), y2 = parseFloat(points[3]);
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            
            let html = mathEngine.formatStep("Point A", `(${x1}, ${y1})`);
            html += mathEngine.formatStep("Point B", `(${x2}, ${y2})`);
            html += mathEngine.formatStep("Distance Formula", `√[(${x2}-${x1})² + (${y2}-${y1})²]`);
            html += mathEngine.formatStep("Total Distance", dist.toFixed(3));
            html += mathEngine.formatStep("Midpoint", `(${midX}, ${midY})`);
            
            ui.solutionBox.innerHTML = html;
            drawCoordinateSystem();
            drawPoint(x1, y1, 'red');
            drawPoint(x2, y2, 'blue');
        },

        solveTriangle: (input, type) => {
            const angles = input.match(/\d+(\.\d+)?/g);
            if (!angles || angles.length < 2) throw new Error("Need at least 2 angles.");
            
            const a = parseFloat(angles[0]);
            const b = parseFloat(angles[1]);
            
            if (type === 'interior') {
                const c = 180 - (a + b);
                if (c <= 0) throw new Error("Sum of angles exceeds 180°");
                let html = mathEngine.formatStep("Angle A", a + "°");
                html += mathEngine.formatStep("Angle B", b + "°");
                html += mathEngine.formatStep("Calculation", `180 - (${a} + ${b})`);
                html += `<div class="final-ans">Missing Angle: ${c}°</div>`;
                ui.solutionBox.innerHTML = html;
            } else {
                const ext = a + b;
                let html = mathEngine.formatStep("Interior 1", a + "°");
                html += mathEngine.formatStep("Interior 2", b + "°");
                html += mathEngine.formatStep("Theorem", "Exterior angle = Sum of remote interiors");
                html += `<div class="final-ans">Exterior Angle: ${ext}°</div>`;
                ui.solutionBox.innerHTML = html;
            }
        }
    };

    const drawCoordinateSystem = () => {
        const c = ui.canvas;
        const ctx = ui.ctx;
        ctx.clearRect(0, 0, c.width, c.height);
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        const spacing = 25;
        
        for(let i = 0; i < c.width; i += spacing) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, c.height); ctx.stroke();
        }
        for(let i = 0; i < c.height; i += spacing) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(c.width, i); ctx.stroke();
        }
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(c.width/2, 0); ctx.lineTo(c.width/2, c.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, c.height/2); ctx.lineTo(c.width, c.height/2); ctx.stroke();
    };

    const toCanvasX = (x) => ui.canvas.width/2 + (x * 25);
    const toCanvasY = (y) => ui.canvas.height/2 - (y * 25);

    const drawPoint = (x, y, color) => {
        ui.ctx.fillStyle = color;
        ui.ctx.beginPath();
        ui.ctx.arc(toCanvasX(x), toCanvasY(y), 5, 0, Math.PI*2);
        ui.ctx.fill();
    };

    const drawLinearLine = (m, b) => {
        ui.ctx.strokeStyle = appState.subject === 'math' ? '#0ea5e9' : '#000';
        ui.ctx.lineWidth = 3;
        ui.ctx.beginPath();
        const xStart = -20;
        const xEnd = 20;
        ui.ctx.moveTo(toCanvasX(xStart), toCanvasY(m * xStart + b));
        ui.ctx.lineTo(toCanvasX(xEnd), toCanvasY(m * xEnd + b));
        ui.ctx.stroke();
    };

    const callAI = async (prompt, system) => {
        if (!window.puter) return "Error: Puter unavailable";
        try {
            if (!puter.auth.isSignedIn()) {
                await puter.auth.signIn();
            }
            const res = await puter.ai.chat(`${system}\n\nUser: ${prompt}`, { model: 'gpt-4o-mini' });
            let content = res.message.content;
            return content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        } catch (e) {
            return "Failed to contact AI helper.";
        }
    };

    ui.solveBtn.addEventListener('click', () => {
        const val = ui.mathInput.innerText.trim();
        if (!val) return notify("Enter a problem first");

        try {
            switch(appState.mathMode) {
                case 'linear': mathEngine.solveLinear(val); break;
                case 'geometry': mathEngine.solveGeometry(val); break;
                case 'triangle_in': mathEngine.solveTriangle(val, 'interior'); break;
                case 'triangle_ex': mathEngine.solveTriangle(val, 'exterior'); break;
                case 'algebra': 
                    const res = mathEngine.evaluateExpression(val);
                    ui.solutionBox.innerHTML = mathEngine.formatStep("Arithmetic Result", res);
                    break;
                default: 
                    notify("Use the AI Solver for complex questions");
            }
        } catch (e) {
            ui.solutionBox.innerHTML = `<div style="color:red">Error: ${e.message}</div>`;
        }
    });

    ui.aiSolveBtn.addEventListener('click', async () => {
        const val = ui.mathInput.innerText.trim();
        if (!val) return;
        ui.solutionBox.innerHTML = "Thinking...";
        const res = await callAI(val, "You are a math solver. Use plain text, avoid LaTeX. Be simple and clear.");
        ui.solutionBox.innerHTML = res;
    });

    ui.askAiBtn.addEventListener('click', async () => {
        const p = ui.aiPrompt.value.trim();
        if (!p) return;
        ui.aiResponse.innerHTML = "Thinking...";
        const sys = `You are a ${appState.subject} tutor. Explain things like I'm 15. No fancy words.`;
        const res = await callAI(p, sys);
        ui.aiResponse.innerHTML = res;
    });

    const noteSystem = {
        load: async () => {
            if (!puter.auth.isSignedIn()) return;
            const data = await puter.kv.get('learning_gpa_notes');
            appState.notes = data ? JSON.parse(data) : [];
            noteSystem.render();
        },
        save: async () => {
            await puter.kv.set('learning_gpa_notes', JSON.stringify(appState.notes));
            notify("Note Saved");
        },
        render: () => {
            ui.notesTabs.innerHTML = '<div class="note-tab" id="newNoteBtn">+ New Note</div>';
            appState.notes.forEach((n, i) => {
                const div = document.createElement('div');
                div.className = `note-tab ${appState.currentIndex === i ? 'active' : ''}`;
                div.innerText = n.title || 'Untitled';
                div.onclick = () => {
                    appState.currentIndex = i;
                    ui.noteTitle.value = n.title;
                    ui.noteContent.innerHTML = n.content;
                    ui.deleteNoteBtn.classList.remove('hidden');
                    noteSystem.render();
                };
                ui.notesTabs.appendChild(div);
            });
            document.getElementById('newNoteBtn').onclick = () => {
                appState.currentIndex = -1;
                ui.noteTitle.value = '';
                ui.noteContent.innerHTML = '';
                ui.deleteNoteBtn.classList.add('hidden');
                noteSystem.render();
            };
        }
    };

    ui.saveNoteBtn.addEventListener('click', () => {
        const n = { title: ui.noteTitle.value, content: ui.noteContent.innerHTML };
        if (appState.currentIndex === -1) {
            appState.notes.push(n);
            appState.currentIndex = appState.notes.length - 1;
        } else {
            appState.notes[appState.currentIndex] = n;
        }
        noteSystem.save();
        noteSystem.render();
    });

    ui.notesBtn.addEventListener('click', () => {
        ui.notesModal.classList.remove('hidden');
        noteSystem.load();
    });

    document.getElementById('closeNotesBtn').addEventListener('click', () => {
        ui.notesModal.classList.add('hidden');
    });

    ui.loginBtn.addEventListener('click', async () => {
        if (puter.auth.isSignedIn()) {
            puter.auth.signOut();
            location.reload();
        } else {
            await puter.auth.signIn();
            location.reload();
        }
    });

    const checkAuth = () => {
        if (puter.auth.isSignedIn()) {
            ui.loginBtn.innerText = "Logout";
            ui.notesBtn.classList.remove('hidden');
        }
    };

    setupUI();
    checkAuth();
    drawCoordinateSystem();

});
