class LineChart {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.options = {
            chart: {
                height: 350,
                type: 'area',
                fontFamily: 'Satoshi, sans-serif',
                dropShadow: {
                    enabled: true,
                    color: '#623CEA14',
                    top: 10,
                    blur: 4,
                    left: 0,
                    opacity: 0.1
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#3056D3'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2,
                curve: 'straight'
            },
            grid: {
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
            },
            markers: {
                size: 4,
                colors: '#fff',
                strokeColors: ['#3056D3'],
                strokeWidth: 3,
                strokeOpacity: 0.9,
                strokeDashArray: 0,
                fillOpacity: 1,
                hover: {
                    size: 6
                }
            },
            xaxis: {
                type: 'datetime',
                categories: [],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                title: {
                    style: {
                        fontSize: '0px'
                    }
                },
                min: 0
            },
            responsive: [
                {
                    breakpoint: 1024,
                    options: {
                        chart: {
                            height: 300
                        }
                    }
                },
                {
                    breakpoint: 1366,
                    options: {
                        chart: {
                            height: 350
                        }
                    }
                }
            ]
        };
        this.render();
    }

    processData() {
        if (!this.data || !this.data.length) return null;

        // Sort transactions by date
        const sortedData = [...this.data].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // Set categories (dates)
        this.options.xaxis.categories = sortedData.map(item => item.createdAt);

        // Calculate accumulated XP
        let accumulatedXP = 0;
        const series = sortedData.map(item => {
            accumulatedXP += item.amount;
            return parseFloat((accumulatedXP / 1000).toFixed(1));
        });

        // Update max Y axis value
        this.options.yaxis.max = accumulatedXP / 1000;

        return [{
            name: 'XP',
            data: series
        }];
    }

    render() {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8';
        
        const headerHTML = `
            <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div class="flex w-full flex-wrap gap-3 sm:gap-5">
                    <div class="flex min-w-47.5">
                        <span class="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                            <span class="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                        </span>
                        <div class="w-full">
                            <p class="font-semibold text-primary">XP progression</p>
                            <p class="text-sm font-medium">
                                ${this.data && this.data.length > 0 ? `
                                    ${new Date(this.data[this.data.length - 1].createdAt).toLocaleDateString('en-GB')} -
                                    ${new Date(this.data[0].createdAt).toLocaleDateString('en-GB')}
                                ` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const chartHTML = `
            <div>
                <div id="chartOne" class="-ml-5"></div>
            </div>
        `;

        chartContainer.innerHTML = headerHTML + chartHTML;
        this.container.appendChild(chartContainer);

        const series = this.processData();
        if (series) {
            const chart = new ApexCharts(
                chartContainer.querySelector('#chartOne'),
                {
                    ...this.options,
                    series
                }
            );
            chart.render();
        }
    }
}

export default LineChart;
