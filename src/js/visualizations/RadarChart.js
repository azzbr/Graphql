import { Chart } from './Chart.js';

export class RadarChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, {
            ...options,
            chart: {
                type: 'radar',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radar: {
                    size: undefined,
                    offsetX: 0,
                    offsetY: 0,
                    polygons: {
                        strokeColors: options.theme?.gridColor || '#e0e0e0',
                        strokeWidth: 1,
                        connectorColors: options.theme?.gridColor || '#e0e0e0',
                        fill: {
                            colors: ['#f8f8f8', '#fff']
                        }
                    }
                }
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            fill: {
                opacity: 0.45
            },
            markers: {
                size: 5,
                hover: {
                    size: 8
                }
            },
            yaxis: {
                show: true,
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: (value) => `${value}%`
                }
            }
        });
        this.processData();
    }

    processData() {
        if (!Array.isArray(this.data) || this.data.length === 0) {
            this.processedData = [{
                name: 'Skills',
                data: [0]
            }];
            return;
        }

        // Process data for radar chart format
        const categories = this.data.map(item => item.name || 'Unknown');
        const values = this.data.map(item => 
            Math.min(Math.max(Number(item.value) || 0, 0), 100)
        );

        this.processedData = [{
            name: 'Skills',
            data: values
        }];

        // Add categories to options
        this.options.xaxis = {
            categories: categories,
            labels: {
                style: {
                    fontSize: '14px',
                    fontFamily: this.options.theme?.fontFamily
                }
            }
        };
    }

    render() {
        try {
            super.render();
        } catch (error) {
            console.error('Error rendering RadarChart:', error);
            this.container.innerHTML = `
                <div style="color: #666; text-align: center; padding: 20px;">
                    No data available
                </div>
            `;
        }
    }

    update(newData) {
        this.data = newData;
        this.processData();
        super.update(this.processedData);
    }
}
