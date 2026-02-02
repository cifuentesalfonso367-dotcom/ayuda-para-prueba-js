import JsonService from "../services/jsonService.js";
import { CardComponent } from "../components/Card.js";
import { SideBardComponent } from "../components/Sidebar.js";

export function MenuView() {

    const main = document.createElement('main');
    main.classList.add('layout');

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-wrapper');
    searchWrapper.innerHTML =
            `<div class="search-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input type="search" class="search" placeholder="Search food...">
            </div>`;

    const filterGroup = document.createElement('div');
    filterGroup.classList.add('filter-group');
    filterGroup.innerHTML =
            `<button class="filter-button active" data-filter="ALL">All</button>
                <button class="filter-button" data-filter="BURGERS">
                    <svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Burgers
                </button>
                <button class="filter-button" data-filter="SIDES">
                    <svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 11L12 2L21 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 11V20C3 20.5523 3.44772 21 4 21H9V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V21H20C20.5523 21 21 20.5523 21 20V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Sides
                </button>
                <button class="filter-button" data-filter="DRINKS">
                    <svg class="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H6" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 2V11M12 11L9 8M12 11L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Drinks
                </button>
            </div>`;


    const grid = document.createElement('div');
    grid.classList.add('grid');

    // state local for view
    let allProducts = [];
    let currentFilter = 'ALL';
    let currentQuery = '';

    function renderGrid() {
        grid.innerHTML = '';
        const filtered = allProducts.filter(p => {
            const matchesFilter = currentFilter === 'ALL' || p.category === currentFilter;
            const q = currentQuery.trim().toLowerCase();
            const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
            return matchesFilter && matchesQuery;
        });

        if (filtered.length === 0) {
            grid.textContent = 'No products found.';
            return;
        }

        filtered.forEach(product => {
            const productCard = CardComponent(product);
            grid.appendChild(productCard);
        });
    }

    // fetch products once
    JsonService.getProducts().then(response => {
        if (response.success) {
            allProducts = response.products;
            renderGrid();
        } else {
            grid.textContent = 'Error loading products: ' + (response.error || 'Unknown');
        }
    }).catch(error => {
        grid.textContent = 'Error loading products: ' + error.message;
    });

    // wire up search
    searchWrapper.querySelector('.search').addEventListener('input', (e) => {
        currentQuery = e.target.value;
        renderGrid();
    });

    // wire up filters
    filterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-button');
        if (!btn) return;
        filterGroup.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'ALL';
        renderGrid();
    });

    const section = document.createElement('section');
    section.classList.add('content');
    section.innerHTML = `<h1 class="page-title">Our Menu</h1>`;
    section.appendChild(searchWrapper);
    section.appendChild(filterGroup);
    section.appendChild(grid);
    const sidebar = SideBardComponent();

    main.appendChild(section);
    main.appendChild(sidebar);

    return main;
}

// old productsRender removed and replaced by local renderGrid logic
