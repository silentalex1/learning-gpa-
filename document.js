document.addEventListener('DOMContentLoaded', () => {
    
    const goBackBtn = document.getElementById('goBackBtn');
    const menuItems = document.querySelectorAll('.doc-sidebar li');
    const sections = document.querySelectorAll('.doc-section');
    const nextPageBtn = document.getElementById('nextPageBtn');

    let currentIndex = 0;

    goBackBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

    function showSection(index) {
        sections.forEach(s => s.classList.remove('active'));
        menuItems.forEach(m => m.classList.remove('active'));

        sections[index].classList.add('active');
        menuItems[index].classList.add('active');
        
        currentIndex = index;

        // Hide next button on last page
        if (currentIndex === sections.length - 1) {
            nextPageBtn.style.display = 'none';
        } else {
            nextPageBtn.style.display = 'inline-block';
        }
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
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
