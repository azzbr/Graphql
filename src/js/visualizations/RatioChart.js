import { Chart } from './Chart.js';

export class RatioChart extends Chart {
    constructor(containerId, data, options = {}) {
        super(containerId, data, {
            ...options,
            chart: {
                type: 'bar',
                height: 160,
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function(val) {
                    return `${(val / (1024 * 1024)).toFixed(2)} MB`;
                },
                style: {
                    fontSize: '14px',
                    fontWeight: 500
                }
            },
            xaxis: {
                labels: {
                    formatter: function(val) {
                        return `${(val / (1024 * 1024)).toFixed(2)} MB`;
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            grid: {
                show: false
            },
            title: {
                text: 'Upload/Download Ratio',
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 600
                }
            },
            subtitle: {
                text: '',
                align: 'center',
                style: {
                    fontSize: '14px'
                }
            }
        });
        this.data = this.normalizeData(data);
        this.processData();
    }

    normalizeData(data) {
        if (!data || typeof data !== 'object') {
            return { upload: 0, download: 0 };
        }
        return {
            upload: Number(data.upload) || 0,
            download: Number(data.download) || 0
        };
    }

    processData() {
        const { upload, download } = this.data;
        const ratio = download > 0 ? (upload / download).toFixed(2) : '0.00';
        
        this.processedData = [{
            name: 'Data Transfer',
            data: [upload, download]
        }];

        // Update subtitle with ratio
        this.options.subtitle.text = `Ratio: ${ratio}`;

        // Update x-axis categories
        this.options.xaxis = {
            ...this.options.xaxis,
            categories: ['Upload', 'Download']
        };
    }

    render() {
        try {
            super.render();
        } catch (error) {
            console.error('Error rendering RatioChart:', error);
            this.container.innerHTML = `
                <div style="color: #666; text-align: center; padding: 20px;">
                    No data available
                </div>
            `;
        }
    }

    update(newData) {
        this.data = this.normalizeData(newData);
        this.processData();
        super.update(this.processedData);
    }
}
