export class DataTransformer {
    static transformXPData(transactions) {
        // Group transactions by date and sum XP
        const groupedByDate = transactions.reduce((acc, transaction) => {
            const date = transaction.createdAt.split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += transaction.amount;
            return acc;
        }, {});

        // Convert to array format needed by LineChart
        return Object.entries(groupedByDate).map(([date, value]) => ({
            date,
            value
        }));
    }

    static transformSkillsData(transactions) {
        // Process technical skills
        const techSkills = {
            'Prog': 0,
            'Algo': 0,
            'Sys-Admin': 0,
            'Front-End': 0,
            'Back-End': 0,
            'Stats': 0,
            'Game': 0
        };

        // Process language/technology skills
        const langSkills = {
            'Go': 0,
            'JS': 0,
            'Rust': 0,
            'HTML': 0,
            'CSS': 0,
            'Unix': 0,
            'Docker': 0,
            'SQL': 0,
            'C': 0
        };

        transactions.forEach(transaction => {
            const { type, amount } = transaction;
            
            // Map skill types to categories
            if (type.includes('_go')) {
                langSkills['Go'] = Math.max(langSkills['Go'], amount);
            } else if (type.includes('js')) {
                langSkills['JS'] = Math.max(langSkills['JS'], amount);
            } else if (type.includes('rust')) {
                langSkills['Rust'] = Math.max(langSkills['Rust'], amount);
            } else if (type.includes('html')) {
                langSkills['HTML'] = Math.max(langSkills['HTML'], amount);
            } else if (type.includes('css')) {
                langSkills['CSS'] = Math.max(langSkills['CSS'], amount);
            } else if (type.includes('unix')) {
                langSkills['Unix'] = Math.max(langSkills['Unix'], amount);
            } else if (type.includes('docker')) {
                langSkills['Docker'] = Math.max(langSkills['Docker'], amount);
            } else if (type.includes('sql')) {
                langSkills['SQL'] = Math.max(langSkills['SQL'], amount);
            } else if (type.includes('_c')) {
                langSkills['C'] = Math.max(langSkills['C'], amount);
            } else if (type.includes('prog')) {
                techSkills['Prog'] = Math.max(techSkills['Prog'], amount);
            } else if (type.includes('algo')) {
                techSkills['Algo'] = Math.max(techSkills['Algo'], amount);
            } else if (type.includes('sys-admin')) {
                techSkills['Sys-Admin'] = Math.max(techSkills['Sys-Admin'], amount);
            } else if (type.includes('front')) {
                techSkills['Front-End'] = Math.max(techSkills['Front-End'], amount);
            } else if (type.includes('back')) {
                techSkills['Back-End'] = Math.max(techSkills['Back-End'], amount);
            } else if (type.includes('stats')) {
                techSkills['Stats'] = Math.max(techSkills['Stats'], amount);
            } else if (type.includes('game')) {
                techSkills['Game'] = Math.max(techSkills['Game'], amount);
            }
        });

        // Convert to array format needed by RadarChart
        const techSkillsData = Object.entries(techSkills).map(([name, value]) => ({
            name,
            value: Math.min(value, 100) // Normalize to 100
        }));

        const langSkillsData = Object.entries(langSkills).map(([name, value]) => ({
            name,
            value: Math.min(value, 100) // Normalize to 100
        }));

        return {
            technicalSkills: techSkillsData,
            languageSkills: langSkillsData
        };
    }

    static formatBytes(bytes) {
        const mb = bytes / 1000000;
        return Math.round(mb * 100) / 100;
    }

    static calculateAuditRatio(totalUp, totalDown) {
        const up = this.formatBytes(totalUp);
        const down = this.formatBytes(totalDown);
        const ratio = Math.round((up / down) * 10) / 10;
        
        return {
            up,
            down,
            ratio
        };
    }
}
