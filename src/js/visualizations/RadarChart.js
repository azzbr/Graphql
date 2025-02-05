import { Chart } from './Chart.js';

export class RadarChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, options);
        this.processData();
    }

    processData() {
        // Ensure data is in correct format: [{ name: string, value: number }]
        this.processedData = this.data.map(item => ({
            name: item.name,
            value: Math.min(Math.max(item.value, 0), 100) // Normalize between 0 and 100
        }));
    }

    calculatePoints() {
        const margin = this.options.margin;
        const width = this.options.width - margin.left - margin.right;
        const height = this.options.height - margin.top - margin.bottom;
        const centerX = width / 2 + margin.left;
        const centerY = height / 2 + margin.top;
        const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.left);

        const angleStep = (2 * Math.PI) / this.processedData.length;
        
        return this.processedData.map((item, i) => {
            const angle = i * angleStep - Math.PI / 2; // Start from top
            const distance = (item.value / 100) * radius;
            return {
                ...item,
                x: centerX + distance * Math.cos(angle),
                y: centerY + distance * Math.sin(angle),
                angle,
                radius: distance
            };
        });
    }

    drawAxes() {
        const margin = this.options.margin;
        const width = this.options.width - margin.left - margin.right;
        const height = this.options.height - margin.top - margin.bottom;
        const centerX = width / 2 + margin.left;
        const centerY = height / 2 + margin.top;
        const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.left);
        
        const group = this.createGroup('axes');

        // Draw circular levels
        const levels = 5;
        for (let i = 1; i <= levels; i++) {
            const levelRadius = (radius * i) / levels;
            let pathD = '';
            
            for (let j = 0; j < this.processedData.length; j++) {
                const angle = (j * 2 * Math.PI) / this.processedData.length - Math.PI / 2;
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);
                pathD += `${j === 0 ? 'M' : 'L'}${x},${y}`;
            }
            pathD += 'Z';

            const circle = this.createPath(pathD, {
                fill: 'none',
                stroke: '#ddd',
                'stroke-width': '0.5',
                'stroke-dasharray': '3,3'
            });
            group.appendChild(circle);

            // Add percentage labels
            if (i < levels) {
                const label = this.createText(
                    centerX - 5,
                    centerY - levelRadius,
                    `${(i * 100) / levels}%`,
                    {
                        'font-size': '10px',
                        fill: '#666',
                        'text-anchor': 'end',
                        'alignment-baseline': 'middle'
                    }
                );
                group.appendChild(label);
            }
        }

        // Draw axes lines and labels
        this.processedData.forEach((_, i) => {
            const angle = (i * 2 * Math.PI) / this.processedData.length - Math.PI / 2;
            const x2 = centerX + radius * Math.cos(angle);
            const y2 = centerY + radius * Math.sin(angle);

            const axis = this.createLine(
                centerX,
                centerY,
                x2,
                y2,
                {
                    stroke: '#ddd',
                    'stroke-width': '0.5'
                }
            );
            group.appendChild(axis);

            // Add axis labels (skill names)
            const labelDistance = radius + 20;
            const labelX = centerX + labelDistance * Math.cos(angle);
            const labelY = centerY + labelDistance * Math.sin(angle);
            
            const label = this.createText(
                labelX,
                labelY,
                this.processedData[i].name,
                {
                    'font-size': '12px',
                    fill: '#666',
                    'text-anchor': 'middle',
                    'dominant-baseline': 'middle',
                    transform: `rotate(${(angle * 180) / Math.PI + 90}, ${labelX}, ${labelY})`
                }
            );
            group.appendChild(label);
        });

        return group;
    }

    drawArea() {
        const points = this.calculatePoints();
        const group = this.createGroup('area');

        // Create area path
        let pathD = '';
        points.forEach((point, i) => {
            pathD += `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`;
        });
        pathD += 'Z';

        // Draw filled area
        const area = this.createPath(pathD, {
            fill: this.options.colors[0],
            'fill-opacity': '0.2',
            stroke: this.options.colors[0],
            'stroke-width': '2'
        });
        group.appendChild(area);

        // Add data points with tooltips
        points.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', 4);
            circle.setAttribute('fill', this.options.colors[0]);

            this.addTooltip(circle, `
                <div style="background: rgba(0,0,0,0.8); color: white; padding: 5px; border-radius: 3px;">
                    <div>${point.name}</div>
                    <div>Value: ${point.value}%</div>
                </div>
            `);

            group.appendChild(circle);
        });

        return group;
    }

    render() {
        this.svg = this.createSVG();
        this.svg.appendChild(this.drawAxes());
        this.svg.appendChild(this.drawArea());
    }

    update(newData) {
        this.data = newData;
        this.processData();
        this.clear();
        this.render();
    }
}
