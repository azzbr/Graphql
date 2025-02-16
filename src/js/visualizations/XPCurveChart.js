import { Chart } from './Chart.js';

export class XPCurveChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, {
            ...options,
            chart: {
                type: 'area',
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
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [0, 90, 100]
                }
            },
            markers: {
                size: 5,
                strokeWidth: 2,
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
                    },
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: (value) => this.formatXP(value),
                    style: {
                        fontSize: '14px'
                    }
                },
                title: {
                    text: 'XP',
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                },
                y: {
                    formatter: (value) => this.formatXP(value)
                }
            },
            grid: {
                borderColor: options.theme?.gridColor || '#e0e0e0',
                strokeDashArray: 4,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
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

        // Process and sort data
        let cumulative = 0;
        const processedPoints = this.data
            .map(item => ({
                date: new Date(item.date).getTime(),
                amount: Number(item.amount) || 0
            }))
            .sort((a, b) => a.date - b.date)
            .map(point => {
                cumulative += point.amount;
                return [point.date, cumulative];
            });

        this.processedData = [{
            name: 'XP Progress',
            data: processedPoints
        }];
    }

    formatXP(value) {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toFixed(0);
    }

    render() {
        try {
            super.render();
        } catch (error) {
            console.error('Error rendering XPCurveChart:', error);
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
