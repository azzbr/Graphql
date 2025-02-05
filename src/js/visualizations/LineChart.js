import { Chart } from './Chart.js';

export class LineChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, options);
        this.processData();
    }

    processData() {
        // Convert dates to Date objects and sort by date
        this.processedData = this.data.map(point => ({
            date: new Date(point.date),
            value: point.value
        })).sort((a, b) => a.date - b.date);

        // Calculate cumulative values
        let cumulative = 0;
        this.processedData = this.processedData.map(point => ({
            ...point,
            cumulative: (cumulative += point.value)
        }));
    }

    calculateScales() {
        const margin = this.options.margin;
        const width = this.options.width - margin.left - margin.right;
        const height = this.options.height - margin.top - margin.bottom;

        // X scale (time)
        const xMin = this.processedData[0].date;
        const xMax = this.processedData[this.processedData.length - 1].date;
        const xScale = (x) => {
            return margin.left + (width * (x - xMin) / (xMax - xMin));
        };

        // Y scale (XP amount)
        const yMax = Math.max(...this.processedData.map(d => d.cumulative));
        const yScale = (y) => {
            return height + margin.top - (height * y / yMax);
        };

        return { xScale, yScale, width, height, xMin, xMax, yMax };
    }

    drawAxes(scales) {
        const { xScale, yScale, width, height, xMin, xMax, yMax } = scales;
        const margin = this.options.margin;
        const group = this.createGroup('axes');

        // X-axis line
        const xAxis = this.createLine(
            margin.left,
            height + margin.top,
            width + margin.left,
            height + margin.top,
            { stroke: '#666', 'stroke-width': 1 }
        );
        group.appendChild(xAxis);

        // Y-axis line
        const yAxis = this.createLine(
            margin.left,
            margin.top,
            margin.left,
            height + margin.top,
            { stroke: '#666', 'stroke-width': 1 }
        );
        group.appendChild(yAxis);

        // X-axis labels (dates)
        const monthInterval = Math.ceil(this.processedData.length / 6); // Show ~6 labels
        this.processedData.forEach((point, i) => {
            if (i % monthInterval === 0) {
                const label = this.createText(
                    xScale(point.date),
                    height + margin.top + 20,
                    point.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                    {
                        'text-anchor': 'middle',
                        'font-size': '12px',
                        fill: '#666'
                    }
                );
                group.appendChild(label);
            }
        });

        // Y-axis labels (XP amounts)
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const value = (yMax / ySteps) * i;
            const label = this.createText(
                margin.left - 10,
                yScale(value),
                Math.round(value).toLocaleString(),
                {
                    'text-anchor': 'end',
                    'dominant-baseline': 'middle',
                    'font-size': '12px',
                    fill: '#666'
                }
            );
            group.appendChild(label);
        }

        return group;
    }

    drawGrid(scales) {
        const { xScale, yScale, width, height, yMax } = scales;
        const margin = this.options.margin;
        const group = this.createGroup('grid');

        // Horizontal grid lines
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const value = (yMax / ySteps) * i;
            const line = this.createLine(
                margin.left,
                yScale(value),
                width + margin.left,
                yScale(value),
                { stroke: '#ddd', 'stroke-width': 0.5, 'stroke-dasharray': '5,5' }
            );
            group.appendChild(line);
        }

        return group;
    }

    drawLine(scales) {
        const { xScale, yScale } = scales;
        const group = this.createGroup('line');

        // Create the line path
        let pathD = 'M';
        this.processedData.forEach((point, i) => {
            const x = xScale(point.date);
            const y = yScale(point.cumulative);
            pathD += `${i === 0 ? '' : 'L'}${x},${y}`;
        });

        const path = this.createPath(pathD, {
            stroke: this.options.colors[0],
            'stroke-width': 2,
            fill: 'none'
        });
        group.appendChild(path);

        // Add data points
        this.processedData.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', xScale(point.date));
            circle.setAttribute('cy', yScale(point.cumulative));
            circle.setAttribute('r', 4);
            circle.setAttribute('fill', this.options.colors[0]);

            // Add tooltip
            this.addTooltip(circle, `
                <div style="background: rgba(0,0,0,0.8); color: white; padding: 5px; border-radius: 3px;">
                    <div>Date: ${point.date.toLocaleDateString()}</div>
                    <div>XP: ${point.value.toLocaleString()}</div>
                    <div>Total: ${point.cumulative.toLocaleString()}</div>
                </div>
            `);

            group.appendChild(circle);
        });

        return group;
    }

    render() {
        this.svg = this.createSVG();
        const scales = this.calculateScales();

        this.svg.appendChild(this.drawGrid(scales));
        this.svg.appendChild(this.drawAxes(scales));
        this.svg.appendChild(this.drawLine(scales));
    }

    update(newData) {
        this.data = newData;
        this.processData();
        this.clear();
        this.render();
    }
}
