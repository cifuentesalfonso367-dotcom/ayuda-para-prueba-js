import JsonService from "../services/jsonService.js";

export function ProfileView() {
    const main = document.createElement('main');
    main.classList.add('container');

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
        window.location.hash = '#login';
        return main;
    }

    const header = document.createElement('div');
    header.classList.add('section-header');
    header.innerHTML = `<h1 class="page-title">Profile</h1>`;

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role || 'user'}</p>
        <h3>Your Orders</h3>
        <div class="orders-list">Loading orders...</div>
    `;

    main.appendChild(header);
    main.appendChild(card);

    JsonService.getOrders().then(res => {
        const container = card.querySelector('.orders-list');
        if (!res.success) {
            container.textContent = 'Error loading orders';
            return;
        }

        const orders = res.orders || [];
        if (orders.length === 0) {
            container.textContent = 'You have no orders yet.';
            return;
        }

        container.innerHTML = '';
        orders.forEach(o => {
            const oEl = document.createElement('div');
            oEl.classList.add('order-item');
            oEl.innerHTML = `<p><strong>Order:</strong> ${o.id || '—'} — <strong>Total:</strong> $${o.total.toFixed(2)} — <small>${new Date(o.createdAt).toLocaleString()}</small></p>`;
            container.appendChild(oEl);
        });
    }).catch(() => {
        const container = card.querySelector('.orders-list');
        container.textContent = 'Error loading orders';
    });

    return main;
}