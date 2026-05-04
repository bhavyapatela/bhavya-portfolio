document.addEventListener('DOMContentLoaded', () => {
    // --- Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'block';
                    // Trigger reflow for animation if needed
                    void card.offsetWidth;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // --- Modal Close on Outside Click ---
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// --- Modal Logic ---
function openModal(title) {
    const modal = document.getElementById('blogModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalCategory = document.getElementById('modalCategory');

    if (!modal || !modalTitle) return;

    // Set title
    modalTitle.textContent = title;

    // Find the corresponding card to extract category and date
    const cards = document.querySelectorAll('.blog-card');
    for (let card of cards) {
        const cardTitle = card.querySelector('h3').textContent;
        if (cardTitle === title) {
            modalDate.textContent = card.querySelector('.blog-date').textContent;
            modalCategory.textContent = card.querySelector('.blog-tag').textContent;
            break;
        }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }
}
