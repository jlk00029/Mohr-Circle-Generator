document.getElementById('strainForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const ex = parseFloat(document.getElementById('ex').value);
    const ey = parseFloat(document.getElementById('ey').value);
    const gxy = parseFloat(document.getElementById('gxy').value);

    // Calculator logic
    const avg = (ex + ey) / 2;
    const radius = Math.sqrt(Math.pow((ex - ey) / 2, 2) + Math.pow(gxy / 2, 2));
    const e1 = avg + radius;
    const e2 = avg - radius;
    const theta_p_rad = 0.5 * Math.atan2(gxy, ex - ey);
    const theta_p_deg = theta_p_rad * 180 / Math.PI;

    // Display calculations
    let html = `
        <strong>Principal Strains &amp; Maximum Shear Strain:</strong><br>
        &epsilon;<sub>1</sub> = ${e1.toFixed(6)}<br>
        &epsilon;<sub>2</sub> = ${e2.toFixed(6)}<br>
        Maximum Shear Strain, &gamma;<sub>max</sub> = ${(e1 - e2).toFixed(6)}<br>
        Principal Angle, &theta;<sub>p</sub> = ${theta_p_deg.toFixed(2)}&deg; from x-axis
    `;
    document.getElementById('calculator-results').innerHTML = html;

    // Draw Mohr's Circle
    drawMohrCircle(avg, radius, ex, ey, gxy);
});

function drawMohrCircle(avg, radius, ex, ey, gxy) {
    const svg = document.getElementById('mohrCircleSVG');
    svg.innerHTML = '';
    const W = svg.width.baseVal.value;
    const H = svg.height.baseVal.value;

    // Nice fit to SVG coordinates
    // Choose ranges and mapping
    const margin = 34;
    const scale = (W - 2 * margin) / (2 * radius === 0 ? 1 : 2 * radius * 1.2);
    const cx = W / 2;
    const cy = H / 2;

    // Axes (horizontal: normal strain, vertical: shear strain)
    svg.appendChild(svgLine(margin, cy, W - margin, cy, '#888'));
    svg.appendChild(svgLine(cx, margin, cx, H - margin, '#b1b1b1'));

    // Draw circle
    svg.appendChild(svgCircle(cx, cy, scale * radius, '#3b82f6'));

    // Draw center point
    svg.appendChild(svgCircle(cx, cy, 3, '#2155cd'));

    // Draw strain points (A and B)
    // A: (ex, gxy/2), B: (ey, -gxy/2)
    const Ax = cx + scale * (ex - avg);
    const Ay = cy - scale * 0.5 * gxy;
    svg.appendChild(svgCircle(Ax, Ay, 5, '#e94242'));
    svg.appendChild(svgText('A', Ax+8, Ay-6, '#d32f2f'));
    const Bx = cx + scale * (ey - avg);
    const By = cy + scale * 0.5 * gxy;
    svg.appendChild(svgCircle(Bx, By, 5, '#f5cb42'));
    svg.appendChild(svgText('B', Bx+8, By-6, '#b3862c'));

    // Connect A and B
    svg.appendChild(svgLine(Ax, Ay, Bx, By, '#444'));
}

function svgLine(x1, y1, x2, y2, color='#444') {
    const l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', color);
    l.setAttribute('stroke-width', '2');
    return l;
}
function svgCircle(cx, cy, r, color='#666') {
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', color);
    c.setAttribute('stroke-width', '2.5');
    return c;
}
function svgText(text, x, y, color='#000') {
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('fill', color);
    t.setAttribute('font-size', '1em');
    t.setAttribute('font-family', 'Arial, sans-serif');
    t.textContent = text;
    return t;
}
