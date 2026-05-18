// Theme Switch Logic
const themeSwitch = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form is handled by Formspree via HTML action attribute.

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        switch (e.key.toUpperCase()) {
            case 'H':
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'A':
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'P':
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'S':
                document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'C':
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// Intersection Observer for Animations (Scroll Reveal)
const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, revealObserverOptions);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// Magnetic Button Effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        btn.style.transition = 'transform 0.1s ease-out, background-color 0.3s ease, box-shadow 0.3s ease';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'all 0.3s ease';
    });
});

// Chatbot Logic
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');

// Toggle Chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Helper functions for Chatbot
function addMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.textContent = message;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatbotMessages.appendChild(indicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicator;
}

// Chatbot handleSend logic using Cloudflare Workers AI
async function handleSend(overrideText) {
    const text = typeof overrideText === 'string' ? overrideText : chatbotInput.value.trim();
    if (text) {
        if (typeof overrideText !== 'string') {
            addMessage(text, 'user');
            chatbotInput.value = '';
        } else {
            addMessage(text, 'user');
        }

        const indicator = showTypingIndicator();

        try {
            const WORKER_URL = "https://joseph.quisidojoseph24.workers.dev/";

            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error("Worker responded with an error");

            const data = await response.json();
            indicator.remove();
            addMessage(data.response || "I'm thinking, but my words got stuck. Try asking again!", 'bot');

        } catch (error) {
            console.error("AI Error:", error);
            indicator.remove();
            addMessage("I'm currently   resting my circuits. Please email Joseph directly or try again later!", 'bot');
        }
    }
}

// Suggestion Chips
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        handleSend(chip.textContent);
    });
});

chatbotSendBtn.addEventListener('click', handleSend);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor Event Delegation (works for dynamic elements like modals, filter chips, and switchers)
document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .project-card, .theme-switch, .suggestion-chip, .switcher-btn, .filter-btn');
    if (target) {
        cursorOutline.classList.add('cursor-hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }
});

document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .project-card, .theme-switch, .suggestion-chip, .switcher-btn, .filter-btn');
    if (target) {
        cursorOutline.classList.remove('cursor-hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

// Interactive Hero Mockup Switcher
const switcherBtns = document.querySelectorAll('.switcher-btn');
const heroDisplayImg = document.getElementById('hero-display-img');

if (switcherBtns.length && heroDisplayImg) {
    switcherBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('active')) return;

            switcherBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Fade and scale transition
            heroDisplayImg.style.opacity = '0.2';
            heroDisplayImg.style.transform = 'scale(0.96)';
            
            setTimeout(() => {
                heroDisplayImg.src = btn.getAttribute('data-img');
                heroDisplayImg.style.opacity = '1';
                heroDisplayImg.style.transform = 'scale(1)';
            }, 250);
        });
    });
}

// Projects Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const categoryList = categories.split(' ');

                if (filterValue === 'all' || categoryList.includes(filterValue)) {
                    card.style.display = 'block';
                    // Trigger reflow
                    card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        // Prevent hiding if user clicked another filter quickly
                        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                        if (activeFilter === filterValue || categoryList.includes(activeFilter)) return;
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Project Modals Content with Custom CTA Links
const projectData = {
    "EcoTrade: Digital Barter Platform": {
        title: "EcoTrade Platform",
        problem: "Waste and lack of monetary resources in local communities in Cebu.",
        solution: "A digital barter system using non-monetary exchanges for sustainable local trading.",
        tools: ["Figma", "React", "Node.js", "MongoDB"],
        description: "This project focused on creating a sustainable trading ecosystem for residents in Cebu, enabling them to trade direct goods and services transparently.",
        actions: [
            { text: "View Figma Case Study", url: "https://www.figma.com", icon: "figma" },
            { text: "View Repository", url: "https://github.com/jpq03/Joseph-Portfolio", icon: "github" }
        ]
    },
    "Dealogikal": {
        title: "Dealogikal Marketplace",
        problem: "Opaque and inefficient procurement processes in supply chains.",
        solution: "Automated competitive online marketplace for transparent bidding and vendor selection.",
        tools: ["UI/UX Design", "Information Architecture", "Interactive Prototyping"],
        description: "Streamlining how businesses source products through automated competition, clean documentation dashboards, and simplified approval workflows.",
        actions: [
            { text: "Explore Prototype", url: "https://www.figma.com", icon: "figma" },
            { text: "Visit Marketplace", url: "https://www.dealogikal.com", icon: "external" }
        ]
    },
    "Knottical Power Energy": {
        title: "Knottical Dashboard",
        problem: "Complex financial document management and manual invoice processing in fuel distribution.",
        solution: "AI-integrated document intelligence dashboard for real-time compliance and processing.",
        tools: ["Dashboard UI", "AI Integrations", "Data Visualization", "Figma"],
        description: "Modernizing financial workflows for the energy sector with a clean, responsive, and secure cloud dashboard that parses PDFs instantly.",
        actions: [
            { text: "Explore Dashboard Prototype", url: "https://www.figma.com", icon: "figma" },
            { text: "View Repository", url: "https://github.com/jpq03/Joseph-Portfolio", icon: "github" }
        ]
    }
};

const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectTitle = card.querySelector('h3').textContent;
        const data = projectData[projectTitle] || projectData["EcoTrade: Digital Barter Platform"];

        modalBody.innerHTML = `
            <div class="modal-header">
                <h2>${data.title}</h2>
            </div>
            <div class="modal-grid">
                <div class="modal-left">
                    <h4>The Problem</h4>
                    <p>${data.problem}</p>
                    <br>
                    <h4>The Solution</h4>
                    <p>${data.solution}</p>
                </div>
                <div class="modal-right">
                    <h4>Key Tools</h4>
                    <div class="project-tags">
                        ${data.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                    </div>
                    <br>
                    <h4>Overview</h4>
                    <p>${data.description}</p>
                </div>
            </div>
            <div class="modal-footer-actions">
                ${data.actions ? data.actions.map(act => {
                    let svgIcon = '';
                    if (act.icon === 'figma') {
                        svgIcon = `<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"></path><path d="M12 2v20"></path></svg>`;
                    } else if (act.icon === 'github') {
                        svgIcon = `<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
                    } else {
                        svgIcon = `<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
                    }
                    return `
                        <a href="${act.url}" target="_blank" class="btn btn-primary modal-action-btn">
                            ${svgIcon} ${act.text}
                        </a>
                    `;
                }).join('') : ''}
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});