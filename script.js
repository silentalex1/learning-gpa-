document.addEventListener('DOMContentLoaded', () => {
    const solveBtn = document.getElementById('solveBtn');
    const inputField = document.getElementById('problemInput');
    const solutionBox = document.getElementById('solutionBox');
    const canvas = document.getElementById('mathCanvas');
    const ctx = canvas.getContext('2d');

    drawGrid();

    solveBtn.addEventListener('click', () => {
        const input = inputField.value.toLowerCase().replace(/\s+/g, '');
        if (!input) return;

        solutionBox.innerHTML = '';
        
        if (input.startsWith('y=') || (input.includes('x') && input.includes('y') && input.includes('='))) {
            solveLinear(input);
        } else if (input.match(/\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/g)) {
            solveGeometry(input);
        } else {
            solutionBox.textContent = "Format not recognized. Try 'y = 2x + 1' or '(1,2) and (4,6)'";
        }
    });

    function solveLinear(eq) {
        let m = 0;
        let b = 0;

        try {
            const rightSide = eq.split('=')[1];
            
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

            const p1 = { x: 0, y: b };
            const p2 = { x: 1, y: m * 1 + b };
            const p3 = { x: -1, y: m * -1 + b };
            const xInt = m !== 0 ? -b / m : null;

            let output = `Equation: y = ${m}x + ${b}\n\n`;
            output += `PLOTTED POINTS:\n`;
            output += `• Y-Intercept: (0, ${b})\n`;
            output += `• Point at x=1: (1, ${p2.y})\n`;
            output += `• Point at x=-1: (-1, ${p3.y})\n`;
            
            if (xInt !== null) {
                output += `• X-Intercept: (${xInt.toFixed(2)}, 0)\n`;
            }

            solutionBox.textContent = output;
            drawGrid();
            drawLine(m, b);
            drawDot(0, b, "red");
            if (xInt !== null) drawDot(xInt, 0, "blue");

        } catch (e) {
            solutionBox.textContent = "Could not parse equation. Ensure it is in y = mx + b format.";
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
        const slope = (x2 - x1) !== 0 ? (y2 - y1) / (x2 - x1) : "Undefined";

        let output = `Coordinates: (${x1}, ${y1}) and (${x2}, ${y2})\n\n`;
        output += `RESULTS:\n`;
        output += `• Distance: ${distance.toFixed(4)}\n`;
        output += `• Midpoint: (${midX}, ${midY})\n`;
        output += `• Slope (m): ${typeof slope === 'number' ? slope.toFixed(4) : slope}`;

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
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        const w = canvas.width;
        const h = canvas.height;
        const scale = 20;

        for (let x = 0; x <= w; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        for (let y = 0; y <= h; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
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

        const xStart = -15; 
        const yStart = m * xStart + b;
        const xEnd = 15;
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
