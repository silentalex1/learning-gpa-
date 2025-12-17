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

        if (index >= 0 && index < sections.length) {
            sections[index].classList.add('active');
            menuItems[index].classList.add('active');
            
            const target = menuItems[index].getAttribute('data-target');

            if (target === 'math') {
                mathSubMenu.classList.remove('hidden');
                history.pushState({}, "", "#math1");
            } else {
                mathSubMenu.classList.add('hidden');
                history.pushState({}, "", "#" + target);
            }

            currentIndex = index;

            if (currentIndex === sections.length - 1) {
                nextPageBtn.style.display = 'none';
            } else {
                nextPageBtn.style.display = 'inline-block';
            }
        }
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
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

    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash === '#math1') {
            const mathIndex = Array.from(menuItems).findIndex(item => item.getAttribute('data-target') === 'math');
            if (mathIndex !== -1) showSection(mathIndex);
        } else if (hash) {
            const target = hash.substring(1);
            const index = Array.from(menuItems).findIndex(item => item.getAttribute('data-target') === target);
            if (index !== -1) showSection(index);
        }
    }

    handleInitialHash();

});
