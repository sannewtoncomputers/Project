document.addEventListener('DOMContentLoaded', function() {
    // ---- Mobile Menu Toggle ----
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // ---- Fetch and Render Data ----
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            renderServices(data.services);
            renderProjects(data.projects);
            renderProducts(data.products);
            renderConsultant(data.consultant);
            renderContact(data.contact);
            renderSocialLinks(data.socialMedia);
        })
        .catch(err => {
            console.error('Error loading data:', err);
            showFallbackData();
        });

    function renderServices(services) {
        const grid = document.getElementById('services-grid');
        if (!grid) return;
        grid.innerHTML = services.map(s => `
            <div class="service-card">
                <i class="fas ${s.icon || 'fa-cog'}"></i>
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
            </div>
        `).join('');
    }

    function renderProjects(projects) {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        grid.innerHTML = projects.map(p => `
            <div class="project-card">
                <i class="fas fa-check-circle" style="color:#0a1628;"></i>
                <h4>${p.title}</h4>
                <p>${p.desc}</p>
            </div>
        `).join('');
    }

    function renderProducts(products) {
        const container = document.getElementById('products-list');
        if (!container) return;
        container.innerHTML = products.map(p => 
            `<span class="product-item">${p}</span>`
        ).join('');
    }

    function renderConsultant(c) {
        const container = document.getElementById('consultant-card');
        if (!container) return;
        container.innerHTML = `
            <div class="consultant-card">
                <div class="consultant-img"><i class="fas fa-user-circle"></i></div>
                <div>
                    <h3>${c.name}</h3>
                    <p><strong>${c.title}</strong></p>
                    <p>${c.bio}</p>
                    <p style="margin-top:4px; font-size:0.85rem;">
                        <i class="fas fa-envelope"></i> ${c.email} &nbsp;·&nbsp; 
                        <i class="fas fa-phone"></i> ${c.phone}
                    </p>
                </div>
            </div>
        `;
    }

    function renderContact(c) {
        const container = document.getElementById('contact-details');
        if (!container) return;
        container.innerHTML = `
            <div><i class="fas fa-map-pin"></i> ${c.address}</div>
            <div><i class="fas fa-phone-alt"></i> ${c.phone}</div>
            <div><i class="fas fa-envelope"></i> ${c.email}</div>
            <div><i class="fas fa-clock"></i> ${c.hours}</div>
        `;
    }

    function renderSocialLinks(socials) {
        const container = document.getElementById('social-links');
        if (!container) return;
        container.innerHTML = `<h4>Connect With Us</h4> ` + 
            socials.map(s => `<a href="${s.url}" aria-label="${s.platform}"><i class="fab ${s.icon}"></i></a>`).join('');
    }

    function showFallbackData() {
        const fallbackServices = [
            { icon: "fa-laptop", title: "Computer Repair", desc: "Hardware diagnostics and repair" },
            { icon: "fa-video", title: "CCTV Installation", desc: "Security camera systems" }
        ];
        renderServices(fallbackServices);
        document.getElementById('projects-grid').innerHTML = '<p style="color:#888;">Loading projects...</p>';
        document.getElementById('products-list').innerHTML = '<span class="product-item">Loading...</span>';
    }

    // ---- Submit Ticket ----
    const submitBtn = document.getElementById('submitTicketBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const name = document.getElementById('ticketName').value.trim();
            const email = document.getElementById('ticketEmail').value.trim();
            const service = document.getElementById('ticketService').value.trim();
            const message = document.getElementById('ticketMessage').value.trim();

            if (!name || !email || !service || !message) {
                alert('⚠️ Please fill in all fields.');
                return;
            }

            try {
                const res = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, service, message })
                });
                const data = await res.json();
                if (data.success) {
                    alert('✅ Ticket submitted successfully!');
                    document.getElementById('ticketName').value = '';
                    document.getElementById('ticketEmail').value = '';
                    document.getElementById('ticketService').value = '';
                    document.getElementById('ticketMessage').value = '';
                } else {
                    alert('❌ Failed to submit ticket.');
                }
            } catch (err) {
                alert('❌ Server error. Please try again.');
            }
        });
    }

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (nav) nav.classList.remove('active');
            }
        });
    });
});