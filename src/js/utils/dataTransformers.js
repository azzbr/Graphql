export class DataTransformer {
    static transformXPData(transactions = []) {
        if (!transactions || transactions.length === 0) return [];

        // Clean and process XP data
        const cleanData = transactions
            .filter(t => t.path && t.amount && t.createdAt)
            .map(t => ({
                name: t.object?.name || '',
                date: t.createdAt.split('T')[0],
                amount: Number(t.amount) || 0,
                path: t.path
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Handle duplicate entries for the same project
        const processedData = new Map();
        
        cleanData.forEach(item => {
            const key = item.path.includes('checkpoint') ?
                `${item.path}_${item.date}` : // Keep separate entries for checkpoints
                item.path; // Use path as key for regular projects

            if (!processedData.has(key) || item.amount > processedData.get(key).amount) {
                processedData.set(key, item);
            }
        });

        return Array.from(processedData.values())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    static transformSkillsData(transactions = []) {
        if (!transactions || transactions.length === 0) return { technicalSkills: [], languageSkills: [] };

        // Define skill categories
        const techSkills = {
            'Prog': { name: 'Programming', value: 0 },
            'Algo': { name: 'Algorithms', value: 0 },
            'Sys-Admin': { name: 'System Admin', value: 0 },
            'Front-End': { name: 'Frontend', value: 0 },
            'Back-End': { name: 'Backend', value: 0 },
            'Stats': { name: 'Statistics', value: 0 },
            'Game': { name: 'Game Dev', value: 0 }
        };

        const langSkills = {
            'Go': { name: 'Go', value: 0 },
            'JS': { name: 'JavaScript', value: 0 },
            'Rust': { name: 'Rust', value: 0 },
            'HTML': { name: 'HTML', value: 0 },
            'CSS': { name: 'CSS', value: 0 },
            'Unix': { name: 'Unix', value: 0 },
            'Docker': { name: 'Docker', value: 0 },
            'SQL': { name: 'SQL', value: 0 },
            'C': { name: 'C', value: 0 }
        };

        // Process transactions
        transactions.forEach(transaction => {
            const { type, amount } = transaction;
            if (!type || !amount) return;

            const normalizedAmount = Math.min(Math.max(amount, 0), 100);
            
            // Map skill types to categories
            if (type.includes('_go')) {
                langSkills['Go'].value = Math.max(langSkills['Go'].value, normalizedAmount);
            } else if (type.includes('js')) {
                langSkills['JS'].value = Math.max(langSkills['JS'].value, normalizedAmount);
            } else if (type.includes('rust')) {
                langSkills['Rust'].value = Math.max(langSkills['Rust'].value, normalizedAmount);
            } else if (type.includes('html')) {
                langSkills['HTML'].value = Math.max(langSkills['HTML'].value, normalizedAmount);
            } else if (type.includes('css')) {
                langSkills['CSS'].value = Math.max(langSkills['CSS'].value, normalizedAmount);
            } else if (type.includes('unix')) {
                langSkills['Unix'].value = Math.max(langSkills['Unix'].value, normalizedAmount);
            } else if (type.includes('docker')) {
                langSkills['Docker'].value = Math.max(langSkills['Docker'].value, normalizedAmount);
            } else if (type.includes('sql')) {
                langSkills['SQL'].value = Math.max(langSkills['SQL'].value, normalizedAmount);
            } else if (type.includes('_c')) {
                langSkills['C'].value = Math.max(langSkills['C'].value, normalizedAmount);
            } else if (type.includes('prog')) {
                techSkills['Prog'].value = Math.max(techSkills['Prog'].value, normalizedAmount);
            } else if (type.includes('algo')) {
                techSkills['Algo'].value = Math.max(techSkills['Algo'].value, normalizedAmount);
            } else if (type.includes('sys-admin')) {
                techSkills['Sys-Admin'].value = Math.max(techSkills['Sys-Admin'].value, normalizedAmount);
            } else if (type.includes('front')) {
                techSkills['Front-End'].value = Math.max(techSkills['Front-End'].value, normalizedAmount);
            } else if (type.includes('back')) {
                techSkills['Back-End'].value = Math.max(techSkills['Back-End'].value, normalizedAmount);
            } else if (type.includes('stats')) {
                techSkills['Stats'].value = Math.max(techSkills['Stats'].value, normalizedAmount);
            } else if (type.includes('game')) {
                techSkills['Game'].value = Math.max(techSkills['Game'].value, normalizedAmount);
            }
        });

        // Convert to array format and filter out unused skills
        const techSkillsData = Object.values(techSkills)
            .filter(skill => skill.value > 0)
            .map(({ name, value }) => ({ name, value }));

        const langSkillsData = Object.values(langSkills)
            .filter(skill => skill.value > 0)
            .map(({ name, value }) => ({ name, value }));

        return {
            technicalSkills: techSkillsData,
            languageSkills: langSkillsData
        };
    }

    static calculateAuditRatio(totalUp, totalDown) {
        // Return raw bytes - RatioChart handles formatting
        return {
            upload: totalUp || 0,
            download: totalDown || 0
        };
    }
}
