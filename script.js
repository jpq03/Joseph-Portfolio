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

// Responses
const botResponses = {
    "hello": "Hello! I'm Joseph's virtual assistant. How can I help you?",
    "hi": "Hi there! Feel free to ask me about Joseph's skills, projects, or contact info.",
    "skills": "Joseph is skilled in UI/UX Design, User Research, Wireframing, Prototyping, and uses tools like Figma, Adobe XD, and HTML/CSS.",
    "projects": "Joseph has worked on exciting projects like EcoTrade, Dealogikal, and Knottical Power Energy. You can check them out in the Projects section!",
    "contact": "You can email Joseph at Quisidojoseph23@gmail.com or call him at 09956705968.",
    "experience": "Joseph has over 1 year of experience in digital product design.",
    "resume": "You can view my background in the 'About' section, or contact me directly for a full PDF resume!",
    "hobbies": "Outside of design, Joseph enjoys photography, digital art, and exploring the latest trends in technology and product design.",
    "available": "I am currently open to new opportunities and freelance projects! Use the contact form to reach out.",
    "process": "My design process follows: Research ➔ Wireframing ➔ Prototyping ➔ Testing ➔ Final Design.",
    "figma": "Figma is my primary tool for UI design and prototyping, but I'm also proficient in Adobe XD and Sketch.",
    "education": "Joseph graduated from the University Of Cebu Lapu Lapu and Mandaue.",
    "university": "Joseph is a proud graduate of the University Of Cebu Lapu Lapu and Mandaue (UCLM).",
    "default": "I'm not sure about that. Try asking about my skills, projects, contact info, or my design process!"
};

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

function handleSend(overrideText) {
    const text = typeof overrideText === 'string' ? overrideText : chatbotInput.value.trim();
    if (text) {
        if (typeof overrideText !== 'string') {
            addMessage(text, 'user');
            chatbotInput.value = '';
        } else {
            addMessage(text, 'user');
        }

        const indicator = showTypingIndicator();

        // Bot thinking delay
        setTimeout(() => {
            indicator.remove();
            const lowerText = text.toLowerCase();
            let response = botResponses["default"];

            for (const key in botResponses) {
                if (lowerText.includes(key)) {
                    response = botResponses[key];
                    break;
                }
            }
            addMessage(response, 'bot');
        }, 1000);
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

document.querySelectorAll('a, button, .project-card, .theme-switch, .suggestion-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

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

// Project Modals Content
const projectData = {
    "EcoTrade: Digital Barter Platform": {
        title: "EcoTrade Platform",
        problem: "Waste and lack of monetary resources in local communities.",
        solution: "A digital barter system using non-monetary exchanges.",
        tools: ["Figma", "React", "Node.js"],
        description: "This project focused on creating a sustainable trading ecosystem for residents in Cebu."
    },
    "Dealogikal": {
        title: "Dealogikal Marketplace",
        problem: "Opaque and inefficient procurement processes in supply chains.",
        solution: "Automated competitive online marketplace for transparent bidding.",
        tools: ["UI Design", "Information Architecture", "Prototyping"],
        description: "Streamlining how businesses source products through automation and transparency."
    },
    "Knottical Power Energy": {
        title: "Knottical Dashboard",
        problem: "Complex financial document management in fuel distribution.",
        solution: "AI-integrated dashboard for real-time document intelligence.",
        tools: ["Dashboard UI", "AI APIs", "Web App Dev"],
        description: "Modernizing financial workflows for the energy sector with a clean, data-driven flow."
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
                <div>
                    <h4>The Problem</h4>
                    <p>${data.problem}</p>
                    <br>
                    <h4>The Solution</h4>
                    <p>${data.solution}</p>
                </div>
                <div>
                    <h4>Key Tools</h4>
                    <div class="project-tags">
                        ${data.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                    </div>
                    <br>
                    <h4>Overview</h4>
                    <p>${data.description}</p>
                </div>
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