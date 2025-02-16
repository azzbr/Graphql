class CardDataStats {
    constructor(container, { title, total, info, rateUp, rateDown, icon }) {
        this.container = container;
        this.title = title;
        this.total = total;
        this.info = info;
        this.rateUp = rateUp;
        this.rateDown = rateDown;
        this.icon = icon;
        this.render();
    }

    render() {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-sm border border-stroke px-7.5 py-6 shadow';

        const iconContainer = document.createElement('div');
        iconContainer.className = 'flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2';
        iconContainer.innerHTML = this.icon;

        const contentContainer = document.createElement('div');
        contentContainer.className = 'mt-4 flex items-end justify-between';

        const textContainer = document.createElement('div');
        const title = document.createElement('h4');
        title.className = 'text-xl font-bold mb-1';
        title.textContent = this.total;

        const subtitle = document.createElement('span');
        subtitle.className = 'text-sm font-medium';
        subtitle.textContent = this.title;

        textContainer.appendChild(title);
        textContainer.appendChild(subtitle);

        contentContainer.appendChild(textContainer);

        if (this.rateUp) {
            const rateUpSpan = document.createElement('span');
            rateUpSpan.className = 'flex items-center gap-1 text-sm font-medium text-green-500';
            rateUpSpan.innerHTML = `
                ${this.rateUp}
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill="currentColor"/>
                </svg>
            `;
            contentContainer.appendChild(rateUpSpan);
        }

        if (this.rateDown) {
            const rateDownSpan = document.createElement('span');
            rateDownSpan.className = 'flex items-center gap-1 text-sm font-medium text-red-500';
            rateDownSpan.innerHTML = `
                ${this.rateDown}
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" fill="currentColor"/>
                </svg>
            `;
            contentContainer.appendChild(rateDownSpan);
        }

        if (this.info) {
            const selectContainer = document.createElement('div');
            selectContainer.className = 'relative z-20 inline-block w-1/2';

            const select = document.createElement('select');
            select.className = 'relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium w-full';
            
            this.info.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                select.appendChild(option);
            });

            const dropdownIcon = document.createElement('span');
            dropdownIcon.className = 'absolute right-3 top-1/2 z-10 -translate-y-1/2';
            dropdownIcon.innerHTML = `
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z" fill="currentColor"/>
                </svg>
            `;

            selectContainer.appendChild(select);
            selectContainer.appendChild(dropdownIcon);
            contentContainer.appendChild(selectContainer);
        }

        card.appendChild(iconContainer);
        card.appendChild(contentContainer);
        this.container.appendChild(card);
    }
}

export default CardDataStats;
