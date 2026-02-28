/* ============================================
   Prismlytics — Full-Featured Interactive JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. LOADING SCREEN
    // =====================================
    const loader = document.getElementById('loader');
    setTimeout(() => { loader.classList.add('hidden'); }, 1800);

    // =====================================
    // 2. PARTICLE BACKGROUND (Canvas)
    // =====================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animationFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =====================================
    // 3. THEME TOGGLE
    // =====================================
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('prismlytics-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('prismlytics-theme', next);
        showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });

    // =====================================
    // 4. NAVBAR
    // =====================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('.section, .hero');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                allNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => navObserver.observe(s));

    // =====================================
    // 5. SMOOTH SCROLL
    // =====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =====================================
    // 6. BACK TO TOP
    // =====================================
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =====================================
    // 7. ANIMATED BAR CHART (Hero)
    // =====================================
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, i) => {
        const height = bar.getAttribute('data-height');
        bar.style.setProperty('--delay', `${i * 0.15}s`);
        bar.style.height = `${height}%`;
    });

    // =====================================
    // 8. COUNTER ANIMATION
    // =====================================
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            if (target >= 1000000) el.textContent = (current / 1000000).toFixed(1) + 'M+';
            else if (target >= 1000) el.textContent = (current / 1000).toFixed(1) + 'K+';
            else el.textContent = current + (el.closest('.hero-stat') ? '' : '+');
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // =====================================
    // 9. SCROLL REVEAL
    // =====================================
    const revealElements = document.querySelectorAll(
        '.about-card, .feature-card, .tech-card, .kpi-card, .chart-panel, .data-table-panel, .team-card, .code-window, .contact-form, .info-card, .newsletter-card'
    );
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                const counter = entry.target.querySelector('[data-count]');
                if (counter && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter);
                }
                const barFill = entry.target.querySelector('.tech-bar-fill');
                if (barFill && !barFill.classList.contains('filled')) {
                    barFill.classList.add('filled');
                    barFill.style.width = barFill.getAttribute('data-width') + '%';
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

    // Hero counters
    const heroStatValues = document.querySelectorAll('.hero-stat-value[data-count]');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroStatValues.forEach(el => {
                    if (!el.classList.contains('counted')) {
                        el.classList.add('counted');
                        animateCounter(el);
                    }
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // Timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    timelineItems.forEach(item => timelineObserver.observe(item));

    // =====================================
    // 10. FEATURE FILTER TABS
    // =====================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            featureCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('filtered-out');
                    card.style.animation = 'fadeInDown 0.4s ease forwards';
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });

    // =====================================
    // 11. LINE CHART (Canvas)
    // =====================================
    const lineCanvas = document.getElementById('line-chart');
    const lineCtx = lineCanvas ? lineCanvas.getContext('2d') : null;

    const chartData = {
        revenue: [30, 45, 55, 40, 65, 80, 70, 90, 85, 110, 95, 120],
        users: [10, 18, 25, 22, 35, 42, 38, 50, 55, 60, 65, 75],
        orders: [5, 12, 18, 15, 28, 35, 30, 40, 45, 50, 48, 58]
    };
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let currentChart = 'revenue';

    function drawLineChart(data, color = '#6c5ce7') {
        if (!lineCtx) return;
        const W = lineCanvas.width;
        const H = lineCanvas.height;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;
        const max = Math.max(...data) * 1.15;

        lineCtx.clearRect(0, 0, W, H);

        // Grid lines
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
        const textColor = isDark ? '#55557a' : '#888899';
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            lineCtx.beginPath();
            lineCtx.moveTo(padding.left, y);
            lineCtx.lineTo(W - padding.right, y);
            lineCtx.strokeStyle = gridColor;
            lineCtx.lineWidth = 1;
            lineCtx.stroke();
            lineCtx.fillStyle = textColor;
            lineCtx.font = '11px Inter, sans-serif';
            lineCtx.textAlign = 'right';
            lineCtx.fillText(Math.round(max - (max / 4) * i), padding.left - 10, y + 4);
        }

        // X labels
        lineCtx.textAlign = 'center';
        data.forEach((_, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            lineCtx.fillStyle = textColor;
            lineCtx.fillText(months[i], x, H - 10);
        });

        // Gradient fill
        const gradient = lineCtx.createLinearGradient(0, padding.top, 0, H - padding.bottom);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');

        lineCtx.beginPath();
        data.forEach((val, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            const y = padding.top + chartH - (val / max) * chartH;
            if (i === 0) lineCtx.moveTo(x, y);
            else lineCtx.lineTo(x, y);
        });
        lineCtx.lineTo(padding.left + chartW, padding.top + chartH);
        lineCtx.lineTo(padding.left, padding.top + chartH);
        lineCtx.closePath();
        lineCtx.fillStyle = gradient;
        lineCtx.fill();

        // Line
        lineCtx.beginPath();
        data.forEach((val, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            const y = padding.top + chartH - (val / max) * chartH;
            if (i === 0) lineCtx.moveTo(x, y);
            else lineCtx.lineTo(x, y);
        });
        lineCtx.strokeStyle = color;
        lineCtx.lineWidth = 2.5;
        lineCtx.lineJoin = 'round';
        lineCtx.stroke();

        // Dots
        data.forEach((val, i) => {
            const x = padding.left + (chartW / (data.length - 1)) * i;
            const y = padding.top + chartH - (val / max) * chartH;
            lineCtx.beginPath();
            lineCtx.arc(x, y, 4, 0, Math.PI * 2);
            lineCtx.fillStyle = color;
            lineCtx.fill();
            lineCtx.beginPath();
            lineCtx.arc(x, y, 2, 0, Math.PI * 2);
            lineCtx.fillStyle = isDark ? '#0a0a1a' : '#f0f2f8';
            lineCtx.fill();
        });
    }

    const chartColors = { revenue: '#6c5ce7', users: '#00cec9', orders: '#e17055' };
    drawLineChart(chartData[currentChart], chartColors[currentChart]);

    document.querySelectorAll('.chart-ctrl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-ctrl-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChart = btn.getAttribute('data-chart');
            drawLineChart(chartData[currentChart], chartColors[currentChart]);
        });
    });

    // Redraw on theme change
    const themeObserver = new MutationObserver(() => {
        drawLineChart(chartData[currentChart], chartColors[currentChart]);
        drawDonutChart();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // =====================================
    // 12. DONUT CHART (Canvas)
    // =====================================
    const donutCanvas = document.getElementById('donut-chart');
    const donutCtx = donutCanvas ? donutCanvas.getContext('2d') : null;
    const donutData = [
        { label: 'CSV Files', value: 35, color: '#6c5ce7' },
        { label: 'SQL Database', value: 25, color: '#00cec9' },
        { label: 'API', value: 20, color: '#e17055' },
        { label: 'Excel', value: 12, color: '#fdcb6e' },
        { label: 'Other', value: 8, color: '#a29bfe' }
    ];

    function drawDonutChart() {
        if (!donutCtx) return;
        const W = donutCanvas.width;
        const H = donutCanvas.height;
        const cx = W / 2;
        const cy = H / 2;
        const outerR = Math.min(W, H) / 2 - 20;
        const innerR = outerR * 0.6;
        const total = donutData.reduce((s, d) => s + d.value, 0);
        let startAngle = -Math.PI / 2;

        donutCtx.clearRect(0, 0, W, H);

        donutData.forEach(d => {
            const sliceAngle = (d.value / total) * Math.PI * 2;
            donutCtx.beginPath();
            donutCtx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
            donutCtx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
            donutCtx.closePath();
            donutCtx.fillStyle = d.color;
            donutCtx.fill();
            startAngle += sliceAngle;
        });

        // Center text
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        donutCtx.fillStyle = isDark ? '#e4e4f0' : '#1a1a2e';
        donutCtx.font = 'bold 24px Inter, sans-serif';
        donutCtx.textAlign = 'center';
        donutCtx.textBaseline = 'middle';
        donutCtx.fillText('100%', cx, cy - 8);
        donutCtx.fillStyle = isDark ? '#55557a' : '#888899';
        donutCtx.font = '12px Inter, sans-serif';
        donutCtx.fillText('Coverage', cx, cy + 14);
    }
    drawDonutChart();

    // Legend
    const legendEl = document.getElementById('donut-legend');
    if (legendEl) {
        donutData.forEach(d => {
            legendEl.innerHTML += `<div class="donut-legend-item"><span class="donut-legend-color" style="background:${d.color}"></span>${d.label} (${d.value}%)</div>`;
        });
    }

    // =====================================
    // 13. DATA TABLE (Sortable, Searchable, Paginated)
    // =====================================
    const tableData = [
        { name: 'Sales Analysis Q4', rows: 245000, accuracy: 97.2, status: 'completed' },
        { name: 'Customer Segmentation', rows: 180500, accuracy: 94.8, status: 'completed' },
        { name: 'Revenue Forecasting', rows: 320100, accuracy: 91.5, status: 'running' },
        { name: 'Churn Prediction', rows: 156000, accuracy: 89.3, status: 'completed' },
        { name: 'Sentiment Analysis', rows: 92400, accuracy: 86.7, status: 'failed' },
        { name: 'Supply Chain Optimization', rows: 410000, accuracy: 95.1, status: 'completed' },
        { name: 'Fraud Detection', rows: 520000, accuracy: 98.4, status: 'running' },
        { name: 'Market Basket Analysis', rows: 78000, accuracy: 92.0, status: 'completed' },
        { name: 'Price Elasticity Study', rows: 65000, accuracy: 88.9, status: 'completed' },
        { name: 'User Behavior Tracking', rows: 290000, accuracy: 93.6, status: 'running' },
        { name: 'Inventory Forecasting', rows: 175000, accuracy: 90.2, status: 'completed' },
        { name: 'Social Media Analytics', rows: 430000, accuracy: 87.5, status: 'failed' }
    ];

    let sortKey = null;
    let sortAsc = true;
    let searchTerm = '';
    let currentPage = 1;
    const rowsPerPage = 5;

    function getFilteredData() {
        let data = [...tableData];
        if (searchTerm) {
            data = data.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (sortKey) {
            data.sort((a, b) => {
                let va = a[sortKey], vb = b[sortKey];
                if (typeof va === 'string') va = va.toLowerCase();
                if (typeof vb === 'string') vb = vb.toLowerCase();
                if (va < vb) return sortAsc ? -1 : 1;
                if (va > vb) return sortAsc ? 1 : -1;
                return 0;
            });
        }
        return data;
    }

    function renderTable() {
        const tbody = document.getElementById('table-body');
        const data = getFilteredData();
        const totalPages = Math.ceil(data.length / rowsPerPage);
        if (currentPage > totalPages) currentPage = totalPages || 1;
        const start = (currentPage - 1) * rowsPerPage;
        const pageData = data.slice(start, start + rowsPerPage);

        tbody.innerHTML = pageData.map(d => `
            <tr>
                <td style="font-weight:600; color: var(--color-text)">${d.name}</td>
                <td>${d.rows.toLocaleString()}</td>
                <td>${d.accuracy}%</td>
                <td><span class="status-badge ${d.status}">${d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span></td>
                <td><button class="table-action-btn" onclick="viewReport('${d.name}')">View</button></td>
            </tr>
        `).join('');

        // Pagination
        const pagDiv = document.getElementById('table-pagination');
        let pagHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pagHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        pagDiv.innerHTML = pagHTML;
        pagDiv.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.getAttribute('data-page'));
                renderTable();
            });
        });
    }

    // Table search
    const tableSearch = document.getElementById('table-search');
    if (tableSearch) {
        tableSearch.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    // Table sort
    document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.getAttribute('data-sort');
            if (sortKey === key) sortAsc = !sortAsc;
            else { sortKey = key; sortAsc = true; }
            renderTable();
        });
    });

    renderTable();

    // View report action
    window.viewReport = function (name) {
        showToast(`📊 Opening report: ${name}`);
    };

    // =====================================
    // 14. CODE PREVIEW TABS
    // =====================================
    const codeSnippets = {
        basic: {
            file: 'analysis.py',
            code: `<span class="code-comment"># Basic Data Analysis with Prismlytics</span>
<span class="code-keyword">import</span> pandas <span class="code-keyword">as</span> pd
<span class="code-keyword">import</span> matplotlib.pyplot <span class="code-keyword">as</span> plt
<span class="code-keyword">import</span> seaborn <span class="code-keyword">as</span> sns

<span class="code-comment"># Load and explore dataset</span>
df = pd.<span class="code-function">read_csv</span>(<span class="code-string">"sales_data.csv"</span>)
<span class="code-function">print</span>(df.<span class="code-function">describe</span>())
<span class="code-function">print</span>(df.<span class="code-function">info</span>())

<span class="code-comment"># Visualize revenue trends</span>
plt.<span class="code-function">figure</span>(figsize=(<span class="code-number">12</span>, <span class="code-number">6</span>))
sns.<span class="code-function">lineplot</span>(data=df, x=<span class="code-string">"date"</span>, y=<span class="code-string">"revenue"</span>)
plt.<span class="code-function">title</span>(<span class="code-string">"Revenue Over Time"</span>)
plt.<span class="code-function">savefig</span>(<span class="code-string">"output/revenue_chart.png"</span>)
plt.<span class="code-function">show</span>()`
        },
        advanced: {
            file: 'advanced_analysis.py',
            code: `<span class="code-comment"># Advanced Multi-Source Analysis</span>
<span class="code-keyword">import</span> pandas <span class="code-keyword">as</span> pd
<span class="code-keyword">import</span> numpy <span class="code-keyword">as</span> np
<span class="code-keyword">from</span> scipy <span class="code-keyword">import</span> stats

<span class="code-comment"># Load multiple datasets</span>
sales = pd.<span class="code-function">read_csv</span>(<span class="code-string">"sales.csv"</span>, parse_dates=[<span class="code-string">"date"</span>])
customers = pd.<span class="code-function">read_sql</span>(<span class="code-string">"SELECT * FROM customers"</span>, conn)

<span class="code-comment"># Merge and analyze</span>
merged = pd.<span class="code-function">merge</span>(sales, customers, on=<span class="code-string">"customer_id"</span>)
correlation = merged[[<span class="code-string">"revenue"</span>, <span class="code-string">"age"</span>]].<span class="code-function">corr</span>()

<span class="code-comment"># Hypothesis testing</span>
t_stat, p_value = stats.<span class="code-function">ttest_ind</span>(
    merged[merged[<span class="code-string">"segment"</span>] == <span class="code-string">"premium"</span>][<span class="code-string">"revenue"</span>],
    merged[merged[<span class="code-string">"segment"</span>] == <span class="code-string">"standard"</span>][<span class="code-string">"revenue"</span>]
)
<span class="code-function">print</span>(<span class="code-string">f"T-stat: <span class="code-number">{t_stat:.3f}</span>, P-value: <span class="code-number">{p_value:.4f}</span>"</span>)`
        },
        ml: {
            file: 'ml_pipeline.py',
            code: `<span class="code-comment"># Machine Learning Pipeline</span>
<span class="code-keyword">from</span> sklearn.model_selection <span class="code-keyword">import</span> train_test_split
<span class="code-keyword">from</span> sklearn.ensemble <span class="code-keyword">import</span> RandomForestClassifier
<span class="code-keyword">from</span> sklearn.metrics <span class="code-keyword">import</span> classification_report

<span class="code-comment"># Prepare features</span>
X = df.<span class="code-function">drop</span>(<span class="code-string">"target"</span>, axis=<span class="code-number">1</span>)
y = df[<span class="code-string">"target"</span>]
X_train, X_test, y_train, y_test = <span class="code-function">train_test_split</span>(
    X, y, test_size=<span class="code-number">0.2</span>, random_state=<span class="code-number">42</span>
)

<span class="code-comment"># Train model</span>
model = <span class="code-function">RandomForestClassifier</span>(n_estimators=<span class="code-number">100</span>)
model.<span class="code-function">fit</span>(X_train, y_train)

<span class="code-comment"># Evaluate</span>
predictions = model.<span class="code-function">predict</span>(X_test)
<span class="code-function">print</span>(<span class="code-function">classification_report</span>(y_test, predictions))`
        }
    };

    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const key = tab.getAttribute('data-tab');
            const snippet = codeSnippets[key];
            document.getElementById('code-filename').textContent = snippet.file;
            document.getElementById('code-content').innerHTML = snippet.code;
        });
    });

    // Copy code
    const copyBtn = document.getElementById('copy-btn');
    const copyTooltip = document.getElementById('copy-tooltip');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('code-content').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyTooltip.classList.add('show');
                setTimeout(() => copyTooltip.classList.remove('show'), 2000);
                showToast('📋 Code copied to clipboard!');
            });
        });
    }

    // =====================================
    // 15. CONTACT FORM VALIDATION
    // =====================================
    const contactForm = document.getElementById('contact-form');
    const formFields = {
        name: { el: document.getElementById('form-name'), error: document.getElementById('error-name') },
        email: { el: document.getElementById('form-email'), error: document.getElementById('error-email') },
        subject: { el: document.getElementById('form-subject'), error: document.getElementById('error-subject') },
        message: { el: document.getElementById('form-message'), error: document.getElementById('error-message') }
    };
    const submitBtn = document.getElementById('submit-btn');

    // Character count
    const charCurrent = document.getElementById('char-current');
    if (formFields.message.el) {
        formFields.message.el.addEventListener('input', () => {
            const len = formFields.message.el.value.length;
            charCurrent.textContent = len;
            if (len > 500) {
                formFields.message.el.value = formFields.message.el.value.slice(0, 500);
                charCurrent.textContent = 500;
            }
        });
    }

    // Live validation
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        if (field.el) {
            field.el.addEventListener('blur', () => validateField(key));
            field.el.addEventListener('input', () => {
                if (field.el.classList.contains('error')) validateField(key);
            });
        }
    });

    function validateField(key) {
        const f = formFields[key];
        const val = f.el.value.trim();
        let msg = '';

        if (!val) msg = 'This field is required';
        else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Please enter a valid email';
        else if (key === 'name' && val.length < 2) msg = 'Name must be at least 2 characters';
        else if (key === 'message' && val.length < 10) msg = 'Message must be at least 10 characters';

        f.error.textContent = msg;
        f.el.classList.toggle('error', !!msg);
        f.el.classList.toggle('valid', !msg && val.length > 0);
        return !msg;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            Object.keys(formFields).forEach(key => { if (!validateField(key)) valid = false; });

            if (valid) {
                submitBtn.classList.add('loading');
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    setTimeout(() => {
                        document.getElementById('form-success').classList.add('show');
                        showToast('✅ Message sent successfully!');
                    }, 500);
                }, 1500);
            } else {
                showToast('⚠️ Please fix the errors above');
            }
        });
    }

    // =====================================
    // 16. NEWSLETTER FORM
    // =====================================
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const errorNewsletter = document.getElementById('error-newsletter');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errorNewsletter.textContent = 'Please enter a valid email';
                return;
            }
            errorNewsletter.textContent = '';
            newsletterEmail.value = '';
            newsletterSuccess.classList.add('show');
            showToast('🎉 Subscribed to newsletter!');
            setTimeout(() => newsletterSuccess.classList.remove('show'), 4000);
        });
    }

    // =====================================
    // 17. TOAST NOTIFICATIONS
    // =====================================
    function showToast(message, duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // =====================================
    // 18. KEYBOARD SHORTCUTS
    // =====================================
    document.addEventListener('keydown', (e) => {
        // Ctrl+K = Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('table-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast('🔍 Search focused (Ctrl+K)');
            }
        }
        // T = Toggle theme
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'SELECT') {
            themeToggle.click();
        }
        // Escape = Close mobile nav
        if (e.key === 'Escape') {
            navLinks.classList.remove('open');
        }
    });

});
