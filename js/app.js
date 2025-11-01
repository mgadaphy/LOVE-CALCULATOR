/**
 * Love & Marriage Compatibility Calculator
 * @version 2.0
 * @description A comprehensive compatibility calculator based on multiple dimensions
 * @license MIT
 */

// Constants and Configuration
const CONFIG = {
    storageKey: 'loveCalculatorData',
    maxHistoryItems: 10,
    calculationDelay: 2000, // ms
    minAge: 18, // Minimum age requirement
    minYear: 1900, // Minimum birth year
    maxYear: new Date().getFullYear(), // Maximum birth year (current year)
};

/**
 * Zodiac Compatibility Matrix
 * Based on astrological element theory (Fire, Earth, Air, Water)
 * @constant
 */
const ZODIAC_COMPATIBILITY = {
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

/**
 * Compatibility score ranges
 * @constant
 */
const COMPATIBILITY_SCORES = {
    PERFECT: 85,
    GOOD: 70,
    NEUTRAL: 50,
    CHALLENGING: 35
};

/**
 * Disclaimer message for entertainment purposes
 * @constant
 */
const DISCLAIMER = "This calculator is for entertainment and educational purposes only. Results should not be used to make serious relationship decisions.";

/**
 * Chinese Zodiac Compatibility Matrix
 * Based on traditional Chinese astrology (12-year cycle)
 * @constant
 */
const CHINESE_ZODIAC = {
    rat: { years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020], best: ['dragon', 'monkey', 'ox'], worst: ['horse', 'rooster'] },
    ox: { years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021], best: ['rat', 'snake', 'rooster'], worst: ['sheep', 'horse'] },
    tiger: { years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022], best: ['horse', 'dog', 'pig'], worst: ['snake', 'monkey'] },
    rabbit: { years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023], best: ['sheep', 'pig', 'dog'], worst: ['rooster', 'rat'] },
    dragon: { years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024], best: ['rat', 'monkey', 'rooster'], worst: ['dog', 'rabbit'] },
    snake: { years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025], best: ['ox', 'rooster'], worst: ['tiger', 'pig'] },
    horse: { years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014], best: ['tiger', 'sheep', 'dog'], worst: ['rat', 'ox'] },
    sheep: { years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015], best: ['rabbit', 'horse', 'pig'], worst: ['ox', 'dog'] },
    monkey: { years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016], best: ['rat', 'dragon'], worst: ['tiger', 'pig'] },
    rooster: { years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017], best: ['ox', 'snake', 'dragon'], worst: ['rabbit', 'dog'] },
    dog: { years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018], best: ['rabbit', 'tiger', 'horse'], worst: ['dragon', 'sheep'] },
    pig: { years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019], best: ['rabbit', 'sheep', 'tiger'], worst: ['snake', 'monkey'] }
};

/**
 * Celebrity Database for Celebrity Match Feature
 * @constant
 */
const CELEBRITIES = [
    { name: "Ryan Reynolds", birthday: "1976-10-23", zodiac: "scorpio", gender: "male", personality: "extrovert", loveLanguage: "words" },
    { name: "Blake Lively", birthday: "1987-08-25", zodiac: "virgo", gender: "female", personality: "extrovert", loveLanguage: "time" },
    { name: "Chris Hemsworth", birthday: "1983-08-11", zodiac: "leo", gender: "male", personality: "extrovert", loveLanguage: "touch" },
    { name: "Scarlett Johansson", birthday: "1984-11-22", zodiac: "sagittarius", gender: "female", personality: "ambivert", loveLanguage: "acts" },
    { name: "Zendaya", birthday: "1996-09-01", zodiac: "virgo", gender: "female", personality: "ambivert", loveLanguage: "time" },
    { name: "Tom Holland", birthday: "1996-06-01", zodiac: "gemini", gender: "male", personality: "extrovert", loveLanguage: "words" },
    { name: "Beyoncé", birthday: "1981-09-04", zodiac: "virgo", gender: "female", personality: "extrovert", loveLanguage: "acts" },
    { name: "Jay-Z", birthday: "1969-12-04", zodiac: "sagittarius", gender: "male", personality: "introvert", loveLanguage: "gifts" },
    { name: "Taylor Swift", birthday: "1989-12-13", zodiac: "sagittarius", gender: "female", personality: "ambivert", loveLanguage: "words" },
    { name: "Harry Styles", birthday: "1994-02-01", zodiac: "aquarius", gender: "male", personality: "extrovert", loveLanguage: "touch" },
    { name: "Emma Watson", birthday: "1990-04-15", zodiac: "aries", gender: "female", personality: "introvert", loveLanguage: "acts" },
    { name: "Timothée Chalamet", birthday: "1995-12-27", zodiac: "capricorn", gender: "male", personality: "introvert", loveLanguage: "time" },
    { name: "Ariana Grande", birthday: "1993-06-26", zodiac: "cancer", gender: "female", personality: "extrovert", loveLanguage: "words" },
    { name: "Dwayne Johnson", birthday: "1972-05-02", zodiac: "taurus", gender: "male", personality: "extrovert", loveLanguage: "acts" },
    { name: "Jennifer Lawrence", birthday: "1990-08-15", zodiac: "leo", gender: "female", personality: "extrovert", loveLanguage: "words" },
    { name: "Brad Pitt", birthday: "1963-12-18", zodiac: "sagittarius", gender: "male", personality: "ambivert", loveLanguage: "time" },
    { name: "Angelina Jolie", birthday: "1975-06-04", zodiac: "gemini", gender: "female", personality: "ambivert", loveLanguage: "acts" },
    { name: "Keanu Reeves", birthday: "1964-09-02", zodiac: "virgo", gender: "male", personality: "introvert", loveLanguage: "acts" },
    { name: "Rihanna", birthday: "1988-02-20", zodiac: "pisces", gender: "female", personality: "extrovert", loveLanguage: "gifts" },
    { name: "Chris Evans", birthday: "1981-06-13", zodiac: "gemini", gender: "male", personality: "ambivert", loveLanguage: "time" }
];

/**
 * Utility Functions
 * Helper methods for calculations and validations
 */
const utils = {
    /**
     * Calculate zodiac sign from birthday
     * @param {string} birthday - Date in YYYY-MM-DD format
     * @returns {string} Zodiac sign in lowercase
     */
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

    /**
     * Calculate age from birthday
     * @param {string} birthday - Date in YYYY-MM-DD format
     * @returns {number} Age in years
     */
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

    /**
     * Validate birth year is within acceptable range
     * @param {string} birthday - Date in YYYY-MM-DD format
     * @returns {boolean} True if valid year
     */
    isValidBirthYear(birthday) {
        const year = new Date(birthday).getFullYear();
        return year >= CONFIG.minYear && year <= CONFIG.maxYear;
    },

    /**
     * Sanitize user input to prevent XSS
     * @param {string} str - Input string
     * @returns {string} Sanitized string
     */
    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Get Chinese Zodiac sign from birth year
     * @param {string} birthday - Date in YYYY-MM-DD format
     * @returns {string} Chinese zodiac sign
     */
    getChineseZodiac(birthday) {
        const year = new Date(birthday).getFullYear();
        for (const [animal, data] of Object.entries(CHINESE_ZODIAC)) {
            if (data.years.includes(year)) {
                return animal;
            }
        }
        // Fallback calculation for years not in the array
        const animals = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep'];
        return animals[year % 12];
    },

    /**
     * Calculate Life Path Number for numerology
     * @param {string} birthday - Date in YYYY-MM-DD format
     * @returns {number} Life path number (1-9, 11, 22, 33)
     */
    calculateLifePathNumber(birthday) {
        const date = new Date(birthday);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Sum all digits
        let sum = day + month + year;

        // Reduce to single digit (except master numbers 11, 22, 33)
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        return sum;
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

    /**
     * Validate form data with comprehensive edge case handling
     * @param {Object} formData - Form data object
     * @param {string} activeTab - Currently active tab ID
     * @returns {Object} Validation result with isValid flag and errors object
     */
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
            if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
            }
        });

        // Additional validations for personal tab
        if (activeTab === 'personal') {
            // Check if comparing same person
            if (formData.yourName && formData.partnerName &&
                formData.yourName.trim().toLowerCase() === formData.partnerName.trim().toLowerCase()) {
                errors.form = 'Please enter two different people for comparison';
            }

            // Birth year validation
            if (formData.yourBirthday) {
                if (!this.isValidBirthYear(formData.yourBirthday)) {
                    errors.yourBirthday = `Birth year must be between ${CONFIG.minYear} and ${CONFIG.maxYear}`;
                }

                const yourAge = this.calculateAge(formData.yourBirthday);
                if (yourAge < CONFIG.minAge) {
                    errors.yourBirthday = `You must be at least ${CONFIG.minAge} years old`;
                }
                if (yourAge > 150) {
                    errors.yourBirthday = 'Please enter a valid birth date';
                }
            }

            if (formData.partnerBirthday) {
                if (!this.isValidBirthYear(formData.partnerBirthday)) {
                    errors.partnerBirthday = `Birth year must be between ${CONFIG.minYear} and ${CONFIG.maxYear}`;
                }

                const partnerAge = this.calculateAge(formData.partnerBirthday);
                if (partnerAge < CONFIG.minAge) {
                    errors.partnerBirthday = `Partner must be at least ${CONFIG.minAge} years old`;
                }
                if (partnerAge > 150) {
                    errors.partnerBirthday = 'Please enter a valid birth date';
                }
            }
        }

        // Validate language fields are not empty for cultural tab
        if (activeTab === 'cultural') {
            if (formData.yourLanguage && formData.yourLanguage.trim().length < 2) {
                errors.yourLanguage = 'Please enter a valid language';
            }
            if (formData.partnerLanguage && formData.partnerLanguage.trim().length < 2) {
                errors.partnerLanguage = 'Please enter a valid language';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

/**
 * Compatibility Calculator
 * Core calculation logic for relationship compatibility
 */
class CompatibilityCalculator {
    constructor() {
        // No need to duplicate zodiac data - use global constant
    }

    /**
     * Calculate zodiac compatibility score
     * @param {string} sign1 - First zodiac sign
     * @param {string} sign2 - Second zodiac sign
     * @returns {number} Compatibility score (0-100)
     */
    calculateZodiacCompatibility(sign1, sign2) {
        const compatibility = ZODIAC_COMPATIBILITY[sign1];
        if (!compatibility) return COMPATIBILITY_SCORES.NEUTRAL;

        if (compatibility.best.includes(sign2)) return COMPATIBILITY_SCORES.PERFECT;
        if (compatibility.worst.includes(sign2)) return COMPATIBILITY_SCORES.CHALLENGING;
        return COMPATIBILITY_SCORES.GOOD;
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

    /**
     * Calculate Chinese Zodiac compatibility score
     * @param {string} animal1 - First Chinese zodiac animal
     * @param {string} animal2 - Second Chinese zodiac animal
     * @returns {number} Compatibility score (0-100)
     */
    calculateChineseZodiacCompatibility(animal1, animal2) {
        const data = CHINESE_ZODIAC[animal1];
        if (!data) return COMPATIBILITY_SCORES.NEUTRAL;

        if (data.best.includes(animal2)) return 90;
        if (data.worst.includes(animal2)) return 35;
        return 68;
    }

    /**
     * Calculate Numerology compatibility (Life Path Numbers)
     * @param {number} num1 - First life path number
     * @param {number} num2 - Second life path number
     * @returns {number} Compatibility score (0-100)
     */
    calculateNumerologyCompatibility(num1, num2) {
        // Same numbers are highly compatible
        if (num1 === num2) return 92;

        // Master number combinations
        const masterNumbers = [11, 22, 33];
        if (masterNumbers.includes(num1) && masterNumbers.includes(num2)) return 88;

        // Compatible number pairs (based on numerology principles)
        const compatiblePairs = {
            1: [3, 5, 9],
            2: [4, 6, 8],
            3: [1, 5, 9],
            4: [2, 6, 8],
            5: [1, 3, 7],
            6: [2, 4, 8, 9],
            7: [5, 9],
            8: [2, 4, 6],
            9: [1, 3, 6, 7]
        };

        if (compatiblePairs[num1]?.includes(num2)) return 82;
        return 60;
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

    /**
     * Initialize all event listeners for the application
     */
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

        // Keyboard navigation for tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('keydown', this.handleTabKeydown.bind(this));
        });

        // New feature buttons (will be added after results are shown)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'shareBtn' || e.target.closest('#shareBtn')) {
                this.handleShare();
            }
            if (e.target.id === 'printBtn' || e.target.closest('#printBtn')) {
                this.handlePrint();
            }
            if (e.target.id === 'historyBtn' || e.target.closest('#historyBtn')) {
                this.showHistory();
            }
            if (e.target.id === 'closeHistoryBtn' || e.target.closest('#closeHistoryBtn')) {
                this.closeHistory();
            }
            // Celebrity Match
            if (e.target.id === 'celebrityMatchBtn' || e.target.closest('#celebrityMatchBtn')) {
                this.showCelebrityMatch();
            }
            if (e.target.id === 'closeCelebrityBtn' || e.target.closest('#closeCelebrityBtn')) {
                this.closeCelebrityMatch();
            }
            // Comparison Mode
            if (e.target.id === 'comparisonModeBtn' || e.target.closest('#comparisonModeBtn')) {
                this.showComparisonMode();
            }
            if (e.target.id === 'closeComparisonBtn' || e.target.closest('#closeComparisonBtn')) {
                this.closeComparisonMode();
            }
        });

        // Close modal on outside click
        document.getElementById('historyModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'historyModal') {
                this.closeHistory();
            }
        });
        document.getElementById('celebrityModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'celebrityModal') {
                this.closeCelebrityMatch();
            }
        });
        document.getElementById('comparisonModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'comparisonModal') {
                this.closeComparisonMode();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!document.getElementById('historyModal').classList.contains('hidden')) {
                    this.closeHistory();
                }
                if (!document.getElementById('celebrityModal').classList.contains('hidden')) {
                    this.closeCelebrityMatch();
                }
                if (!document.getElementById('comparisonModal').classList.contains('hidden')) {
                    this.closeComparisonMode();
                }
            }
        });

        // Add global error handler for better UX
        window.addEventListener('error', this.handleGlobalError.bind(this));
    }

    /**
     * Handle keyboard navigation for tab buttons (Arrow keys)
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTabKeydown(event) {
        const tabs = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = tabs.indexOf(event.target);

        let targetTab = null;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                targetTab = tabs[currentIndex + 1] || tabs[0];
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                targetTab = tabs[currentIndex - 1] || tabs[tabs.length - 1];
                break;
            case 'Home':
                event.preventDefault();
                targetTab = tabs[0];
                break;
            case 'End':
                event.preventDefault();
                targetTab = tabs[tabs.length - 1];
                break;
            default:
                return;
        }

        if (targetTab) {
            targetTab.focus();
            // Update tabindex
            tabs.forEach(tab => tab.setAttribute('tabindex', '-1'));
            targetTab.setAttribute('tabindex', '0');
        }
    }

    /**
     * Handle global application errors
     * @param {ErrorEvent} event - Error event
     */
    handleGlobalError(event) {
        console.error('Application error:', event.error);
        // Could send to error tracking service here
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

    /**
     * Switch to a different tab with proper ARIA management
     * @param {string} tabId - ID of the tab to switch to
     */
    switchTab(tabId) {
        // Update active tab button and ARIA attributes
        document.querySelectorAll('.tab-button').forEach(button => {
            const isActive = button.dataset.tab === tabId;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive.toString());
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Show active tab content and manage hidden attribute
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);

            if (isActive) {
                content.removeAttribute('hidden');
                content.focus(); // Focus the tab panel for screen readers
            } else {
                content.setAttribute('hidden', '');
            }
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

    /**
     * Calculate comprehensive compatibility across all dimensions
     * @param {Object} data - Form data with all user inputs
     * @returns {Object} Scores object with overall, marriage, and individual dimension scores
     */
    calculateFullCompatibility(data) {
        // Age compatibility calculation
        const yourBirthday = new Date(data.yourBirthday);
        const partnerBirthday = new Date(data.partnerBirthday);
        const ageDiff = Math.abs(yourBirthday.getFullYear() - partnerBirthday.getFullYear());
        const ageScore = Math.max(0, 100 - (ageDiff * 2));

        // Zodiac compatibility (using global constant - no randomness)
        let zodiacScore = 50;
        if (ZODIAC_COMPATIBILITY[data.yourZodiac]?.best.includes(data.partnerZodiac)) {
            zodiacScore = 88;
        } else if (ZODIAC_COMPATIBILITY[data.yourZodiac]?.worst.includes(data.partnerZodiac)) {
            zodiacScore = 32;
        } else {
            zodiacScore = 65;
        }
        zodiacScore = Math.min(100, Math.max(0, zodiacScore));

        // Personality compatibility (consistent scoring)
        let personalityScore = 50;
        if (data.yourPersonality === data.partnerPersonality) {
            personalityScore = 82;
        } else if (
            (data.yourPersonality === 'extrovert' && data.partnerPersonality === 'introvert') ||
            (data.yourPersonality === 'introvert' && data.partnerPersonality === 'extrovert')
        ) {
            personalityScore = 58;
        } else {
            personalityScore = 75; // Ambivert combinations
        }

        // Love language compatibility (consistent scoring)
        let loveLanguageScore = 50;
        if (data.yourLoveLanguage === data.partnerLoveLanguage) {
            loveLanguageScore = 90;
        } else if (
            (data.yourLoveLanguage === 'words' && data.partnerLoveLanguage === 'acts') ||
            (data.yourLoveLanguage === 'acts' && data.partnerLoveLanguage === 'words') ||
            (data.yourLoveLanguage === 'gifts' && data.partnerLoveLanguage === 'time') ||
            (data.yourLoveLanguage === 'time' && data.partnerLoveLanguage === 'gifts')
        ) {
            loveLanguageScore = 40;
        } else {
            loveLanguageScore = 68;
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

        // NEW: Chinese Zodiac compatibility
        const yourChineseZodiac = utils.getChineseZodiac(data.yourBirthday);
        const partnerChineseZodiac = utils.getChineseZodiac(data.partnerBirthday);
        const chineseZodiacScore = this.calculator.calculateChineseZodiacCompatibility(yourChineseZodiac, partnerChineseZodiac);

        // NEW: Numerology compatibility
        const yourLifePath = utils.calculateLifePathNumber(data.yourBirthday);
        const partnerLifePath = utils.calculateLifePathNumber(data.partnerBirthday);
        const numerologyScore = this.calculator.calculateNumerologyCompatibility(yourLifePath, partnerLifePath);

        // Marriage compatibility (weighted average, more weight to religion/culture)
        const marriage = Math.round((zodiacScore * 0.15 + personalityScore * 0.15 + loveLanguageScore * 0.15 + ageScore * 0.15 + religiousScore * 0.2 + culturalScore * 0.2));

        // Overall compatibility (now includes 8 dimensions)
        const overall = Math.round((zodiacScore + personalityScore + loveLanguageScore + ageScore + religiousScore + culturalScore + chineseZodiacScore + numerologyScore) / 8);

        return {
            overall,
            marriage,
            zodiac: Math.round(zodiacScore),
            personality: Math.round(personalityScore),
            loveLanguage: Math.round(loveLanguageScore),
            age: Math.round(ageScore),
            religious: Math.round(religiousScore),
            cultural: Math.round(culturalScore),
            chineseZodiac: Math.round(chineseZodiacScore),
            numerology: Math.round(numerologyScore),
            // Store the actual zodiac signs and life path numbers for display
            yourChineseZodiac,
            partnerChineseZodiac,
            yourLifePath,
            partnerLifePath
        };
    }

    /**
     * Generate detailed compatibility report with strengths and challenges
     * @param {Object} data - Form data
     * @param {Object} scores - Calculated compatibility scores
     * @returns {Object} Report with strengths and challenges arrays
     */
    generateFullReport(data, scores) {
        // Initialize result arrays
        const strengths = [], challenges = [];
        const religiousStrengths = [], religiousChallenges = [];
        const culturalStrengths = [], culturalChallenges = [];

        // Zodiac analysis (using global constant)
        if (ZODIAC_COMPATIBILITY[data.yourZodiac]?.best.includes(data.partnerZodiac)) {
            strengths.push(`Your ${data.yourZodiac} and their ${data.partnerZodiac} signs are highly compatible`);
        } else if (ZODIAC_COMPATIBILITY[data.yourZodiac]?.worst.includes(data.partnerZodiac)) {
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

    /**
     * Display comprehensive results with animations
     * @param {Object} formData - User input data
     * @param {Object} scores - Calculated compatibility scores
     * @param {Object} report - Generated compatibility report
     */
    async showFullResults(formData, scores, report) {
        // Set names (sanitized for XSS protection)
        document.getElementById('yourNameResult').textContent = utils.sanitize(formData.yourName);
        document.getElementById('partnerNameResult').textContent = utils.sanitize(formData.partnerName);
        // Set scores
        document.getElementById('zodiacScore').textContent = scores.zodiac + '%';
        document.getElementById('personalityScore').textContent = scores.personality + '%';
        document.getElementById('loveLanguageScore').textContent = scores.loveLanguage + '%';
        document.getElementById('ageScore').textContent = scores.age + '%';
        document.getElementById('religiousScore').textContent = scores.religious + '%';
        document.getElementById('culturalScore').textContent = scores.cultural + '%';
        document.getElementById('chineseZodiacScore').textContent = scores.chineseZodiac + '%';
        document.getElementById('numerologyScore').textContent = scores.numerology + '%';
        document.getElementById('compatibilityPercent').textContent = scores.overall + '%';
        document.getElementById('marriagePercent').textContent = scores.marriage + '%';

        // Set Chinese Zodiac animals and Life Path numbers
        document.getElementById('chineseZodiacAnimals').textContent =
            `(${scores.yourChineseZodiac} & ${scores.partnerChineseZodiac})`;
        document.getElementById('lifePathNumbers').textContent =
            `(${scores.yourLifePath} & ${scores.partnerLifePath})`;
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
        // Set strengths and challenges with proper section visibility
        const setList = (id, arr, sectionId = null) => {
            const el = document.getElementById(id);
            el.innerHTML = '';

            if (arr.length === 0) {
                // Hide the entire section if there's no content
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) section.classList.add('hidden');
                }
            } else {
                // Show section if it has content
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) section.classList.remove('hidden');
                }

                arr.forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    li.className = 'mb-1';
                    el.appendChild(li);
                });
            }
        };

        // Main lists (always visible)
        setList('strengthsList', report.strengths);
        setList('challengesList', report.challenges);

        // Religious lists (hide section if empty)
        setList('religiousStrengthsList', report.religiousStrengths, 'religiousStrengthsSection');
        setList('religiousChallengesList', report.religiousChallenges, 'religiousChallengesSection');

        // Cultural lists (hide section if empty)
        setList('culturalStrengthsList', report.culturalStrengths, 'culturalStrengthsSection');
        setList('culturalChallengesList', report.culturalChallenges, 'culturalChallengesSection');
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
            document.getElementById('chineseZodiacBar').style.width = scores.chineseZodiac + '%';
            document.getElementById('numerologyBar').style.width = scores.numerology + '%';
        }, 100);
        // Scroll to results
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });

        // Save to localStorage
        utils.saveToLocalStorage({
            timestamp: new Date().toISOString(),
            names: {
                yours: formData.yourName,
                partner: formData.partnerName
            },
            scores: scores,
            report: report
        });
    }

    /**
     * Handle share button click
     * Uses Web Share API if available, otherwise copies to clipboard
     */
    async handleShare() {
        const yourName = document.getElementById('yourNameResult').textContent;
        const partnerName = document.getElementById('partnerNameResult').textContent;
        const score = document.getElementById('compatibilityPercent').textContent;
        const marriageScore = document.getElementById('marriagePercent').textContent;

        const shareText = `${yourName} & ${partnerName} Compatibility Results!\n\n❤️ Love: ${score}\n💍 Marriage: ${marriageScore}\n\nCalculate your compatibility at ${window.location.href}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Love Compatibility Results',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard! Share them with your friends.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Manual fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Results copied to clipboard!');
        }
    }

    /**
     * Handle print button click
     * Opens browser print dialog
     */
    handlePrint() {
        window.print();
    }

    /**
     * Show calculation history modal
     */
    showHistory() {
        const history = utils.getFromLocalStorage();
        const historyContent = document.getElementById('historyContent');
        const emptyHistory = document.getElementById('emptyHistory');
        const modal = document.getElementById('historyModal');

        historyContent.innerHTML = '';

        if (history.length === 0) {
            emptyHistory.classList.remove('hidden');
            historyContent.classList.add('hidden');
        } else {
            emptyHistory.classList.add('hidden');
            historyContent.classList.remove('hidden');

            history.forEach((item, index) => {
                const date = new Date(item.timestamp);
                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                const historyItem = document.createElement('div');
                historyItem.className = 'bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition';
                historyItem.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-pink-600">
                                ${utils.sanitize(item.names.yours)} & ${utils.sanitize(item.names.partner)}
                            </h3>
                            <p class="text-xs text-gray-500">
                                <i class="far fa-clock mr-1"></i>${dateStr}
                            </p>
                        </div>
                        <button onclick="app.deleteHistoryItem(${index})" class="text-red-500 hover:text-red-700 transition" aria-label="Delete this entry">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-3 gap-3 text-center">
                        <div class="bg-pink-50 rounded p-2">
                            <div class="text-2xl font-bold text-pink-600">${item.scores.overall}%</div>
                            <div class="text-xs text-gray-600">Love</div>
                        </div>
                        <div class="bg-green-50 rounded p-2">
                            <div class="text-2xl font-bold text-green-600">${item.scores.marriage}%</div>
                            <div class="text-xs text-gray-600">Marriage</div>
                        </div>
                        <div class="bg-blue-50 rounded p-2">
                            <div class="text-2xl font-bold text-blue-600">${item.scores.zodiac}%</div>
                            <div class="text-xs text-gray-600">Zodiac</div>
                        </div>
                    </div>
                `;
                historyContent.appendChild(historyItem);
            });
        }

        modal.classList.remove('hidden');
        // Trap focus in modal
        document.getElementById('closeHistoryBtn').focus();
    }

    /**
     * Close history modal
     */
    closeHistory() {
        document.getElementById('historyModal').classList.add('hidden');
    }

    /**
     * Delete a specific history item
     * @param {number} index - Index of item to delete
     */
    deleteHistoryItem(index) {
        const history = utils.getFromLocalStorage();
        history.splice(index, 1);
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
        this.showHistory(); // Refresh the display
    }

    /**
     * Show Celebrity Match modal with all celebrities
     */
    showCelebrityMatch() {
        const formData = this.collectFormData();

        // Need at least your information
        if (!formData.yourName || !formData.yourBirthday || !formData.yourZodiac ||
            !formData.yourPersonality || !formData.yourLoveLanguage) {
            alert('Please fill in your personal information (Personal tab) first!');
            return;
        }

        const celebrityResults = document.getElementById('celebrityResults');
        const modal = document.getElementById('celebrityModal');
        celebrityResults.innerHTML = '';

        // Calculate compatibility with each celebrity
        const matches = CELEBRITIES.map(celebrity => {
            const tempData = {
                yourName: formData.yourName,
                yourBirthday: formData.yourBirthday,
                yourZodiac: formData.yourZodiac,
                yourPersonality: formData.yourPersonality,
                yourLoveLanguage: formData.yourLoveLanguage,
                yourGender: formData.yourGender,
                partnerName: celebrity.name,
                partnerBirthday: celebrity.birthday,
                partnerZodiac: celebrity.zodiac,
                partnerPersonality: celebrity.personality,
                partnerLoveLanguage: celebrity.loveLanguage,
                partnerGender: celebrity.gender,
                // Dummy data for required fields
                yourReligion: 'none',
                partnerReligion: 'none',
                yourReligionImportance: 'not',
                partnerReligionImportance: 'not',
                yourConversion: 'maybe',
                partnerConversion: 'maybe',
                yourCulture: 'western',
                partnerCulture: 'western',
                yourLanguage: 'English',
                partnerLanguage: 'English',
                yourTraditions: 'not',
                partnerTraditions: 'not'
            };

            const scores = this.calculateFullCompatibility(tempData);
            return { celebrity, score: scores.overall };
        });

        // Sort by compatibility
        matches.sort((a, b) => b.score - a.score);

        // Display results
        matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-pink-400 transition cursor-pointer transform hover:scale-105';

            const scoreColor = match.score >= 80 ? 'text-green-600' :
                              match.score >= 60 ? 'text-blue-600' :
                              match.score >= 40 ? 'text-yellow-600' : 'text-red-600';

            card.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-2">
                        ${match.celebrity.gender === 'male' ? '👨' : '👩'}
                    </div>
                    <h3 class="font-bold text-lg text-gray-800">${match.celebrity.name}</h3>
                    <p class="text-xs text-gray-500 capitalize">${match.celebrity.zodiac}</p>
                    <div class="mt-3">
                        <div class="text-3xl font-bold ${scoreColor}">${match.score}%</div>
                        <div class="text-xs text-gray-600">Compatibility</div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        ${match.score >= 80 ? '💕 Perfect Match!' :
                          match.score >= 60 ? '💖 Great Potential!' :
                          match.score >= 40 ? '💗 Possible Match' : '💔 Challenging'}
                    </div>
                </div>
            `;

            celebrityResults.appendChild(card);
        });

        modal.classList.remove('hidden');
        document.getElementById('closeCelebrityBtn').focus();
    }

    /**
     * Show Comparison Mode modal with history
     */
    showComparisonMode() {
        const history = utils.getFromLocalStorage();
        const modal = document.getElementById('comparisonModal');
        const content = document.getElementById('comparisonContent');

        if (history.length < 2) {
            content.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-inbox text-6xl mb-4 opacity-30"></i>
                    <p class="text-lg">You need at least 2 calculations in your history to compare</p>
                    <p class="text-sm">Complete more compatibility checks first!</p>
                </div>
            `;
            modal.classList.remove('hidden');
            return;
        }

        // Create comparison table
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-3 text-left font-semibold">Partner</th>
                            <th class="p-3 text-center font-semibold">Love %</th>
                            <th class="p-3 text-center font-semibold">Marriage %</th>
                            <th class="p-3 text-center font-semibold">Zodiac</th>
                            <th class="p-3 text-center font-semibold">Personality</th>
                            <th class="p-3 text-center font-semibold">Love Lang.</th>
                            <th class="p-3 text-center font-semibold">Age</th>
                            <th class="p-3 text-center font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        history.forEach((item, index) => {
            const date = new Date(item.timestamp).toLocaleDateString();
            const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

            tableHTML += `
                <tr class="${rowClass} hover:bg-blue-50 transition">
                    <td class="p-3 font-medium text-pink-600">${utils.sanitize(item.names.partner)}</td>
                    <td class="p-3 text-center">
                        <span class="font-bold ${item.scores.overall >= 70 ? 'text-green-600' : 'text-gray-600'}">
                            ${item.scores.overall}%
                        </span>
                    </td>
                    <td class="p-3 text-center">
                        <span class="font-bold ${item.scores.marriage >= 70 ? 'text-green-600' : 'text-gray-600'}">
                            ${item.scores.marriage}%
                        </span>
                    </td>
                    <td class="p-3 text-center text-gray-600">${item.scores.zodiac}%</td>
                    <td class="p-3 text-center text-gray-600">${item.scores.personality}%</td>
                    <td class="p-3 text-center text-gray-600">${item.scores.loveLanguage}%</td>
                    <td class="p-3 text-center text-gray-600">${item.scores.age}%</td>
                    <td class="p-3 text-center text-xs text-gray-500">${date}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
            <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-lightbulb mr-2"></i>
                    <strong>Tip:</strong> Higher percentages indicate better compatibility. Focus on overall compatibility and marriage scores for long-term potential.
                </p>
            </div>
        `;

        content.innerHTML = tableHTML;
        modal.classList.remove('hidden');
        document.getElementById('closeComparisonBtn').focus();
    }

    /**
     * Close celebrity match modal
     */
    closeCelebrityMatch() {
        document.getElementById('celebrityModal').classList.add('hidden');
    }

    /**
     * Close comparison modal
     */
    closeComparisonMode() {
        document.getElementById('comparisonModal').classList.add('hidden');
    }
}

// Initialize the application
let app; // Global reference for history delete
document.addEventListener('DOMContentLoaded', () => {
    app = new UIController();
}); 