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