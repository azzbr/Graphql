export class Chart {
    constructor(containerId, data, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.data = data;
        this.options = this.mergeDefaults(options);
        this.svg = null;
    }

    mergeDefaults(options) {
        return {
            width: options.width || this.container.clientWidth,
            height: options.height || this.container.clientHeight,
            margin: options.margin || { top: 40, right: 40, bottom: 60, left: 60 },
            colors: options.colors || ['#2196F3', '#FF5722', '#4CAF50', '#9C27B0'],
            animationDuration: options.animationDuration || 750,
            responsive: options.responsive !== undefined ? options.responsive : true
        };
    }

    createSVG() {
        // Remove any existing SVG
        if (this.svg) {
            this.svg.remove();
        }

        // Create new SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.options.width);
        svg.setAttribute('height', this.options.height);
        svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
        
        if (this.options.responsive) {
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.style.width = '100%';
            svg.style.height = '100%';
        }

        this.container.appendChild(svg);
        this.svg = svg;
        return svg;
    }

    clear() {
        while (this.svg && this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }

    createGroup(className) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (className) {
            group.setAttribute('class', className);
        }
        return group;
    }

    createPath(d, options = {}) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        
        Object.entries(options).forEach(([key, value]) => {
            path.setAttribute(key, value);
        });
        
        return path;
    }

    createText(x, y, text, options = {}) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.textContent = text;
        
        Object.entries(options).forEach(([key, value]) => {
            textElement.setAttribute(key, value);
        });
        
        return textElement;
    }

    createLine(x1, y1, x2, y2, options = {}) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        
        Object.entries(options).forEach(([key, value]) => {
            line.setAttribute(key, value);
        });
        
        return line;
    }

    addTooltip(element, content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.style.display = 'none';
        tooltip.style.position = 'absolute';
        this.container.appendChild(tooltip);

        element.addEventListener('mouseover', (event) => {
            tooltip.innerHTML = content;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
        });

        element.addEventListener('mousemove', (event) => {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
        });

        element.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    }

    // Abstract methods to be implemented by child classes
    render() {
        throw new Error('render() method must be implemented by child class');
    }

    update(newData) {
        throw new Error('update() method must be implemented by child class');
    }
}
