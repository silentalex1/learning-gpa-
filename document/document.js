document.addEventListener('DOMContentLoaded', () => {
    
    const goBackBtn = document.getElementById('goBackBtn');
    const menuItems = document.querySelectorAll('.doc-sidebar > ul > li');
    const sections = document.querySelectorAll('.doc-section');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const mathSubMenu = document.getElementById('mathSubMenu');

    let currentIndex = 0;

    goBackBtn.addEventListener('click', () => {
        window.location.href = '../index.html'; 
    });

    function showSection(index) {
        sections.forEach(s => s.classList.remove('active'));
        menuItems.forEach(m => m.classList.remove('active'));

        sections[index].classList.add('active');
        menuItems[index].classList.add('active');
        
        currentIndex = index;

        const target = menuItems[index].getAttribute('data-target');

        // Handle Math Submenu visibility and visual underline
        if (target === 'math') {
            mathSubMenu.classList.remove('hidden');
            // This line changes the URL to /document/math1 without reloading
            // You do NOT need a math1 folder. 
            history.pushState({}, "", "math1"); 
        } else {
            mathSubMenu.classList.add('hidden');
            // Reset URL to clean state
            history.pushState({}, "", window.location.pathname.replace('/math1', ''));
        }

        if (currentIndex === sections.length - 1) {
            nextPageBtn.style.display = 'none';
        } else {
            nextPageBtn.style.display = 'inline-block';
        }
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            // Prevent clicking sub-menu items from triggering section change
            if(e.target.closest('.sub-menu')) return;
            showSection(index);
        });
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentIndex < sections.length - 1) {
            showSection(currentIndex + 1);
            window.scrollTo(0, 0);
        }
    });

});
