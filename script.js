const themes = {
    math: {
        bgClass: 'theme-math',
        headerColor: 'bg-emerald-700',
        btnColor: 'bg-emerald-600',
        textColor: 'text-gray-800',
        title: 'Math Solver',
        desc: 'Precise coordinates, graphing, and geometry solutions.',
        prompt: 'You are a Math expert. Provide clear, step-by-step solutions for algebra, geometry, and calculus. Use LaTeX formatting where possible for clarity.'
    },
    english: {
        bgClass: 'theme-english',
        headerColor: 'bg-amber-800',
        btnColor: 'bg-amber-700',
        textColor: 'text-amber-900',
        title: 'English & Literature',
        desc: 'Grammar correction, essay improvement, and literary analysis.',
        prompt: 'You are an English professor. Help with grammar, essay structure, tone, and literary analysis. Do NOT answer math questions. Focus on clarity and elegance in writing.'
    },
    history: {
        bgClass: 'theme-history',
        headerColor: 'bg-stone-700',
        btnColor: 'bg-stone-600',
        textColor: 'text-stone-900',
        title: 'History Archive',
        desc: 'Explore the past, understand timelines, and analyze events.',
        prompt: 'You are a Historian. Explain historical events, contexts, and timelines accurately. Use a formal, academic yet engaging tone.'
    },
    science: {
        bgClass: 'theme-science',
        headerColor: 'bg-indigo-900',
        btnColor: 'bg-indigo-600',
        textColor: 'text-white',
        title: 'Science Lab',
        desc: 'Biology, Chemistry, and Physics explanations and formulas.',
        prompt: 'You are a Scientist. Explain concepts in Biology, Chemistry, and Physics. Solve scientific formulas and explain the phenomena.'
    }
};

let currentSubject = 'math';
let apiKey = localStorage.getItem('geminiKey') || '';

const mathInput = document.getElementById('mathInput');
const mathMode = document.getElementById('mathMode');
const solutionBox = document.getElementById('mathSolution');
const canvas = document.getElementById('mathCanvas');
const ctx = canvas.getContext('2d');
const graphContainer = document.getElementById('graphContainer');

const aiInterface = document.getElementById('aiInterface');
const mathInterface = document.getElementById('mathInterface');
const aiPrompt = document.getElementById('aiPrompt');
const aiResponse = document.getElementById('aiResponse');
const aiOutputCard = document.getElementById('aiOutputCard');

document.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.subject-btn').forEach(b => {
            b.classList.remove('bg-gray-200', 'text-black', 'bg-opacity-20');
            b.style.backgroundColor = '';
            b.style.color = '';
        });
        
        currentSubject = e.target.dataset.subject;
        updateTheme();
    });
});

document.getElementById('openSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('hidden');
    document.getElementById('apiKeyInput').value = apiKey;
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('hidden');
});

document.getElementById('saveKey').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('geminiKey', key);
        document.getElementById('settingsModal').classList.add('hidden');
        alert('API Key Saved Securely');
    }
});

function updateTheme() {
    const theme = themes[currentSubject];
    const body = document.body;
    
    body.className = `transition-colors duration-500 ${theme.bgClass}`;
    
    const header = document.getElementById('heroHeader');
    header.className = `text-center py-10 px-4 text-white relative overflow-hidden transition-all duration-500 ${theme.headerColor}`;
    
    document.getElementById('aiSubmitBtn').className = `py-3 px-8 rounded-lg text-white font-bold text-lg shadow-lg transition transform active:scale-95 ${theme.btnColor} hover:opacity-90`;
    
    document.getElementById('aiTitle').textContent = theme.title;
    document.getElementById('aiDesc').textContent = theme.desc;

    if (currentSubject === 'math') {
        mathInterface.classList.remove('hidden');
        aiInterface.classList.add('hidden');
    } else {
        mathInterface.classList.add('hidden');
        aiInterface.classList.remove('hidden');
        document.getElementById('aiIcon').textContent = 
            currentSubject === 'english' ? '📖' : 
            currentSubject === 'history' ? '📜' : '🧪';
        
        const ta = document.getElementById('aiPrompt');
        ta.value = '';
        ta.placeholder = currentSubject === 'english' ? "Paste your essay here for review..." :
                        currentSubject === 'history' ? "Ask about the Roman Empire..." :
                        "Explain photosynthesis...";
        aiOutputCard.classList.add('hidden');
    }
}

document.getElementById('solveMathBtn').addEventListener('click', solveMath);
mathMode.addEventListener('change', () => {
    solutionBox.innerHTML = 'Answer will appear here.';
    mathInput.value = '';
    const mode = mathMode.value;
    
    if (mode === 'triangle') {
        graphContainer.classList.add('hidden');
        mathInput.placeholder = "Ex: 35, 58";
    } else {
        graphContainer.classList.remove('hidden');
        drawGrid();
        if (mode === 'linear') mathInput.placeholder = "Ex: y = -x - 5";
        else if (mode === 'intercepts') mathInput.placeholder = "Ex: x: -6, y: 1";
        else mathInput.placeholder = "Ex: (2,3) and (5,7)";
    }
});

function solveMath() {
    const input = mathInput.value.toLowerCase().trim();
    const mode = mathMode.value;
    solutionBox.innerHTML = '';
    
    try {
        if (mode === 'triangle') solveTriangle(input);
        else if (mode === 'linear') solveLinear(input);
        else if (mode === 'intercepts') solveIntercepts(input);
        else if (mode === 'geometry') solveGeometry(input);
    } catch (e) {
        solutionBox.innerHTML = `<span class="text-red-600 font-bold">Error:</span> Please check your input format.`;
    }
}

function solveTriangle(input) {
    const nums = input.match(/(\d+(\.\d+)?)/g);
    if (!nums || nums.length < 2) {
        throw new Error("Invalid input");
    }
    const a1 = parseFloat(nums[0]);
    const a2 = parseFloat(nums[1]);

    if (a1 <= 0 || a2 <= 0 || a1 >= 180 || a2 >= 180) {
        solutionBox.innerHTML = "Angles must be greater than 0° and less than 180°.";
        return;
    }
    
    if (a1 + a2 >= 180) {
        solutionBox.innerHTML = `Sum is ${a1+a2}°. These angles cannot form a triangle (Sum must be < 180°).`;
        return;
    }

    const x = 180 - (a1 + a2);
    let html = `<strong>Method: Triangle Angle Sum Theorem</strong>\n`;
    html += `Theorem: Sum of interior angles = 180°\n`;
    html += `Formula: x = 180° - (A + B)\n`;
    html += `Substitution: x = 180° - (${a1}° + ${a2}°)\n`;
    html += `Step: x = 180° - ${a1+a2}°\n`;
    html += `<strong>Final Answer: x = ${Number(x.toFixed(2))}°</strong>`;
    
    solutionBox.innerHTML = html;
}

function solveLinear(input) {
    const clean = input.replace(/\s+/g, '');
    if (!clean.startsWith('y=')) throw new Error();
    
    const right = clean.split('=')[1];
    let m = 1, b = 0;
    
    if (right.includes('x')) {
        const parts = right.split('x');
        const mStr = parts[0];
        const bStr = parts[1];
        
        if (mStr === '' || mStr === '+') m = 1;
        else if (mStr === '-') m = -1;
        else m = parseFloat(mStr);
        
        b = bStr ? parseFloat(bStr) : 0;
    } else {
        m = 0;
        b = parseFloat(right);
    }
    
    const xInt = m !== 0 ? -b/m : null;
    
    let html = `<strong>Linear Equation Analysis</strong>\n`;
    html += `Slope (m): ${m}\n`;
    html += `Y-Intercept (b): ${b} → Point (0, ${b})\n`;
    if (xInt !== null) {
        html += `X-Intercept calculation: 0 = ${m}x + ${b} → ${-b} = ${m}x → x = ${Number(xInt.toFixed(2))}\n`;
        html += `X-Intercept Point: (${Number(xInt.toFixed(2))}, 0)\n`;
    }
    
    solutionBox.innerHTML = html;
    drawGrid();
    drawLine(m, b);
    drawDot(0, b, '#ef4444'); 
    if (xInt !== null) drawDot(xInt, 0, '#3b82f6');
}

function solveIntercepts(input) {
    const xMatch = input.match(/x[:=]\s*(-?\d+(\.\d+)?)/);
    const yMatch = input.match(/y[:=]\s*(-?\d+(\.\d+)?)/);
    
    if (!xMatch || !yMatch) {
        const nums = input.match(/-?\d+(\.\d+)?/g);
        if (nums && nums.length >= 2) {
            const xInt = parseFloat(nums[0]);
            const yInt = parseFloat(nums[1]);
            processIntercepts(xInt, yInt);
        } else {
            throw new Error();
        }
    } else {
        processIntercepts(parseFloat(xMatch[1]), parseFloat(yMatch[1]));
    }
}

function processIntercepts(xInt, yInt) {
    let m = (yInt - 0) / (0 - xInt);
    let b = yInt;
    
    let html = `<strong>Finding Equation from Intercepts</strong>\n`;
    html += `Points identified: (${xInt}, 0) and (0, ${yInt})\n`;
    html += `Slope Formula: m = (y2 - y1) / (x2 - x1)\n`;
    html += `Substitution: m = (${yInt} - 0) / (0 - (${xInt})) = ${yInt} / ${-xInt} = ${Number(m.toFixed(2))}\n`;
    html += `<strong>Equation: y = ${Number(m.toFixed(2))}x + ${b}</strong>`;
    
    solutionBox.innerHTML = html;
    drawGrid();
    drawLine(m, b);
    drawDot(xInt, 0, '#3b82f6');
    drawDot(0, yInt, '#ef4444');
}

function solveGeometry(input) {
    const nums = input.match(/-?\d+(\.\d+)?/g);
    if (!nums || nums.length < 4) throw new Error();
    
    const x1 = parseFloat(nums[0]), y1 = parseFloat(nums[1]);
    const x2 = parseFloat(nums[2]), y2 = parseFloat(nums[3]);
    
    const d = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    const mx = (x1+x2)/2;
    const my = (y1+y2)/2;
    let slope = "Undefined";
    if (x2 !== x1) {
        slope = (y2-y1)/(x2-x1);
        slope = Number(slope.toFixed(2));
    }
    
    let html = `<strong>Coordinate Geometry</strong>\n`;
    html += `Points: (${x1}, ${y1}) and (${x2}, ${y2})\n`;
    html += `Distance Formula: √[(x2-x1)² + (y2-y1)²]\n`;
    html += `Distance: ${Number(d.toFixed(2))}\n`;
    html += `Midpoint: ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my})\n`;
    html += `Slope: ${slope}`;
    
    solutionBox.innerHTML = html;
    drawGrid();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();
    drawDot(x1, y1, '#3b82f6');
    drawDot(x2, y2, '#3b82f6');
    drawDot(mx, my, '#10b981');
}

function mapX(x) { return 300 + (x * 20); }
function mapY(y) { return 200 - (y * 20); }

function drawGrid() {
    ctx.clearRect(0,0,600,400);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for(let x=0; x<=600; x+=20) {
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,400); ctx.stroke();
    }
    for(let y=0; y<=400; y+=20) {
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(600,y); ctx.stroke();
    }
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(300,0); ctx.lineTo(300,400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,200); ctx.lineTo(600,200); ctx.stroke();
}

function drawLine(m, b) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const x1 = -15; const y1 = m*x1 + b;
    const x2 = 15; const y2 = m*x2 + b;
    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();
}

function drawDot(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(mapX(x), mapY(y), 5, 0, Math.PI*2);
    ctx.fill();
}

drawGrid();
updateTheme();

document.getElementById('aiSubmitBtn').addEventListener('click', callGemini);
document.getElementById('mathAiBtn').addEventListener('click', () => callGeminiMath());

async function callGeminiMath() {
    const input = document.getElementById('mathAiInput').value;
    const responseBox = document.getElementById('mathAiResponse');
    if (!input) return;
    if (!apiKey) {
        alert("Please enter your API Key in Settings first.");
        return;
    }
    
    responseBox.classList.remove('hidden');
    responseBox.textContent = "Solving with AI...";
    
    try {
        const text = await fetchGemini(input, themes.math.prompt);
        responseBox.textContent = text;
    } catch (err) {
        responseBox.textContent = "Error connecting to AI. Check your Key.";
    }
}

async function callGemini() {
    const input = aiPrompt.value;
    if (!input) return;
    if (!apiKey) {
        alert("Please enter your API Key in Settings first.");
        return;
    }
    
    const btn = document.getElementById('aiSubmitBtn');
    btn.textContent = "Thinking...";
    btn.disabled = true;
    
    try {
        const text = await fetchGemini(input, themes[currentSubject].prompt);
        aiOutputCard.classList.remove('hidden');
        aiResponse.textContent = text;
    } catch (err) {
        alert("Error connecting. Check API Key.");
    }
    
    btn.textContent = "Submit";
    btn.disabled = false;
}

async function fetchGemini(userPrompt, systemPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{
                parts: [{ text: systemPrompt + "\nUser Input: " + userPrompt }]
            }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
