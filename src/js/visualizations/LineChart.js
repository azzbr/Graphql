import { Chart } from './Chart.js';

export class LineChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, {
            ...options,
            chart: {
                type: 'line',
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
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    stops: [0, 90, 100]
                }
            },
            markers: {
                size: 6,
                strokeWidth: 2,
                strokeColors: options.colors || ['#2563EB'],
                fillColors: '#fff',
                hover: {
                    size: 8,
                    sizeOffset: 3
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MMM 'yy",
                        day: 'dd MMM',
                        hour: 'HH:mm'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: (value) => value.toLocaleString()
                }
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                },
                y: {
                    formatter: (value) => value.toLocaleString()
                }
            }
        });
        this.processData();
    }

    processData() {
        if (!Array.isArray(this.data) || this.data.length === 0) {
            this.processedData = [{
                name: 'XP Progress',
                data: [[new Date().getTime(), 0]]
            }];
            return;
        }

        let cumulative = 0;
        const processedPoints = this.data
            .map(point => ({
                date: new Date(point.date).getTime(),
                value: Number(point.value) || 0
            }))
            .sort((a, b) => a.date - b.date)
            .map(point => {
                cumulative += point.value;
                return [point.date, cumulative];
            });

        this.processedData = [{
            name: 'XP Progress',
            data: processedPoints
        }];
    }

    render() {
        try {
            super.render();
        } catch (error) {
            console.error('Error rendering LineChart:', error);
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
