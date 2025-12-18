document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const navBtns = document.querySelectorAll('.nav-btn');
    const mathView = document.getElementById('mathView');
    const aiView = document.getElementById('aiView');
    const aiTitle = document.getElementById('aiTitle');
    
    const mathModeTrigger = document.getElementById('mathModeTrigger');
    const mathModeOptions = document.getElementById('mathModeOptions');
    let currentMathMode = 'algebra';

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
        if(btn.dataset.subject) {
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
        }
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

    if (mathModeTrigger) {
        mathModeTrigger.addEventListener('click', () => {
            mathModeOptions.classList.toggle('hidden');
        });

        document.querySelectorAll('#mathModeOptions .custom-option').forEach(option => {
            option.addEventListener('click', () => {
                currentMathMode = option.dataset.value;
                mathModeTrigger.textContent = option.textContent;
                mathModeOptions.classList.add('hidden');
                
                solutionBox.innerHTML = '<div class="empty-state"><span>Answer and steps will appear here.</span></div>';
                mathInput.innerHTML = '';
                
                if (currentMathMode.includes('triangle')) {
                    graphCard.classList.add('hidden');
                    mathInput.setAttribute('placeholder', "Ex: 35 and 58");
                } else {
                    graphCard.classList.remove('hidden');
                    setTimeout(drawGrid, 10);
                    if (currentMathMode === 'algebra') mathInput.setAttribute('placeholder', "Ex: 3(x+2) = 15 or 5 + 10 / 2");
                    else if (currentMathMode === 'linear') mathInput.setAttribute('placeholder', "Ex: y = -x - 5");
                    else if (currentMathMode === 'intercepts') mathInput.setAttribute('placeholder', "Ex: x-intercept 2, y-intercept 3");
                    else if (currentMathMode === 'geometry') mathInput.setAttribute('placeholder', "Ex: (1,2) and (4,6)");
                }
            });
        });
    }

    if (suggestionGenreTrigger) {
        suggestionGenreTrigger.addEventListener('click', () => {
            suggestionGenreOptions.classList.toggle('hidden');
        });

        document.querySelectorAll('#suggestionGenreOptions .custom-option').forEach(option => {
            option.addEventListener('click', () => {
                const val = option.dataset.value;
                suggestionGenreTrigger.textContent = val;
                suggestionGenreOptions.classList.add('hidden');
                
                if(val === 'AI Features') {
                    suggestionLabel.textContent = "What AI Features should be changed / added?";
                    suggestionInput.placeholder = "what ai features should i add onto the site?";
                } else if(val === 'Website changes') {
                    suggestionLabel.textContent = "What Website changes should be changed / added?";
                    suggestionInput.placeholder = "what should i change of the website design?";
                } else {
                    suggestionLabel.textContent = "What Geometry changes should be changed / added?";
                    suggestionInput.placeholder = "what should i add onto this website for more geometry questions that will be more supported?";
                }
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (mathModeTrigger && !mathModeTrigger.contains(e.target) && !mathModeOptions.contains(e.target)) {
            mathModeOptions.classList.add('hidden');
        }
        if (suggestionGenreTrigger && !suggestionGenreTrigger.contains(e.target) && !suggestionGenreOptions.contains(e.target)) {
            suggestionGenreOptions.classList.add('hidden');
        }
    });

    mathInput.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const text = mathInput.textContent;
            
            const fractionMatch = text.match(/(\d+)\/(\d+)/);
            if (fractionMatch) {
                const fullStr = fractionMatch[0];
                const num = fractionMatch[1];
                const den = fractionMatch[2];
                const fracHTML = `<span class="frac"><span>${num}</span><span class="symbol">/</span><span class="bottom">${den}</span></span>&nbsp;`;
                
                mathInput.innerHTML = mathInput.innerHTML.replace(fullStr, fracHTML);
                
                const range = document.createRange();
                range.selectNodeContents(mathInput);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                e.preventDefault(); 
            }
        }
    });

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        notificationArea.appendChild(notif);
        
        requestAnimationFrame(() => notif.classList.add('show'));
        
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3000);
    }

    function handleDiscordClick(btn) {
        if(btn) {
            navigator.clipboard.writeText("https://discord.gg/eKC5CgEZbT");
            const originalText = btn.textContent;
            btn.textContent = "Copied!";
            btn.classList.add('copied');
            showNotification("Discord invite copied to clipboard!");
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }
    }

    if(discordBtn) discordBtn.addEventListener('click', () => handleDiscordClick(discordBtn));
    if(mobileDiscordBtn) mobileDiscordBtn.addEventListener('click', () => handleDiscordClick(mobileDiscordBtn));

    function handleDocsClick() {
        window.location.href = 'document/';
    }

    if(docsBtn) docsBtn.addEventListener('click', handleDocsClick);
    if(mobileDocsBtn) mobileDocsBtn.addEventListener('click', handleDocsClick);

    function openSuggestionModal() {
        if(suggestionModal) {
            suggestionModal.classList.remove('hidden');
            closeSidebar();
        }
    }

    if(suggestionBtn) suggestionBtn.addEventListener('click', openSuggestionModal);
    if(mobileSuggestionBtn) mobileSuggestionBtn.addEventListener('click', openSuggestionModal);
    if(closeSuggestionBtn) closeSuggestionBtn.addEventListener('click', () => suggestionModal.classList.add('hidden'));

    if(submitSuggestionBtn) {
        submitSuggestionBtn.addEventListener('click', async () => {
            const genre = suggestionGenreTrigger.textContent;
            const text = suggestionInput.value.trim();
            
            if (!text) {
                alert("Please type a suggestion.");
                return;
            }

            const date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let username = "Guest";
            
            if (window.puter && puter.auth.isSignedIn()) {
                const user = await puter.auth.getUser();
                username = user.username;
            }

            const payload = {
                embeds: [{
                    title: `${genre} * posted @ ${date}`,
                    description: `* ${text}`,
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
            }).catch(() => {
                alert("Failed to submit.");
            });
        });
    }

    function openSettings() {
        settingsModal.classList.remove('hidden');
        closeSidebar();
    }

    if(settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if(mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', openSettings);
    if(closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

    if(applySettingsBtn) {
        applySettingsBtn.addEventListener('click', () => {
            if(settingsTitleInput.value.trim()) {
                document.title = settingsTitleInput.value.trim();
            }
            
            if(settingsIconUrlInput.value.trim()) {
                const dynamicFavicon = document.getElementById('dynamicFavicon');
                dynamicFavicon.href = settingsIconUrlInput.value.trim();
            }

            showNotification("Settings Applied!");
            settingsModal.classList.add('hidden');
        });
    }

    if(iconUpload) {
        iconUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                fileNameDisplay.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dynamicFavicon = document.getElementById('dynamicFavicon');
                    dynamicFavicon.href = e.target.result;
                    showNotification("Website Icon Changed!");
                    settingsModal.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async function checkAuth() {
        if (!window.puter) return;
        try {
            if (puter.auth.isSignedIn()) {
                if(loginBtn) loginBtn.textContent = "Logout";
                if(mobileLoginBtn) mobileLoginBtn.textContent = "Logout";
                if(notesBtn) notesBtn.classList.remove('hidden');
                if(mobileNotesBtn) mobileNotesBtn.classList.remove('hidden');
                loadNotes();
            } else {
                if(loginBtn) loginBtn.textContent = "Login";
                if(mobileLoginBtn) mobileLoginBtn.textContent = "Login";
                if(notesBtn) notesBtn.classList.add('hidden');
                if(mobileNotesBtn) mobileNotesBtn.classList.add('hidden');
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleAuth() {
        if (!window.puter) return;
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
        if (!window.puter || !puter.auth.isSignedIn()) return;
        notesModal.classList.remove('hidden');
        renderTabs();
        closeSidebar();
    }

    if(notesBtn) notesBtn.addEventListener('click', openNotes);
    if(mobileNotesBtn) mobileNotesBtn.addEventListener('click', openNotes);
    if(closeNotesBtn) closeNotesBtn.addEventListener('click', () => notesModal.classList.add('hidden'));

    if(noteContentInput) {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (!selection.isCollapsed && noteContentInput.contains(selection.anchorNode)) {
                boldTextBtn.classList.remove('hidden');
            } else {
                boldTextBtn.classList.add('hidden');
            }
        };

        noteContentInput.addEventListener('mouseup', handleSelection);
        noteContentInput.addEventListener('keyup', handleSelection);

        boldTextBtn.addEventListener('click', () => {
            document.execCommand('bold', false, null);
            noteContentInput.focus();
        });

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
    }

    async function loadNotes() {
        if (!window.puter) return;
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
        if (!window.puter) return;
        try {
            await puter.kv.set('user_notes', JSON.stringify(userNotes));
        } catch (e) {
            console.warn("Save failed");
        }
    }

    function renderTabs() {
        if (!notesTabs) return;
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
        if (contextMenu && !contextMenu.contains(e.target)) {
            contextMenu.classList.add('hidden');
        }
    });

    if(renameNoteOption) {
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

    if(saveNoteBtn) {
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
            showNotification(`${title} has been saved!`);
            renderTabs();
        });
    }

    if(deleteNoteBtn) {
        deleteNoteBtn.addEventListener('click', async () => {
            if (currentNoteIndex > -1) {
                userNotes.splice(currentNoteIndex, 1);
                currentNoteIndex = -1;
                selectNote(-1);
                await saveNotesToCloud();
            }
        });
    }

    if(degreeBtn) {
        degreeBtn.addEventListener('click', () => {
            mathInput.textContent += '°';
            mathInput.focus();
        });
    }

    if(solveBtn) {
        solveBtn.addEventListener('click', () => {
            const input = mathInput.textContent.toLowerCase().trim();
            solutionBox.innerHTML = '';

            if (!input) {
                solutionBox.innerHTML = '<span style="color:red">Please type a problem first.</span>';
                return;
            }

            try {
                if (currentMathMode === 'algebra') solveAlgebra(input);
                else if (currentMathMode === 'linear') solveLinear(input);
                else if (currentMathMode === 'intercepts') solveIntercepts(input);
                else if (currentMathMode === 'geometry') solveGeometry(input);
                else if (currentMathMode === 'triangle_in') solveTriangleInterior(input);
                else if (currentMathMode === 'triangle_ex') solveTriangleExterior(input);
            } catch (e) {
                solutionBox.innerHTML = `<span style="color:red"><strong>Error:</strong> ${e.message}</span>`;
            }
        });
    }

    function cleanMathOutput(text) {
        let cleaned = text
            .replace(/^---$/gm, '<hr class="ai-line">')
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
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/\n/g, '<br>');

        cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '<span class="frac"><span>$1</span><span class="symbol">/</span><span class="bottom">$2</span></span>');
        
        return cleaned;
    }

    async function callPuterAI(prompt, systemPrompt) {
        if (!window.puter) {
            return "Puter.js library not loaded. Check internet connection.";
        }
        try {
            if (!puter.auth.isSignedIn()) {
                await puter.auth.signIn();
                return "Please try again after logging in.";
            }

            const resp = await puter.ai.chat(`${systemPrompt}\n\nUser Question: ${prompt}`, { model: 'gpt-4o-mini' });
            return cleanMathOutput(resp.message.content);
        } catch (e) {
            console.error(e);
            return "Unable to connect to AI. Please ensure you are logged in and connected to the internet.";
        }
    }

    if(solveMathAiBtn) {
        solveMathAiBtn.addEventListener('click', async () => {
            const input = mathInput.textContent.trim();
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
    }

    if(askAiBtn) {
        askAiBtn.addEventListener('click', async () => {
            const prompt = aiPrompt.value.trim();
            if (!prompt) return;

            aiResponse.innerHTML = '<span style="color:var(--primary)">Thinking...</span>';

            let sysPrompt = "You are a helpful tutor. Do not use LaTeX. Use simple readable symbols.";
            if (currentSubject === 'math') sysPrompt = "You are a Math tutor. Be very precise. Solve step-by-step using simple words. No LaTeX.";
            if (currentSubject === 'english') sysPrompt = "You are an English tutor. Help with essays, grammar, and literature.";
            if (currentSubject === 'history') sysPrompt = "You are a History tutor. Explain context, dates, and events accurately.";
            if (currentSubject === 'science') sysPrompt = "You are a Science tutor. Explain concepts accurately.";

            try {
                const result = await callPuterAI(prompt, sysPrompt);
                aiResponse.innerHTML = result;
            } catch (e) {
                aiResponse.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
            }
        });
    }

    function solveAlgebra(input) {
        try {
            const clean = input.replace(/[^0-9+\-*/().]/g, '');
            if(!clean) throw new Error("Please enter a valid arithmetic expression.");
            
            const result = new Function('return ' + clean)();
            let html = `<span class="step-header">Simplification</span>`;
            html += `${clean} = <strong>${result}</strong>`;
            solutionBox.innerHTML = html;
        } catch(e) {
            throw new Error("Invalid algebra expression.");
        }
    }

    function solveTriangleExterior(input) {
        const nums = input.match(/(\d+(\.\d+)?)/g);
        if (!nums || nums.length < 2) throw new Error("Need two interior angles.");
        
        const a1 = parseFloat(nums[0]);
        const a2 = parseFloat(nums[1]);

        if (a1 <= 0 || a2 <= 0) throw new Error("Angles must be positive.");
        
        const exterior = parseFloat((a1 + a2).toFixed(2));

        let html = `<span class="step-header">Given Interior Angles</span>`;
        html += `Angle A = ${a1}°<br>Angle B = ${a2}°`;
        html += `<hr class="step-line">`;
        html += `<span class="step-header">Theorem: Exterior Angle Theorem</span>`;
        html += `The exterior angle equals the sum of the two opposite interior angles.<br><br>`;
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
        
        let m = 0, b = 0;
        
        if (/^x\s*=\s*([+-]?\d*\.?\d*)$/.test(input.replace(/\s+/g, ''))) {
             throw new Error("This is a vertical line. Slope is undefined.");
        }

        let match = clean.match(/^([+-]?\d*\.?\d*)?x([+-]?\d*\.?\d*)?$/);
        
        if (!match) {
            clean = clean.replace(/\+/g, ' +').replace(/-/g, ' -'); 
            match = clean.match(/([+-]?\d*\.?\d*)x\s*([+-]?\d*\.?\d*)?/);
        }

        if (match) {
            let mStr = match[1];
            let bStr = match[2];

            if (mStr === undefined || mStr === '' || mStr.trim() === '+') m = 1;
            else if (mStr.trim() === '-') m = -1;
            else m = parseFloat(mStr);

            if (bStr === undefined || bStr === '') b = 0;
            else b = parseFloat(bStr);
        } else {
            const constMatch = clean.match(/^([+-]?\d*\.?\d*)$/);
            if (constMatch) {
                m = 0;
                b = parseFloat(constMatch[1]);
            } else {
                
                if (clean.includes('x') && clean.includes('y')) {
                     throw new Error("Please convert to Slope-Intercept form (y = mx + b) first.");
                }
                throw new Error("Format not recognized. Try y=mx+b");
            }
        }

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
