import store from "../state/store.js";

export function HeaderComponent() {
    const header = document.createElement('header');
    header.classList.add('header');

    function render() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        header.innerHTML = `
            <div class="header-content">
                <div class="brand">
                    <h1 class="title">RestorApp</h1>
                </div>
                <nav class="nav">
                    <a href="#dashboard" class="nav-link">Dashboard</a>
                    <a href="#menu" class="nav-link">Menu</a>
                    ${user ? `<a href="#profile" class="nav-link">Profile</a>` : ''}
                    ${user ? `<button class="nav-link link-button logout-inline">Logout</button>` : `<a href="#login" class="nav-link">Login</a><a href="#register" class="nav-link">Register</a>`}
                </nav>
            </div>`;

        // set active link
        const links = header.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === window.location.hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            // for buttons without href (logout), skip
        });

        // bind logout
        const logout = header.querySelector('.logout-inline');
        if (logout) {
            logout.addEventListener('click', () => {
                localStorage.removeItem('user');
                try { store.clearCart(); } catch(e) {}
                // also remove session storage key (clear completely)
                localStorage.removeItem('restautant_session');
                window.location.hash = '#login';
            });
        }
    }

    // Re-render when hash changes or storage changes (login/logout)
    window.addEventListener('hashchange', render);
    window.addEventListener('storage', render);

    render();

    return header;
}