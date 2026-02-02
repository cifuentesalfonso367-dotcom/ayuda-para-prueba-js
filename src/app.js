import { LoginView } from "./views/login.js";
import { RegisterView } from "./views/register.js";
import { MenuView } from "./views/menu.js";
import initRouter from "./router.js";

const app = document.getElementById('app');

initRouter(app);