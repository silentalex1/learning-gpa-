document.addEventListener('DOMContentLoaded', () => {
    const solveBtn = document.getElementById('solveBtn');
    const inputField = document.getElementById('problemInput');
    const modeSelect = document.getElementById('modeSelect');
    const solutionBox = document.getElementById('solutionBox');
    const graphSection = document.getElementById('graphSection');
    const canvas = document.getElementById('mathCanvas');
    const ctx = canvas.getContext('2d');
    const degreeBtn = document.getElementById('degreeBtn');
    const guideList = document.getElementById('guideList');

    drawGrid();

    degreeBtn.addEventListener('click', () => {
        inputField.value += '°';
        inputField.focus();
    });

    modeSelect.addEventListener('change', () => {
        solutionBox.innerHTML = '<span class="placeholder-text">Results will appear here accurately.</span>';
        inputField.value = '';
        
        const mode = modeSelect.value;
        
        // Handle Graph Visibility
        if (mode === 'triangle') {
            graphSection.classList.add('hidden');
        } else {
            graphSection.classList.remove('hidden');
            setTimeout(drawGrid, 50); // Redraw grid when becoming visible
        }

        switch (mode) {
            case 'linear':
                inputField.placeholder = "Ex: y = 2x + 4 or y = -x - 5";
                break;
            case 'intercepts':
                inputField.placeholder = "Ex: y-intercept is 1 and x-intercept is -6";
                break;
            case 'geometry':
                inputField.placeholder = "Ex: (2, 3) and (5, 7)";
                break;
            case 'triangle':
                inputField.placeholder = "Ex: 35 and 58";
                break;
        }
    });

    solveBtn.addEventListener('click', () => {
        const input = inputField.value.trim().toLowerCase();
        if (!input) return;

        solutionBox.innerHTML = '';
        const mode = modeSelect.value;

        try {
            if (mode === 'linear') {
                solveLinear(input);
            } else if (mode === 'intercepts') {
                solveIntercepts(input);
            } else if (mode === 'geometry') {
                solveGeometry(input);
            } else if (mode === 'triangle') {
                solveTriangle(input);
            }
        } catch (error) {
            solutionBox.textContent = "Could not solve. Please check your format.";
        }
    });

    function solveTriangle(input) {
        // Extract numbers, ignoring text and symbols
        const matches = input.match(/(\d+(\.\d+)?)/g);
        
        if (!matches || matches.length < 2) {
            solutionBox.innerHTML = "<strong>Error:</strong> Please provide at least two angles (e.g., 35 and 58).";
            return;
        }

        // Convert to numbers
        const angles = matches.map(Number);
        const a1 = angles[0];
        const a2 = angles[1];

        // Prepare calculations
        const exteriorX = parseFloat((a1 + a2).toFixed(2));
        const interiorX = parseFloat((180 - (a1 + a2)).toFixed(2));

        // Generate HTML with Visual Lines
        let html = `<span class="step-header">INPUTS DETECTED</span>`;
        html += `Angle A = ${a1}° <br> Angle B = ${a2}°`;
        
        html += `<hr class="visual-line">`;
        
        html += `<span class="step-header">SCENARIO 1: FINDING EXTERIOR ANGLE (x)</span>`;
        html += `Theorem: Exterior angle = Sum of two opposite interior angles.<br>`;
        html += `Formula: x = ${a1} + ${a2}<br>`;
        html += `<strong>Answer: x = ${exteriorX}°</strong>`;

        html += `<hr class="visual-line">`;

        html += `<span class="step-header">SCENARIO 2: FINDING 3RD INTERIOR ANGLE</span>`;
        html += `Theorem: Sum of triangle angles = 180°.<br>`;
        html += `Formula: x = 180 - (${a1} + ${a2})<br>`;
        if (interiorX > 0) {
            html += `<strong>Answer: x = ${interiorX}°</strong>`;
        } else {
            html += `<strong>Impossible:</strong> Angles sum to more than 180°.`;
        }

        solutionBox.innerHTML = html;
    }

    function solveLinear(eq) {
        let cleanEq = eq.replace(/\s+/g, '');
        let m = 0;
        let b = 0;

        try {
            if (!cleanEq.startsWith('y=')) throw new Error();
            const rightSide = cleanEq.split('=')[1];
            
            if (rightSide.includes('x')) {
                const parts = rightSide.split('x');
                let slopePart = parts[0];
                let interceptPart = parts[1];

                if (slopePart === '' || slopePart === '+') m = 1;
                else if (slopePart === '-') m = -1;
                else m = parseFloat(slopePart);

                if (!interceptPart || interceptPart === '') b = 0;
                else b = parseFloat(interceptPart);
            } else {
                m = 0;
                b = parseFloat(rightSide);
            }

            const p2 = { x: 1, y: m * 1 + b };
            const xInt = m !== 0 ? -b / m : null;

            let output = `Equation: y = ${m}x + ${b}\n`;
            output += `----------------------------------------\n`;
            output += `PLOTTED POINTS:\n`;
            output += `• Y-Intercept: (0, ${b})\n`;
            output += `• Point at x=1: (1, ${p2.y})\n`;
            if (xInt !== null) {
                output += `• X-Intercept: (${xInt.toFixed(2)}, 0)\n`;
            }

            solutionBox.textContent = output;
            drawGrid();
            drawLine(m, b);
            drawDot(0, b, "red");
            if (xInt !== null) drawDot(xInt, 0, "blue");

        } catch (e) {
            solutionBox.textContent = "Format Error: Please use format 'y = mx + b'";
        }
    }

    function solveIntercepts(input) {
        const xMatch = input.match(/x.*?(-?\d+\.?\d*)/);
        const yMatch = input.match(/y.*?(-?\d+\.?\d*)/);

        if (xMatch && yMatch) {
            const xInt = parseFloat(xMatch[1]);
            const yInt = parseFloat(yMatch[1]);
            let m = 0;
            let equation = "";

            if (xInt === 0 && yInt === 0) {
                 m = 1; 
                 equation = "y = x";
            } else {
                m = (yInt - 0) / (0 - xInt); 
                equation = `y = ${m.toFixed(2)}x + ${yInt}`;
            }

            let output = `Given Intercepts:\n`;
            output += `• X-Intercept: (${xInt}, 0)\n`;
            output += `• Y-Intercept: (0, ${yInt})\n`;
            output += `----------------------------------------\n`;
            output += `CALCULATED LINE:\n`;
            output += `• Slope (m): ${m.toFixed(2)}\n`;
            output += `• Equation: ${equation}`;

            solutionBox.textContent = output;
            drawGrid();
            drawDot(xInt, 0, "blue");
            drawDot(0, yInt, "red");
            drawLine(m, yInt);

        } else {
            solutionBox.textContent = "Could not find intercepts. Try: 'x-intercept is -6 and y-intercept is 1'";
        }
    }

    function solveGeometry(input) {
        const matches = input.match(/-?\d+(\.\d+)?/g);
        if (!matches || matches.length < 4) {
            solutionBox.textContent = "Please provide two coordinate sets like (1, 2) and (4, 6)";
            return;
        }

        const x1 = parseFloat(matches[0]);
        const y1 = parseFloat(matches[1]);
        const x2 = parseFloat(matches[2]);
        const y2 = parseFloat(matches[3]);

        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        let output = `Coordinates: (${x1}, ${y1}) and (${x2}, ${y2})\n`;
        output += `----------------------------------------\n`;
        output += `RESULTS:\n`;
        output += `• Distance: ${distance.toFixed(4)}\n`;
        output += `• Midpoint: (${midX}, ${midY})\n`;

        solutionBox.textContent = output;
        
        drawGrid();
        drawSegment(x1, y1, x2, y2);
        drawDot(x1, y1, "blue");
        drawDot(x2, y2, "blue");
        drawDot(midX, midY, "green");
    }

    function mapX(x) {
        const width = canvas.width;
        const scale = 20; 
        return (width / 2) + (x * scale);
    }

    function mapY(y) {
        const height = canvas.height;
        const scale = 20; 
        return (height / 2) - (y * scale);
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const w = canvas.width;
        const h = canvas.height;
        const scale = 20;

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#9e9e9e';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let x = 0; x <= w; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();

            if (x % (scale * 2) === 0) {
                const graphX = (x - w/2) / scale;
                if (graphX !== 0) ctx.fillText(graphX, x, h/2 + 15);
            }
        }

        for (let y = 0; y <= h; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();

            if (y % (scale * 2) === 0) {
                const graphY = (h/2 - y) / scale;
                if (graphY !== 0) ctx.fillText(graphY, w/2 - 15, y);
            }
        }

        ctx.strokeStyle = '#424242';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.fillText("0", w/2 - 10, h/2 + 15);
    }

    function drawDot(x, y, color) {
        const cx = mapX(x);
        const cy = mapY(y);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawLine(m, b) {
        ctx.strokeStyle = '#ffb300';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const xStart = -20; 
        const yStart = m * xStart + b;
        const xEnd = 20;
        const yEnd = m * xEnd + b;
        ctx.moveTo(mapX(xStart), mapY(yStart));
        ctx.lineTo(mapX(xEnd), mapY(yEnd));
        ctx.stroke();
    }

    function drawSegment(x1, y1, x2, y2) {
        ctx.strokeStyle = '#ffb300';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(mapX(x1), mapY(y1));
        ctx.lineTo(mapX(x2), mapY(y2));
        ctx.stroke();
        ctx.setLineDash([]);
    }
});
