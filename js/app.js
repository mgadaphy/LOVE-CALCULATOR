// Constants and Configuration
const CONFIG = {
    storageKey: 'loveCalculatorData',
    maxHistoryItems: 10,
    calculationDelay: 2000, // ms
};

// Utility Functions
const utils = {
    getZodiacSign(birthday) {
        const date = new Date(birthday);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
        return 'pisces';
    },

    calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },

    saveToLocalStorage(data) {
        try {
            const history = this.getFromLocalStorage() || [];
            history.unshift(data);
            if (history.length > CONFIG.maxHistoryItems) {
                history.pop();
            }
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    getFromLocalStorage() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    validateForm(formData, activeTab) {
        const errors = {};
        const requiredFields = {
            personal: ['yourName', 'partnerName', 'yourGender', 'partnerGender', 'yourBirthday', 'partnerBirthday', 'yourZodiac', 'partnerZodiac', 'yourPersonality', 'partnerPersonality', 'yourLoveLanguage', 'partnerLoveLanguage'],
            religious: ['yourReligion', 'partnerReligion', 'yourReligionImportance', 'partnerReligionImportance', 'yourConversion', 'partnerConversion'],
            cultural: ['yourCulture', 'partnerCulture', 'yourLanguage', 'partnerLanguage', 'yourTraditions', 'partnerTraditions']
        };

        // Only validate fields in the active tab
        const fieldsToValidate = requiredFields[activeTab] || requiredFields.personal;
        
        fieldsToValidate.forEach(field => {
            if (!formData[field] || !formData[field].trim()) {
                errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
            }
        });

        // Age validation for personal tab
        if (activeTab === 'personal') {
            const yourAge = this.calculateAge(formData.yourBirthday);
            const partnerAge = this.calculateAge(formData.partnerBirthday);
            
            if (yourAge < 18) {
                errors.yourBirthday = 'You must be at least 18 years old';
            }
            if (partnerAge < 18) {
                errors.partnerBirthday = 'Partner must be at least 18 years old';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Compatibility Calculator
class CompatibilityCalculator {
    constructor() {
        this.zodiacCompatibility = {
            aries: { compatible: ['leo', 'sagittarius', 'gemini'], incompatible: ['cancer', 'capricorn'] },
            taurus: { compatible: ['virgo', 'capricorn', 'cancer'], incompatible: ['leo', 'aquarius'] },
            gemini: { compatible: ['libra', 'aquarius', 'leo'], incompatible: ['virgo', 'pisces'] },
            cancer: { compatible: ['scorpio', 'pisces', 'taurus'], incompatible: ['aries', 'libra'] },
            leo: { compatible: ['aries', 'sagittarius', 'gemini'], incompatible: ['taurus', 'scorpio'] },
            virgo: { compatible: ['taurus', 'capricorn', 'cancer'], incompatible: ['gemini', 'sagittarius'] },
            libra: { compatible: ['gemini', 'aquarius', 'leo'], incompatible: ['cancer', 'capricorn'] },
            scorpio: { compatible: ['cancer', 'pisces', 'virgo'], incompatible: ['leo', 'aquarius'] },
            sagittarius: { compatible: ['aries', 'leo', 'aquarius'], incompatible: ['virgo', 'pisces'] },
            capricorn: { compatible: ['taurus', 'virgo', 'scorpio'], incompatible: ['aries', 'libra'] },
            aquarius: { compatible: ['gemini', 'libra', 'sagittarius'], incompatible: ['taurus', 'scorpio'] },
            pisces: { compatible: ['cancer', 'scorpio', 'taurus'], incompatible: ['gemini', 'sagittarius'] }
        };
    }

    calculateZodiacCompatibility(sign1, sign2) {
        const compatibility = this.zodiacCompatibility[sign1];
        if (compatibility.compatible.includes(sign2)) return 90;
        if (compatibility.incompatible.includes(sign2)) return 40;
        return 70;
    }

    calculatePersonalityCompatibility(type1, type2) {
        if (type1 === type2) return 85;
        if (type1 === 'ambivert' || type2 === 'ambivert') return 75;
        return 60;
    }

    calculateLoveLanguageCompatibility(lang1, lang2) {
        if (lang1 === lang2) return 90;
        return 70;
    }

    calculateReligiousCompatibility(data) {
        let score = 70; // Base score

        // Same religion
        if (data.yourReligion === data.partnerReligion) {
            score += 20;
        }

        // Both consider religion very important
        if (data.yourReligionImportance === 'very' && data.partnerReligionImportance === 'very') {
            score += 10;
        }

        // Both open to conversion
        if (data.yourConversion === 'yes' && data.partnerConversion === 'yes') {
            score += 10;
        }

        return Math.min(score, 100);
    }

    calculateCulturalCompatibility(data) {
        let score = 70; // Base score

        // Same culture
        if (data.yourCulture === data.partnerCulture) {
            score += 20;
        }

        // Both consider traditions very important
        if (data.yourTraditions === 'very' && data.partnerTraditions === 'very') {
            score += 10;
        }

        // Same language
        if (data.yourLanguage.toLowerCase() === data.partnerLanguage.toLowerCase()) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    calculateOverallCompatibility(data) {
        const zodiacScore = this.calculateZodiacCompatibility(data.yourZodiac, data.partnerZodiac);
        const personalityScore = this.calculatePersonalityCompatibility(data.yourPersonality, data.partnerPersonality);
        const loveLanguageScore = this.calculateLoveLanguageCompatibility(data.yourLoveLanguage, data.partnerLoveLanguage);
        const religiousScore = this.calculateReligiousCompatibility(data);
        const culturalScore = this.calculateCulturalCompatibility(data);

        return {
            overall: Math.round((zodiacScore + personalityScore + loveLanguageScore + religiousScore + culturalScore) / 5),
            zodiac: zodiacScore,
            personality: personalityScore,
            loveLanguage: loveLanguageScore,
            religious: religiousScore,
            cultural: culturalScore
        };
    }

    generateCompatibilityReport(scores) {
        const report = {
            strengths: [],
            challenges: [],
            recommendations: []
        };

        // Generate strengths
        if (scores.zodiac >= 80) {
            report.strengths.push('Strong astrological compatibility');
        }
        if (scores.personality >= 80) {
            report.strengths.push('Complementary personality types');
        }
        if (scores.loveLanguage >= 80) {
            report.strengths.push('Matching love languages');
        }
        if (scores.religious >= 80) {
            report.strengths.push('Strong religious alignment');
        }
        if (scores.cultural >= 80) {
            report.strengths.push('Cultural harmony');
        }

        // Generate challenges
        if (scores.zodiac <= 50) {
            report.challenges.push('Different astrological elements may cause friction');
        }
        if (scores.personality <= 50) {
            report.challenges.push('Personality differences may require more understanding');
        }
        if (scores.loveLanguage <= 50) {
            report.challenges.push('Different love languages may need more communication');
        }
        if (scores.religious <= 50) {
            report.challenges.push('Religious differences may need to be addressed');
        }
        if (scores.cultural <= 50) {
            report.challenges.push('Cultural differences may require adaptation');
        }

        // Generate recommendations
        if (scores.overall >= 80) {
            report.recommendations.push('Focus on maintaining your strong connection');
        } else if (scores.overall >= 60) {
            report.recommendations.push('Work on understanding each other\'s differences');
        } else {
            report.recommendations.push('Consider relationship counseling or open communication about concerns');
        }

        return report;
    }
}

// UI Controller
class UIController {
    constructor() {
        this.calculator = new CompatibilityCalculator();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission (only on last tab)
        document.getElementById('loveForm').addEventListener('submit', this.handleFormSubmit.bind(this));

        // Next buttons for step navigation
        document.querySelectorAll('.next-tab-btn').forEach(button => {
            button.addEventListener('click', this.handleNextTab.bind(this));
        });

        // Back buttons for step navigation
        document.querySelectorAll('.back-tab-btn').forEach(button => {
            button.addEventListener('click', this.handleBackTab.bind(this));
        });

        // Birthday auto-fill zodiac
        ['yourBirthday', 'partnerBirthday'].forEach(id => {
            document.getElementById(id).addEventListener('change', this.handleBirthdayChange.bind(this));
        });
    }

    handleNextTab(event) {
        const currentTab = document.querySelector('.tab-content.active');
        const nextTabId = event.target.dataset.next;
        const formData = this.collectFormData();
        const validation = utils.validateForm(formData, currentTab.id);
        if (!validation.isValid) {
            this.showErrors(validation.errors);
            return;
        }
        // Switch to next tab
        this.switchTab(nextTabId);
    }

    handleBackTab(event) {
        const prevTabId = event.target.dataset.back;
        this.switchTab(prevTabId);
    }

    handleTabClick(event) {
        // Disable manual tab switching for step-by-step
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });
        // Show active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    handleBirthdayChange(event) {
        const birthday = event.target.value;
        const zodiacSign = utils.getZodiacSign(birthday);
        const zodiacSelect = document.getElementById(event.target.id.replace('Birthday', 'Zodiac'));
        zodiacSelect.value = zodiacSign;
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        this.setLoading(true);
        const formData = this.collectFormData();
        // Validate all fields
        const allTabs = ['personal', 'religious', 'cultural'];
        let allValid = true;
        for (const tab of allTabs) {
            const validation = utils.validateForm(formData, tab);
            if (!validation.isValid) {
                this.showErrors(validation.errors);
                this.switchTab(tab);
                this.setLoading(false);
                allValid = false;
                break;
            }
        }
        if (!allValid) return;
        try {
            // Calculate compatibility (enhanced logic)
            const scores = this.calculateFullCompatibility(formData);
            const report = this.generateFullReport(formData, scores);
            await this.showFullResults(formData, scores, report);
        } catch (error) {
            console.error('Error calculating compatibility:', error);
            this.showErrors({ form: 'An error occurred while calculating compatibility. Please try again.' });
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const form = document.getElementById('loveForm');
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    showErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

        // Show new errors
        Object.entries(errors).forEach(([field, message]) => {
            if (field === 'form') {
                // Show general form error
                const form = document.getElementById('loveForm');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-center text-red-600 mb-4';
                errorDiv.textContent = message;
                form.insertBefore(errorDiv, form.firstChild);
            } else {
                const input = document.getElementById(field);
                if (input) {
                    input.classList.add('input-error');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = message;
                    input.parentNode.appendChild(errorDiv);
                }
            }
        });
    }

    setLoading(isLoading) {
        const form = document.getElementById('loveForm');
        if (isLoading) {
            form.classList.add('loading');
        } else {
            form.classList.remove('loading');
        }
    }

    // --- Enhanced compatibility calculation ---
    calculateFullCompatibility(data) {
        // Age compatibility
        const yourBirthday = new Date(data.yourBirthday);
        const partnerBirthday = new Date(data.partnerBirthday);
        const ageDiff = Math.abs(yourBirthday.getFullYear() - partnerBirthday.getFullYear());
        const ageScore = Math.max(0, 100 - (ageDiff * 2));
        // Zodiac compatibility
        const zodiacCompatibility = {
            aries: { best: ['leo', 'sagittarius', 'gemini', 'aquarius'], worst: ['cancer', 'capricorn'] },
            taurus: { best: ['virgo', 'capricorn', 'cancer', 'pisces'], worst: ['leo', 'aquarius'] },
            gemini: { best: ['libra', 'aquarius', 'aries', 'leo'], worst: ['virgo', 'pisces'] },
            cancer: { best: ['scorpio', 'pisces', 'taurus', 'virgo'], worst: ['aries', 'libra'] },
            leo: { best: ['aries', 'sagittarius', 'gemini', 'libra'], worst: ['taurus', 'scorpio'] },
            virgo: { best: ['taurus', 'capricorn', 'cancer', 'scorpio'], worst: ['gemini', 'sagittarius'] },
            libra: { best: ['gemini', 'aquarius', 'leo', 'sagittarius'], worst: ['cancer', 'capricorn'] },
            scorpio: { best: ['cancer', 'pisces', 'virgo', 'capricorn'], worst: ['leo', 'aquarius'] },
            sagittarius: { best: ['aries', 'leo', 'libra', 'aquarius'], worst: ['virgo', 'pisces'] },
            capricorn: { best: ['taurus', 'virgo', 'scorpio', 'pisces'], worst: ['aries', 'libra'] },
            aquarius: { best: ['gemini', 'libra', 'sagittarius', 'aries'], worst: ['taurus', 'scorpio'] },
            pisces: { best: ['cancer', 'scorpio', 'taurus', 'capricorn'], worst: ['gemini', 'sagittarius'] }
        };
        let zodiacScore = 50;
        if (zodiacCompatibility[data.yourZodiac]?.best.includes(data.partnerZodiac)) {
            zodiacScore = 85 + Math.random() * 15;
        } else if (zodiacCompatibility[data.yourZodiac]?.worst.includes(data.partnerZodiac)) {
            zodiacScore = 15 + Math.random() * 20;
        } else {
            zodiacScore = 50 + Math.random() * 30;
        }
        zodiacScore = Math.min(100, Math.max(0, zodiacScore));
        // Personality compatibility
        let personalityScore = 50;
        if (data.yourPersonality === data.partnerPersonality) {
            personalityScore = 70 + Math.random() * 20;
        } else if (
            (data.yourPersonality === 'extrovert' && data.partnerPersonality === 'introvert') ||
            (data.yourPersonality === 'introvert' && data.partnerPersonality === 'extrovert')
        ) {
            personalityScore = 40 + Math.random() * 30;
        } else {
            personalityScore = 60 + Math.random() * 30;
        }
        // Love language compatibility
        let loveLanguageScore = 50;
        if (data.yourLoveLanguage === data.partnerLoveLanguage) {
            loveLanguageScore = 80 + Math.random() * 20;
        } else if (
            (data.yourLoveLanguage === 'words' && data.partnerLoveLanguage === 'acts') ||
            (data.yourLoveLanguage === 'acts' && data.partnerLoveLanguage === 'words') ||
            (data.yourLoveLanguage === 'gifts' && data.partnerLoveLanguage === 'time') ||
            (data.yourLoveLanguage === 'time' && data.partnerLoveLanguage === 'gifts')
        ) {
            loveLanguageScore = 30 + Math.random() * 20;
        } else {
            loveLanguageScore = 50 + Math.random() * 30;
        }
        // Religious compatibility
        let religiousScore = 70;
        if (data.yourReligion === data.partnerReligion && data.yourReligion !== "") {
            religiousScore += 20;
        }
        if (data.yourReligionImportance === 'very' && data.partnerReligionImportance === 'very') {
            religiousScore += 5;
        }
        if (data.yourConversion === 'yes' && data.partnerConversion === 'yes') {
            religiousScore += 5;
        }
        if (data.yourReligion === 'none' && data.partnerReligion === 'none') {
            religiousScore += 5;
        }
        religiousScore = Math.min(100, Math.max(0, religiousScore));
        // Cultural compatibility
        let culturalScore = 70;
        if (data.yourCulture === data.partnerCulture && data.yourCulture !== "") {
            culturalScore += 20;
        }
        if (data.yourTraditions === 'very' && data.partnerTraditions === 'very') {
            culturalScore += 5;
        }
        if (data.yourLanguage && data.partnerLanguage && data.yourLanguage.toLowerCase() === data.partnerLanguage.toLowerCase()) {
            culturalScore += 5;
        }
        culturalScore = Math.min(100, Math.max(0, culturalScore));
        // Marriage compatibility (weighted average, more weight to religion/culture)
        const marriage = Math.round((zodiacScore * 0.15 + personalityScore * 0.15 + loveLanguageScore * 0.15 + ageScore * 0.15 + religiousScore * 0.2 + culturalScore * 0.2));
        // Overall compatibility (all aspects, equal weight)
        const overall = Math.round((zodiacScore + personalityScore + loveLanguageScore + ageScore + religiousScore + culturalScore) / 6);
        return {
            overall,
            marriage,
            zodiac: Math.round(zodiacScore),
            personality: Math.round(personalityScore),
            loveLanguage: Math.round(loveLanguageScore),
            age: Math.round(ageScore),
            religious: Math.round(religiousScore),
            cultural: Math.round(culturalScore)
        };
    }

    generateFullReport(data, scores) {
        // General strengths/challenges
        const strengths = [], challenges = [];
        // Religious
        const religiousStrengths = [], religiousChallenges = [];
        // Cultural
        const culturalStrengths = [], culturalChallenges = [];
        // Zodiac
        const zodiacCompatibility = {
            aries: { best: ['leo', 'sagittarius', 'gemini', 'aquarius'], worst: ['cancer', 'capricorn'] },
            taurus: { best: ['virgo', 'capricorn', 'cancer', 'pisces'], worst: ['leo', 'aquarius'] },
            gemini: { best: ['libra', 'aquarius', 'aries', 'leo'], worst: ['virgo', 'pisces'] },
            cancer: { best: ['scorpio', 'pisces', 'taurus', 'virgo'], worst: ['aries', 'libra'] },
            leo: { best: ['aries', 'sagittarius', 'gemini', 'libra'], worst: ['taurus', 'scorpio'] },
            virgo: { best: ['taurus', 'capricorn', 'cancer', 'scorpio'], worst: ['gemini', 'sagittarius'] },
            libra: { best: ['gemini', 'aquarius', 'leo', 'sagittarius'], worst: ['cancer', 'capricorn'] },
            scorpio: { best: ['cancer', 'pisces', 'virgo', 'capricorn'], worst: ['leo', 'aquarius'] },
            sagittarius: { best: ['aries', 'leo', 'libra', 'aquarius'], worst: ['virgo', 'pisces'] },
            capricorn: { best: ['taurus', 'virgo', 'scorpio', 'pisces'], worst: ['aries', 'libra'] },
            aquarius: { best: ['gemini', 'libra', 'sagittarius', 'aries'], worst: ['taurus', 'scorpio'] },
            pisces: { best: ['cancer', 'scorpio', 'taurus', 'capricorn'], worst: ['gemini', 'sagittarius'] }
        };
        if (zodiacCompatibility[data.yourZodiac]?.best.includes(data.partnerZodiac)) {
            strengths.push(`Your ${data.yourZodiac} and their ${data.partnerZodiac} signs are highly compatible`);
        } else if (zodiacCompatibility[data.yourZodiac]?.worst.includes(data.partnerZodiac)) {
            challenges.push(`Your ${data.yourZodiac} and their ${data.partnerZodiac} signs may clash at times`);
        } else {
            strengths.push(`Your ${data.yourZodiac} and their ${data.partnerZodiac} signs can work well together`);
        }
        // Personality
        if (data.yourPersonality === data.partnerPersonality) {
            strengths.push(`You're both ${data.yourPersonality}s which creates harmony`);
        } else if (
            (data.yourPersonality === 'extrovert' && data.partnerPersonality === 'introvert') ||
            (data.yourPersonality === 'introvert' && data.partnerPersonality === 'extrovert')
        ) {
            strengths.push(`Your opposite personalities can complement each other`);
            challenges.push(`Your different social needs may require compromise`);
        } else {
            strengths.push(`Your balanced personalities create good chemistry`);
        }
        // Love language
        if (data.yourLoveLanguage === data.partnerLoveLanguage) {
            strengths.push(`You both value ${this.getLoveLanguageName(data.yourLoveLanguage)} which creates mutual understanding`);
        } else {
            strengths.push(`You can learn to appreciate each other's love languages`);
            challenges.push(`Different love languages may require extra effort to connect`);
        }
        // Age
        const yourBirthday = new Date(data.yourBirthday);
        const partnerBirthday = new Date(data.partnerBirthday);
        const ageDiff = Math.abs(yourBirthday.getFullYear() - partnerBirthday.getFullYear());
        if (ageDiff <= 3) {
            strengths.push(`Your similar ages mean you likely share life experiences`);
        } else if (ageDiff <= 10) {
            strengths.push(`Your age difference brings complementary perspectives`);
            challenges.push(`Your age gap may lead to different life priorities`);
        } else {
            challenges.push(`Your significant age difference may create generational gaps`);
        }
        // Religious strengths/challenges
        if (data.yourReligion === data.partnerReligion && data.yourReligion !== "") {
            religiousStrengths.push("You share the same religious background, which can foster unity.");
        } else if (data.yourReligion !== data.partnerReligion && data.yourReligion && data.partnerReligion) {
            religiousChallenges.push("Different religious backgrounds may require extra understanding and respect.");
        }
        if (data.yourReligionImportance === 'very' && data.partnerReligionImportance === 'very') {
            religiousStrengths.push("Religion is very important to both of you, which can strengthen your bond.");
        } else if (data.yourReligionImportance !== data.partnerReligionImportance) {
            religiousChallenges.push("Religion holds different levels of importance for each of you.");
        }
        if (data.yourConversion === 'yes' && data.partnerConversion === 'yes') {
            religiousStrengths.push("Both are open to conversion, showing flexibility.");
        } else if (data.yourConversion === 'no' || data.partnerConversion === 'no') {
            religiousChallenges.push("One or both of you are not open to conversion, which may limit compromise.");
        }
        if (data.yourReligion === 'none' && data.partnerReligion === 'none') {
            religiousStrengths.push("Neither of you is religious, which can reduce potential conflicts.");
        }
        // Cultural strengths/challenges
        if (data.yourCulture === data.partnerCulture && data.yourCulture !== "") {
            culturalStrengths.push("You share the same cultural background, which can make traditions and values easier to align.");
        } else if (data.yourCulture !== data.partnerCulture && data.yourCulture && data.partnerCulture) {
            culturalChallenges.push("Different cultural backgrounds may require adaptation and open-mindedness.");
        }
        if (data.yourTraditions === 'very' && data.partnerTraditions === 'very') {
            culturalStrengths.push("Cultural traditions are very important to both of you, which can create strong family bonds.");
        } else if (data.yourTraditions !== data.partnerTraditions) {
            culturalChallenges.push("Traditions hold different levels of importance for each of you.");
        }
        if (data.yourLanguage && data.partnerLanguage && data.yourLanguage.toLowerCase() === data.partnerLanguage.toLowerCase()) {
            culturalStrengths.push("You share the same primary language, making communication easier.");
        } else if (data.yourLanguage && data.partnerLanguage && data.yourLanguage.toLowerCase() !== data.partnerLanguage.toLowerCase()) {
            culturalChallenges.push("Different primary languages may require extra effort in communication.");
        }
        return { strengths, challenges, religiousStrengths, religiousChallenges, culturalStrengths, culturalChallenges };
    }

    getLoveLanguageName(code) {
        const names = {
            'words': 'Words of Affirmation',
            'time': 'Quality Time',
            'gifts': 'Receiving Gifts',
            'acts': 'Acts of Service',
            'touch': 'Physical Touch'
        };
        return names[code] || code;
    }

    async showFullResults(formData, scores, report) {
        // Set names
        document.getElementById('yourNameResult').textContent = formData.yourName;
        document.getElementById('partnerNameResult').textContent = formData.partnerName;
        // Set scores
        document.getElementById('zodiacScore').textContent = scores.zodiac + '%';
        document.getElementById('personalityScore').textContent = scores.personality + '%';
        document.getElementById('loveLanguageScore').textContent = scores.loveLanguage + '%';
        document.getElementById('ageScore').textContent = scores.age + '%';
        document.getElementById('religiousScore').textContent = scores.religious + '%';
        document.getElementById('culturalScore').textContent = scores.cultural + '%';
        document.getElementById('compatibilityPercent').textContent = scores.overall + '%';
        document.getElementById('marriagePercent').textContent = scores.marriage + '%';
        // Set compatibility titles
        let compatibilityTitle = '', marriageTitle = '';
        let compatibilityClass = '', marriageClass = '';
        if (scores.overall >= 80) {
            compatibilityTitle = 'Perfect Match!';
            compatibilityClass = 'text-green-600';
        } else if (scores.overall >= 60) {
            compatibilityTitle = 'Great Potential!';
            compatibilityClass = 'text-blue-600';
        } else if (scores.overall >= 40) {
            compatibilityTitle = 'Possible Match';
            compatibilityClass = 'text-yellow-600';
        } else {
            compatibilityTitle = 'Challenging Match';
            compatibilityClass = 'text-red-600';
        }
        if (scores.marriage >= 80) {
            marriageTitle = 'Excellent Marriage Potential!';
            marriageClass = 'text-green-700';
        } else if (scores.marriage >= 60) {
            marriageTitle = 'Good Marriage Potential';
            marriageClass = 'text-blue-700';
        } else if (scores.marriage >= 40) {
            marriageTitle = 'Possible Marriage Match';
            marriageClass = 'text-yellow-700';
        } else {
            marriageTitle = 'Marriage May Be Challenging';
            marriageClass = 'text-red-700';
        }
        document.getElementById('compatibilityTitle').textContent = compatibilityTitle;
        document.getElementById('compatibilityTitle').className = `text-2xl font-semibold ${compatibilityClass}`;
        document.getElementById('marriageTitle').textContent = marriageTitle;
        document.getElementById('marriageTitle').className = `text-xl font-semibold ${marriageClass}`;
        // Set strengths and challenges
        const setList = (id, arr) => {
            const el = document.getElementById(id);
            el.innerHTML = '';
            arr.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                li.className = 'mb-1';
                el.appendChild(li);
            });
        };
        setList('strengthsList', report.strengths);
        setList('challengesList', report.challenges);
        setList('religiousStrengthsList', report.religiousStrengths);
        setList('religiousChallengesList', report.religiousChallenges);
        setList('culturalStrengthsList', report.culturalStrengths);
        setList('culturalChallengesList', report.culturalChallenges);
        // Relationship & marriage advice
        const adviceElement = document.getElementById('relationshipAdvice');
        if (scores.marriage >= 80) {
            adviceElement.textContent = `You have excellent marriage potential! Shared values and strong compatibility across all aspects will help you build a lasting relationship.`;
        } else if (scores.marriage >= 60) {
            adviceElement.textContent = `You have good marriage potential. Focus on understanding each other's backgrounds and values to strengthen your bond.`;
        } else if (scores.marriage >= 40) {
            adviceElement.textContent = `Marriage is possible, but you may need to work on bridging differences in religion or culture. Open communication and respect are key.`;
        } else {
            adviceElement.textContent = `Marriage may be challenging due to significant differences. If you are committed, focus on empathy, compromise, and mutual respect.`;
        }
        // Show result container
        document.getElementById('resultContainer').classList.remove('hidden');
        // Animate the progress bars and circles
        setTimeout(() => {
            document.getElementById('compatibilityCircle').style.strokeDashoffset = 283 - (283 * scores.overall / 100);
            document.getElementById('marriageCircle').style.strokeDashoffset = 283 - (283 * scores.marriage / 100);
            document.getElementById('zodiacBar').style.width = scores.zodiac + '%';
            document.getElementById('personalityBar').style.width = scores.personality + '%';
            document.getElementById('loveLanguageBar').style.width = scores.loveLanguage + '%';
            document.getElementById('ageBar').style.width = scores.age + '%';
            document.getElementById('religiousBar').style.width = scores.religious + '%';
            document.getElementById('culturalBar').style.width = scores.cultural + '%';
        }, 100);
        // Scroll to results
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new UIController();
}); 