// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('strainForm');
    const canvas = document.getElementById('mohrCanvas');
    const ctx = canvas.getContext('2d');
    
    // Event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateAndPlot();
    });
    
    // Initial calculation and plot with default values
    calculateAndPlot();
    
    function calculateAndPlot() {
        // Get input values (in microstrain)
        const epsilonX = parseFloat(document.getElementById('epsilonX').value);
        const epsilonY = parseFloat(document.getElementById('epsilonY').value);
        const gammaXY = parseFloat(document.getElementById('gammaXY').value);
        
        // Calculate Mohr's circle parameters
        // Center: average normal strain
        const center = (epsilonX + epsilonY) / 2;
        
        // Radius: sqrt(((εx - εy)/2)^2 + (γxy/2)^2)
        const radius = Math.sqrt(
            Math.pow((epsilonX - epsilonY) / 2, 2) + 
            Math.pow(gammaXY / 2, 2)
        );
        
        // Principal strains
        const epsilon1 = center + radius;
        const epsilon2 = center - radius;
        
        // Maximum shear strain
        const gammaMax = 2 * radius;
        
        // Principal angle (in degrees)
        // tan(2θp) = γxy / (εx - εy)
        let thetaP;
        if (Math.abs(epsilonX - epsilonY) < 1e-10) {
            thetaP = 45; // When εx = εy
        } else {
            thetaP = Math.atan2(gammaXY, epsilonX - epsilonY) / 2;
            thetaP = thetaP * (180 / Math.PI); // Convert to degrees
        }
        
        // Display results
        document.getElementById('center').textContent = `${center.toFixed(2)} με`;
        document.getElementById('radius').textContent = `${radius.toFixed(2)} με`;
        document.getElementById('epsilon1').textContent = `${epsilon1.toFixed(2)} με`;
        document.getElementById('epsilon2').textContent = `${epsilon2.toFixed(2)} με`;
        document.getElementById('gammaMax').textContent = `${gammaMax.toFixed(2)} με`;
        document.getElementById('thetaP').textContent = `${thetaP.toFixed(2)}°`;
        
        // Plot the Mohr's circle
        plotMohrCircle(epsilonX, epsilonY, gammaXY, center, radius, epsilon1, epsilon2);
    }
    
    function plotMohrCircle(ex, ey, gxy, center, radius, e1, e2) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Canvas dimensions
        const width = canvas.width;
        const height = canvas.height;
        const padding = 80;
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;
        
        // Determine scale for plotting
        // Find the range of values to display
        const maxStrain = Math.max(Math.abs(e1), Math.abs(e2), Math.abs(ex), Math.abs(ey));
        const maxShear = Math.max(Math.abs(gxy / 2), radius);
        const maxValue = Math.max(maxStrain, maxShear) * 1.2; // Add 20% margin
        
        // Scale factors (pixels per microstrain)
        const scaleX = plotWidth / (2 * maxValue);
        const scaleY = plotHeight / (2 * maxValue);
        const scale = Math.min(scaleX, scaleY);
        
        // Origin at center of canvas
        const originX = width / 2;
        const originY = height / 2;
        
        // Helper function to convert strain coordinates to canvas coordinates
        function toCanvasX(epsilon) {
            return originX + epsilon * scale;
        }
        
        function toCanvasY(gamma_half) {
            // Positive gamma/2 goes UP in standard convention
            return originY - gamma_half * scale;
        }
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Horizontal axis (epsilon)
        ctx.moveTo(padding, originY);
        ctx.lineTo(width - padding, originY);
        // Vertical axis (gamma/2)
        ctx.moveTo(originX, padding);
        ctx.lineTo(originX, height - padding);
        ctx.stroke();
        
        // Draw axis arrows
        ctx.fillStyle = '#333';
        ctx.beginPath();
        // Right arrow (epsilon axis)
        ctx.moveTo(width - padding, originY);
        ctx.lineTo(width - padding - 10, originY - 5);
        ctx.lineTo(width - padding - 10, originY + 5);
        ctx.fill();
        
        ctx.beginPath();
        // Up arrow (gamma/2 axis)
        ctx.moveTo(originX, padding);
        ctx.lineTo(originX - 5, padding + 10);
        ctx.lineTo(originX + 5, padding + 10);
        ctx.fill();
        
        // Label axes
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('ε (Normal Strain)', width - padding / 2, originY - 10);
        ctx.save();
        ctx.translate(originX - 30, padding + 40);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('γxy/2 (Shear Strain)', 0, 0);
        ctx.restore();
        
        // Draw tick marks and labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        
        // Determine nice tick intervals
        const tickInterval = Math.ceil(maxValue / 4 / 50) * 50;
        
        for (let i = -Math.floor(maxValue / tickInterval); i <= Math.floor(maxValue / tickInterval); i++) {
            if (i === 0) continue;
            
            const tickValue = i * tickInterval;
            
            // X-axis ticks
            const tickX = toCanvasX(tickValue);
            ctx.beginPath();
            ctx.moveTo(tickX, originY - 5);
            ctx.lineTo(tickX, originY + 5);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillText(tickValue.toFixed(0), tickX, originY + 20);
            
            // Y-axis ticks
            const tickY = toCanvasY(tickValue);
            ctx.beginPath();
            ctx.moveTo(originX - 5, tickY);
            ctx.lineTo(originX + 5, tickY);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(tickValue.toFixed(0), originX - 10, tickY + 4);
            ctx.textAlign = 'center';
        }
        
        // Draw Mohr's circle
        const circleCenterX = toCanvasX(center);
        const circleCenterY = toCanvasY(0);
        const circleRadius = radius * scale;
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw diameter line connecting points X and Y
        const pointX_x = toCanvasX(ex);
        const pointX_y = toCanvasY(gxy / 2);
        const pointY_x = toCanvasX(ey);
        const pointY_y = toCanvasY(-gxy / 2);
        
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(pointX_x, pointX_y);
        ctx.lineTo(pointY_x, pointY_y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw point X (εx, γxy/2)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(pointX_x, pointX_y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label point X
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#e74c3c';
        ctx.textAlign = 'left';
        ctx.fillText(`X (${ex.toFixed(1)}, ${(gxy/2).toFixed(1)})`, pointX_x + 10, pointX_y - 10);
        
        // Draw point Y (εy, -γxy/2)
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(pointY_x, pointY_y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label point Y
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#3498db';
        ctx.textAlign = 'left';
        ctx.fillText(`Y (${ey.toFixed(1)}, ${(-gxy/2).toFixed(1)})`, pointY_x + 10, pointY_y + 20);
        
        // Draw principal strain points on the horizontal axis
        const e1_x = toCanvasX(e1);
        const e1_y = toCanvasY(0);
        
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(e1_x, e1_y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label ε1
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#27ae60';
        ctx.textAlign = 'center';
        ctx.fillText(`ε₁ = ${e1.toFixed(1)}`, e1_x, e1_y - 15);
        
        const e2_x = toCanvasX(e2);
        const e2_y = toCanvasY(0);
        
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(e2_x, e2_y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label ε2
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#f39c12';
        ctx.textAlign = 'center';
        ctx.fillText(`ε₂ = ${e2.toFixed(1)}`, e2_x, e2_y - 15);
        
        // Draw center point
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Label center
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#95a5a6';
        ctx.textAlign = 'center';
        ctx.fillText(`C = ${center.toFixed(1)}`, circleCenterX, circleCenterY + 20);
        
        // Draw radius line from center to point X
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(circleCenterX, circleCenterY);
        ctx.lineTo(pointX_x, pointX_y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add title
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText("Mohr's Circle for Strain", width / 2, 30);
        
        // Add legend
        const legendX = 20;
        const legendY = height - 150;
        
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#333';
        ctx.fillText('Legend:', legendX, legendY);
        
        // X point
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(legendX + 10, legendY + 20, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Point X: (εₓ, γₓᵧ/2)', legendX + 20, legendY + 24);
        
        // Y point
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(legendX + 10, legendY + 40, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Point Y: (εᵧ, -γₓᵧ/2)', legendX + 20, legendY + 44);
        
        // ε1
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(legendX + 10, legendY + 60, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Principal strain ε₁', legendX + 20, legendY + 64);
        
        // ε2
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(legendX + 10, legendY + 80, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Principal strain ε₂', legendX + 20, legendY + 84);
    }
});
