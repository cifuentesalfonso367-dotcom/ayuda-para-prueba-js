import { LoginView } from "./views/login.js";
import { RegisterView } from "./views/register.js";
import { MenuView } from "./views/menu.js";
import { ProfileView } from "./views/profile.js";
import { HeaderComponent } from "./components/Header.js";

export default function initRouter(root) {
    const routes = {
        "": () => LoginView(),
        "#login": () => LoginView(),
        "#register": () => RegisterView(),
        "#dashboard": () => MenuView(),
        "#menu": () => MenuView(),
        "#profile": () => ProfileView(),
    };

    function render() {
        const hash = window.location.hash || "#login";

        // Simple guard: dashboard/menu/profile require a logged user
        const user = localStorage.getItem('user');
        if ((hash === '#dashboard' || hash === '#menu' || hash === '#profile') && !user) {
            window.location.hash = '#login';
            return;
        }

        // If user is already logged in, don't show login/register pages
        if (user && (hash === '#login' || hash === '' || hash === '#register')) {
            window.location.hash = '#dashboard';
            return;
        }
        const viewFn = routes[hash] || routes['#login'];
        root.innerHTML = '';

        // Render header for SPA pages (login/register still show header with login/register links)
        const header = HeaderComponent();
        root.appendChild(header);

        root.appendChild(viewFn());
    }

    window.addEventListener('hashchange', render);
    window.addEventListener('load', render);

    // If document already loaded, render immediately
    if (document.readyState === 'complete') render();
}
