/**
 * Blog Loader for Bhavya Portfolio
 * Handles fetching, parsing, and rendering Markdown-based blogs.
 */

// Configuration
const isSubPage = window.location.pathname.includes('/pages/');
const BLOGS_DIR = isSubPage ? '../blogs/' : 'blogs/';
const MANIFEST_URL = BLOGS_DIR + 'manifest.json';

// Helper to parse Frontmatter
function parseFrontmatter(mdContent) {
    const fmRegex = /^---([\s\S]*?)---/;
    const match = mdContent.match(fmRegex);
    if (!match) return { attributes: {}, body: mdContent };

    const fmText = match[1];
    const body = mdContent.replace(fmRegex, '').trim();
    const attributes = {};

    fmText.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            
            // Handle tags array
            if (key === 'tags') {
                value = value.replace('[', '').replace(']', '').split(',').map(t => t.trim().replace(/['"]/g, ''));
            }
            // Handle boolean
            if (value === 'true') value = true;
            if (value === 'false') value = false;

            attributes[key] = value;
        }
    });

    return { attributes, body };
}

// Fetch all blogs
async function fetchBlogs() {
    try {
        const response = await fetch(MANIFEST_URL);
        const filenames = await response.json();
        
        const blogPromises = filenames.map(async (filename) => {
            const res = await fetch(BLOGS_DIR + filename);
            const text = await res.text();
            const { attributes, body } = parseFrontmatter(text);
            return { ...attributes, body, filename };
        });

        const blogs = await Promise.all(blogPromises);
        // Sort by date newest first
        return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        console.error("Error loading blogs:", err);
        return [];
    }
}

// Render Blog Cards
async function renderBlogCards() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    const blogs = await fetchBlogs();
    
    // Filter out the featured Death Note blog to avoid duplication in the grid
    const futureBlogs = blogs.filter(blog => blog.slug !== 'death-note-ryuzaki');
    
    futureBlogs.forEach(blog => {
        const card = document.createElement('article');
        card.className = 'blog-card reveal show';
        if (blog.featured) card.classList.add('featured');
        card.setAttribute('data-category', blog.category.toLowerCase().replace(/\s+/g, '-'));

        const detailPath = isSubPage ? 'blog-detail.html' : 'pages/blog-detail.html';

        card.innerHTML = `
            <div class="blog-content">
                ${blog.featured ? '<span class="featured-badge">Featured</span>' : ''}
                <span class="blog-tag">${blog.category}</span>
                <span class="blog-date">${blog.date}</span>
                <h3>${blog.title}</h3>
                <p>${blog.excerpt}</p>
                <div class="blog-tags">
                    ${blog.tags ? blog.tags.map(t => `<span class="mini-tag">#${t}</span>`).join('') : ''}
                </div>
                <a href="${detailPath}?slug=${blog.slug}" class="read-more-btn">Read More &rarr;</a>
            </div>
        `;
        grid.prepend(card); // Newest first
    });
}

// Render Blog Detail
async function renderBlogDetail() {
    const detailContainer = document.getElementById('blogDetailContent');
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (!slug) {
        window.location.href = '/pages/blogs.html';
        return;
    }

    const blogs = await fetchBlogs();
    const blog = blogs.find(b => b.slug === slug);

    if (!blog) {
        detailContainer.innerHTML = '<h2>Blog not found</h2>';
        return;
    }

    // Set page title
    document.title = `${blog.title} | Bhavya Patela`;

    detailContainer.innerHTML = `
        <div class="blog-detail-header reveal show">
            <span class="blog-tag">${blog.category}</span>
            <h1>${blog.title}</h1>
            <div class="blog-meta">
                <span>${blog.date}</span> &bull; <span>${blog.tags.join(', ')}</span>
            </div>
            ${blog.cover ? `<img src="${blog.cover}" alt="${blog.title}" class="blog-cover-img">` : ''}
        </div>
        <div class="blog-detail-body reveal show">
            ${marked.parse(blog.body)}
        </div>
        <div class="blog-detail-footer reveal show">
            <a href="blogs.html" class="btn btn-outline">&larr; Back to Blogs</a>
        </div>
    `;
}

// Home Page Notification (Premium Toast)
function showNewBlogNotification() {
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('index.html');
    if (!isHomePage) return;

    // Hardcoded notification for the featured blog
    const toast = document.createElement('div');
    toast.className = 'blog-toast';
    const detailPath = isSubPage ? 'why-l-had-to-die.html' : 'pages/why-l-had-to-die.html';

    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-badge">New Blog</span>
            <button class="toast-close" id="closeToast">&times;</button>
        </div>
        <div class="toast-body">
            <h4 class="toast-title">Building Urban Intelligence System — A Smart City AI Platform</h4>
        </div>
        <div class="toast-actions">
            <a href="pages/urban-intelligence-system.html" class="toast-btn">Read Now &rarr;</a>
        </div>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => toast.classList.add('show'), 300);

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
        closeToast(toast);
    }, 10000);

    document.getElementById('closeToast').addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(timer);
        closeToast(toast);
    });

    toast.addEventListener('click', (e) => {
        if (e.target.id === 'closeToast') return;
        window.location.href = detailPath;
    });
}

function closeToast(el) {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 600);
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogGrid')) {
        renderBlogCards();
    }
    if (document.getElementById('blogDetailContent')) {
        renderBlogDetail();
    }
    showNewBlogNotification();
});
