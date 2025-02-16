import ApexCharts from 'apexcharts';

export class Chart {
    constructor(containerId, data, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.data = data;
        this.options = this.mergeDefaults(options);
        this.chart = null;
    }

    cleanup() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    mergeDefaults(options) {
        return {
            width: options.width || '100%',
            height: options.height || 400,
            colors: options.colors || ['#2563EB', '#DC2626', '#059669', '#7C3AED'],
            theme: {
                mode: options.theme?.mode || 'light',
                fontFamily: options.theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            chart: {
                type: options.type || 'line',
                animations: {
                    enabled: options.animations?.enabled !== undefined ? options.animations.enabled : true,
                    easing: options.animations?.easing || 'easeinout',
                    speed: options.animations?.speed || 800,
                },
                toolbar: {
                    show: options.toolbar?.show !== undefined ? options.toolbar.show : true,
                },
                zoom: {
                    enabled: options.zoom?.enabled !== undefined ? options.zoom.enabled : true,
                },
            },
            grid: {
                borderColor: options.theme?.gridColor || '#E5E7EB',
                strokeDashArray: 0,
            },
            tooltip: {
                theme: options.theme?.mode || 'light',
                style: {
                    fontSize: '14px',
                    fontFamily: options.theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
            },
            ...options
        };
    }

    render() {
        this.cleanup();
        this.chart = new ApexCharts(this.container, {
            ...this.options,
            series: this.data
        });
        this.chart.render();
    }

    update(newData) {
        this.data = newData;
        if (this.chart) {
            this.chart.updateSeries(this.data);
        }
    }
}
