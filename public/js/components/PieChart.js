class PieChart {
    constructor(container, skills) {
        this.container = container;
        this.skills = skills;
        this.options = {
            chart: {
                type: 'donut',
                fontFamily: 'Satoshi, sans-serif',
            },
            colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#1F8AAB', '#266D8F'],
            labels: [],
            legend: {
                show: false,
                position: 'bottom'
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent'
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            responsive: [
                {
                    breakpoint: 2600,
                    options: {
                        chart: {
                            width: 380
                        }
                    }
                },
                {
                    breakpoint: 640,
                    options: {
                        chart: {
                            width: 200
                        }
                    }
                }
            ]
        };
        this.render();
    }

    processData() {
        if (!this.skills || !this.skills.length) return null;

        // Take top 6 skills
        const topSkills = this.skills.slice(0, 6);

        // Set labels and prepare series
        this.options.labels = topSkills.map(skill => {
            const skillName = skill.type.startsWith('skill_') ? 
                skill.type.slice(6) : skill.type;
            return skillName;
        });

        return topSkills.map(skill => skill.amount);
    }

    render() {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4';

        const headerHTML = `
            <div class="mb-3 pb-5 justify-between gap-5 sm:flex">
                <div>
                    <h5 class="text-xl font-semibold text-black dark:text-white">
                        Best Skills
                    </h5>
                </div>
            </div>
        `;

        const chartHTML = `
            <div class="mb-2">
                <div id="pieChart" class="mx-auto flex justify-center pb-5"></div>
            </div>
        `;

        const skillsListHTML = this.skills ? `
            <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
                ${this.skills.slice(0, 6).map((skill, index) => `
                    <div class="w-full px-8 sm:w-1/2">
                        <div class="flex w-full items-center">
                            <p class="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span>${skill.type.startsWith('skill_') ? skill.type.slice(6) : skill.type}</span>
                                <span>${skill.amount}</span>
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '';

        chartContainer.innerHTML = headerHTML + chartHTML + skillsListHTML;
        this.container.appendChild(chartContainer);

        const series = this.processData();
        if (series) {
            const chart = new ApexCharts(
                chartContainer.querySelector('#pieChart'),
                {
                    ...this.options,
                    series
                }
            );
            chart.render();
        }
    }
}

export default PieChart;
