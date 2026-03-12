// Local Storage Key
const STORAGE_KEY = 'cms_content_list';

// Execute after page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load content list if on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadContentList();
        // Bind search button event
        document.getElementById('search-btn').addEventListener('click', searchContent);
    }

    // Bind form submit event if on add content page
    if (window.location.pathname.includes('add-content.html')) {
        document.getElementById('add-content-form').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            saveContent();
        });
    }
});

// Load content list from local storage
function loadContentList() {
    const contentList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const listElement = document.getElementById('content-list');

    // Clear list
    listElement.innerHTML = '';

    // No content available
    if (contentList.length === 0) {
        listElement.innerHTML = `
            <div class="content-item empty">
                No content available, <a href="add-content.html">click to add</a>
            </div>
        `;
        return;
    }

    // Render content list
    contentList.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'content-item';
        itemElement.innerHTML = `
            <h3>${item.title}</h3>
            <div class="meta">Created at: ${item.createTime}</div>
            <p>${item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}</p>
        `;
        listElement.appendChild(itemElement);
    });
}

// Save content to local storage
function saveContent() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    // Simple validation
    if (!title) {
        alert('Please enter the title!');
        return;
    }
    if (!content) {
        alert('Please enter the content!');
        return;
    }

    // Get existing content list
    const contentList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Add new content (prepend to list)
    contentList.unshift({
        title: title,
        content: content,
        createTime: new Date().toLocaleString() // Local time
    });

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentList));

    // Success message and redirect to homepage
    alert('Content saved successfully!');
    window.location.href = 'index.html';
}

// Search content by title/content
function searchContent() {
    const searchText = document.getElementById('search-input').value.trim().toLowerCase();
    const contentList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const listElement = document.getElementById('content-list');

    // Clear list
    listElement.innerHTML = '';

    // Filter content
    const filteredList = contentList.filter(item => 
        item.title.toLowerCase().includes(searchText) || item.content.toLowerCase().includes(searchText)
    );

    // No matching content
    if (filteredList.length === 0) {
        listElement.innerHTML = `
            <div class="content-item empty">
                No matching content found
            </div>
        `;
        return;
    }

    // Render filtered list
    filteredList.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'content-item';
        itemElement.innerHTML = `
            <h3>${item.title}</h3>
            <div class="meta">Created at: ${item.createTime}</div>
            <p>${item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}</p>
        `;
        listElement.appendChild(itemElement);
    });
}

// ---------------------- Country & Culture Info Form - Save Logic (NEW) ----------------------
const STORAGE_KEY_COUNTRY = 'cms_country_info_list';

// Bind form submit event on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('add-country.html')) {
        const countryForm = document.getElementById('add-country-form');
        if (countryForm) {
            countryForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveCountryCultureInfo();
            });
        }
    }
});

// Save all country & culture info to local storage
function saveCountryCultureInfo() {
    // Get all form field values (match with add-country.html IDs)
    const countryCultureData = {
        // Core Country Info
        countryName: document.getElementById('country-name').value.trim(),
        specificRegion: document.getElementById('specific-region').value.trim(),
        countryBriefDesc: document.getElementById('country-brief-desc').value.trim(),
        languages: document.getElementById('languages').value.trim(),
        population: document.getElementById('population').value.trim(),
        currency: document.getElementById('currency').value.trim(),
        governmentType: document.getElementById('gov-type').value.trim(),

        // A. Background & Location
        geoLocation: document.getElementById('geo-location').value.trim(),
        geoFeatures: document.getElementById('geo-features').value.trim(),
        climate: document.getElementById('climate').value.trim(),
        majorHistoricalElements: document.getElementById('major-historical-elements').value.trim(),
        majorCities: document.getElementById('major-cities').value.trim(),

        // B. Core Cultural Values & Beliefs
        topCulturalValues: document.getElementById('top-cultural-values').value.trim(),
        commonReligiousViews: document.getElementById('common-religious-views').value.trim(),
        culturalMisunderstandings: document.getElementById('cultural-misunderstandings').value.trim(),

        // C. Daily Life & Society
        normalDailyLife: document.getElementById('normal-daily-life').value.trim(),
        familyGatheringsMeals: document.getElementById('family-gatherings-meals').value.trim(),
        transportationNorms: document.getElementById('transportation-norms').value.trim(),
        geoClimateDailyLife: document.getElementById('geo-climate-daily-life').value.trim(),
        traditionalClothing: document.getElementById('traditional-clothing').value.trim(),

        // D. Greetings, Manners & Social Etiquette
        standardGreetings: document.getElementById('standard-greetings').value.trim(),
        publicGoodManners: document.getElementById('public-good-manners').value.trim(),
        culturalDosDonts: document.getElementById('cultural-dos-donts').value.trim(),
        conversationTaboos: document.getElementById('conversation-taboos').value.trim(),

        // E. Food & Traditions
        commonDishes: document.getElementById('common-dishes').value.trim(),
        uniqueTraditions: document.getElementById('unique-traditions').value.trim(),

        // F. Practical Travel Considerations
        uniqueLocalLaws: document.getElementById('unique-local-laws').value.trim(),
        safetyConcernsForeigners: document.getElementById('safety-concerns-foreigners').value.trim(),
        emergencyServices: document.getElementById('emergency-services').value.trim(),

        // G. Language & Slang
        commonSlang: document.getElementById('common-slang').value.trim(),
        visitorCommonPhrases: document.getElementById('visitor-common-phrases').value.trim(),

        // H. Cultural Adjustment Experience (BYUI/Mission)
        culturalDifferencesNoticed: document.getElementById('cultural-differences-noticed').value.trim(),
        mostShockingCultural: document.getElementById('most-shocking-cultural').value.trim(),
        hardestCulturalAdjustment: document.getElementById('hardest-cultural-adjustment').value.trim(),
        normalHomeCultureHere: document.getElementById('normal-home-culture-here').value.trim(),

        // I. Reflection & Advice
        firstTimeCultureAdvice: document.getElementById('first-time-culture-advice').value.trim(),
        newCulturePrepInfo: document.getElementById('new-culture-prep-info').value.trim(),
        untalkedCultureFact: document.getElementById('untalked-culture-fact').value.trim(),

        // J. Follow-Up & Contact Info
        willingToBeContacted: document.querySelector('input[name="contact-willing"]:checked').value,
        contactInformation: document.getElementById('contact-information') ? document.getElementById('contact-information').value.trim() : '',
        knowOtherWillingPeople: document.querySelector('input[name="other-people"]:checked').value,

        // Meta Info
        createTime: new Date().toLocaleString()
    };

    // Get existing country info list from local storage
    const countryList = JSON.parse(localStorage.getItem(STORAGE_KEY_COUNTRY)) || [];
    // Add new info to the top of the list
    countryList.unshift(countryCultureData);
    // Save updated list to local storage
    localStorage.setItem(STORAGE_KEY_COUNTRY, JSON.stringify(countryList));

    // Success alert and redirect to CMS homepage
    alert('Country & Culture Information saved successfully!');
    window.location.href = 'index.html';
}