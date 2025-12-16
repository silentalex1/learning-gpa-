document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const navBtns = document.querySelectorAll('.nav-btn');
    const mathView = document.getElementById('mathView');
    const aiView = document.getElementById('aiView');
    const aiTitle = document.getElementById('aiTitle');
    const mathMode = document.getElementById('mathMode');
    const mathInput = document.getElementById('mathInput');
    const mathSolution = document.getElementById('mathSolution');
    const canvas = document.getElementById('mathCanvas');
    const ctx = canvas.getContext('2d');
    const graphCard = document.getElementById('graphCard');
    const degreeBtn = document.getElementById('degreeBtn');
    
    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const askAiBtn = document.getElementById('askAiBtn');
    const aiPrompt = document.getElementById('aiPrompt');
    const aiResponse = document.getElementById('aiResponse');

    let currentSubject = 'math';
    let apiKey = localStorage.getItem('geminiKey') || '';

    
    apiKeyInput.value = apiKey;

    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    
    saveKeyBtn.addEventListener('click', () => {
        apiKey = apiKeyInput.value.trim();
        localStorage.setItem('geminiKey', apiKey);
        settingsModal.classList.add('hidden');
        alert('API Key Saved Securely');
    });

    
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
                drawGrid();
            } else {
                mathView.classList.add('hidden');
                aiView.classList.remove('hidden');
                aiTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1) + " Helper";
                aiResponse.innerHTML = `<span class="placeholder">I am ready to help you with ${subject}.</span>`;
            }
        });
    });

    
    mathMode.addEventListener('change', updateMathUI);
    degreeBtn.addEventListener('click', () => { mathInput.value += '°'; mathInput.focus(); });
    document.getElementById('solveMathBtn').addEventListener('click', solveMath);

    function updateMathUI() {
        mathSolution.innerHTML = '<span class="placeholder">Answer and steps will appear here.</span>';
        mathInput.value = '';
        const mode = mathMode.value;

        if (mode.includes('triangle')) {
            graphCard.classList.add('hidden');
            mathInput.placeholder = "Ex: 35 and 58";
        } else {
            graphCard.classList.remove('hidden');
            drawGrid();
            if (mode === 'linear') mathInput.placeholder = "Ex: y = -2x + 4";
            if (mode === 'intercepts') mathInput.placeholder = "Ex: x-intercept 2, y-intercept 3";
            if (mode === 'geometry') mathInput.placeholder = "Ex: (1,2) and (4,6)";
        }
    }

    function solveMath() {
        const input = mathInput.value.toLowerCase().trim();
        const mode = mathMode.value;
        mathSolution.innerHTML = '';

        if (!input) return;

        try {
            if (mode === 'linear') solveLinear(input);
            else if (mode === 'intercepts') solveIntercepts(input);
            else if (mode === 'geometry') solveGeometry(input);
            else if (mode.includes('triangle')) solveTriangle(input, mode);
        } catch (e) {
            mathSolution.innerHTML = `<strong>Error:</strong> ${e.message}`;
        }
    }

    
    function solveTriangle(input, mode) {
        const nums = input.match(/(\d+(\.\d+)?)/g);
        if (!nums || nums.length < 2) throw new Error("Please enter two positive angles.");
        
        const a1 = parseFloat(nums[0]);
        const a2 = parseFloat(nums[1]);

        if (a1 <= 0 || a2 <= 0) throw new Error("Angles must be positive.");
        if (a1 + a2 >= 180) throw new Error("Sum of angles must be less than 180° for a triangle.");

        let html = `<span class="step-heading">Given Values</span>Angle 1 = ${a1}°, Angle 2 = ${a2}°<div class="step-divider"></div>`;

        if (mode === 'triangle_in') {
            const a3 = 180 - (a1 + a2);
            html += `<span class="step-heading">Theorem: Triangle Sum Theorem</span>`;
            html += `Formula: x + ${a1} + ${a2} = 180<br>`;
            html += `Substitution: x = 180 - ${a1 + a2}<br>`;
            html += `<strong>Final Answer: x = ${Number(a3.toFixed(2))}°</strong>`;
        } else {
            const ext = a1 + a2;
            html += `<span class="step-heading">Theorem: Exterior Angle Theorem</span>`;
            html += `Formula: Exterior Angle = Sum of two opposite interior angles<br>`;
            html += `Substitution: x = ${a1} + ${a2}<br>`;
            html += `<strong>Final Answer: x = ${Number(ext.toFixed(2))}°</strong>`;
        }
        mathSolution.innerHTML = html;
    }

    function solveLinear(input) {
        let clean = input.replace(/\s+/g, '').replace('y=', '');
        
        if (clean === '-x') clean = '-1x';
        if (clean === 'x') clean = '1x';
        
        let m = 0, b = 0;
        
        
        if (clean.includes('x')) {
            const parts = clean.split('x');
            let mStr = parts[0];
            let bStr = parts[1];
            
            if (mStr === '' || mStr === '+') m = 1;
            else if (mStr === '-') m = -1;
            else m = parseFloat(mStr);
            
            if (!bStr) b = 0;
            else b = parseFloat(bStr);
        } else {
            m = 0; 
            b = parseFloat(clean);
        }

        if (isNaN(m) || isNaN(b)) throw new Error("Could not parse equation.");

        const xInt = m !== 0 ? -b/m : null;
        
        let html = `<span class="step-heading">Equation Properties</span>`;
        html += `Slope (m): ${m}<br>Y-Intercept (b): ${b}<br>`;
        html += `<div class="step-divider"></div><span class="step-heading">Calculation Steps</span>`;
        html += `1. Plot Y-intercept at (0, ${b})<br>`;
        html += `2. Use slope ${m}/1 to find next point: (1, ${m*1+b})<br>`;
        if (xInt !== null) html += `3. X-Intercept (set y=0): x = ${Number(xInt.toFixed(2))}`;

        mathSolution.innerHTML = html;
        drawGrid();
        drawLine(m, b);
        drawPoint(0, b, 'red');
        if(xInt !== null) drawPoint(xInt, 0, 'blue');
    }

    function solveIntercepts(input) {
        const xMatch = input.match(/x.*?(-?\d+\.?\d*)/);
        const yMatch = input.match(/y.*?(-?\d+\.?\d*)/);
        
        if (!xMatch || !yMatch) throw new Error("Please specify both x and y intercepts.");
        
        const a = parseFloat(xMatch[1]);
        const b = parseFloat(yMatch[1]);

        if (a === 0 && b === 0) throw new Error("Both intercepts cannot be zero (ambiguous line).");

        const m = (b - 0) / (0 - a); 
        const eq = `y = ${Number(m.toFixed(2))}x + ${b}`;

        let html = `<span class="step-heading">Given Intercepts</span>X-int: (${a}, 0), Y-int: (0, ${b})`;
        html += `<div class="step-divider"></div><span class="step-heading">Calculations</span>`;
        html += `Slope Formula: m = (y2 - y1) / (x2 - x1)<br>`;
        html += `Substitution: m = (${b} - 0) / (0 - ${a}) = ${Number(m.toFixed(2))}<br>`;
        html += `<strong>Equation: ${eq}</strong>`;

        mathSolution.innerHTML = html;
        drawGrid();
        drawPoint(a, 0, 'blue');
        drawPoint(0, b, 'red');
        drawLine(m, b);
    }

    function solveGeometry(input) {
        const nums = input.match(/-?\d+(\.\d+)?/g);
        if (!nums || nums.length < 4) throw new Error("Need two coordinate pairs.");
        
        const x1 = parseFloat(nums[0]), y1 = parseFloat(nums[1]);
        const x2 = parseFloat(nums[2]), y2 = parseFloat(nums[3]);

        if (x1 === x2 && y1 === y2) throw new Error("Points are identical. Distance is 0.");

        const d = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        const mx = (x1+x2)/2;
        const my = (y1+y2)/2;
        
        let slopeText = "Undefined (Vertical Line)";
        let eqText = `x = ${x1}`;
        let m = null;

        if (x1 !== x2) {
            m = (y2-y1)/(x2-x1);
            const b = y1 - (m * x1);
            slopeText = Number(m.toFixed(2));
            eqText = `y = ${Number(m.toFixed(2))}x + ${Number(b.toFixed(2))}`;
        }

        let html = `<span class="step-heading">Points: (${x1},${y1}) & (${x2},${y2})</span>`;
        html += `Distance: √[(${x2}-${x1})² + (${y2}-${y1})²] = <strong>${Number(d.toFixed(2))}</strong><br>`;
        html += `Midpoint: ((${x1}+${x2})/2, (${y1}+${y2})/2) = <strong>(${mx}, ${my})</strong><br>`;
        html += `Slope: ${slopeText}<br>`;
        html += `<strong>Line Equation: ${eqText}</strong>`;

        mathSolution.innerHTML = html;
        drawGrid();
        drawPoint(x1, y1, 'blue');
        drawPoint(x2, y2, 'blue');
        drawPoint(mx, my, 'green');
        
        if (m !== null) {
            const b = y1 - (m * x1);
            drawLine(m, b);
        } else {
            
            ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(mapX(x1), 0); ctx.lineTo(mapX(x1), canvas.height);
            ctx.stroke();
        }
    }

    
    function mapX(x) { return (canvas.width / 2) + (x * 20); }
    function mapY(y) { return (canvas.height / 2) - (y * 20); }

    function drawGrid() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height, scale = 20;
        
        ctx.strokeStyle = '#eee'; ctx.lineWidth = 1;
        ctx.fillStyle = '#888'; ctx.font = '10px Arial'; ctx.textAlign = 'center';

        for(let x=0; x<=w; x+=scale) {
            ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
            if(x%(scale*2)===0 && x!==w/2) ctx.fillText((x-w/2)/scale, x, h/2+15);
        }
        for(let y=0; y<=h; y+=scale) {
            ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
            if(y%(scale*2)===0 && y!==h/2) ctx.fillText((h/2-y)/scale, w/2-15, y+3);
        }

        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke();
    }

    function drawPoint(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(mapX(x), mapY(y), 5, 0, Math.PI*2); ctx.fill();
    }

    function drawLine(m, b) {
        ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 3;
        ctx.beginPath();
        const x1 = -15, y1 = m*x1+b;
        const x2 = 15, y2 = m*x2+b;
        ctx.moveTo(mapX(x1), mapY(y1)); ctx.lineTo(mapX(x2), mapY(y2)); ctx.stroke();
    }

    
    askAiBtn.addEventListener('click', async () => {
        if (!apiKey) {
            aiResponse.innerHTML = `<span style="color:red">Please enter your API Key in settings first.</span>`;
            return;
        }

        const prompt = aiPrompt.value.trim();
        if (!prompt) return;

        aiResponse.innerHTML = "Thinking...";
        
        let sysPrompt = "";
        if (currentSubject === 'english') sysPrompt = "You are an English tutor. Help with grammar, essays, and literature. Be concise.";
        if (currentSubject === 'history') sysPrompt = "You are a History tutor. Explain historical events and context. Be concise.";
        if (currentSubject === 'science') sysPrompt = "You are a Science tutor. Explain biology, chemistry, and physics concepts. Be concise.";

        const finalPrompt = `${sysPrompt}\n\nUser Question: ${prompt}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }] })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            
            const text = data.candidates[0].content.parts[0].text;
            
            aiResponse.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        } catch (e) {
            aiResponse.innerHTML = `<span style="color:red">Error: ${e.message}</span>`;
        }
    });

});
