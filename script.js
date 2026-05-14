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

// Contact Form Handler
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Basic validation
    if (name && email && message) {
        // You can add your form submission logic here
        alert(`Thank you ${name}! I've received your message and will get back to you soon.`);
        this.reset();
    } else {
        alert('Please fill in all fields');
    }
});

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

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
    observer.observe(el);
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
    "resume": "You can view more of his background in the 'About' section, or contact him for a full resume.",
    "default": "I'm a simple AI. I might not understand everything, but you can ask me about Joseph's skills, projects, or contact info!"
};

function addMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.textContent = message;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleSend() {
    const text = chatbotInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatbotInput.value = '';

        // Bot thinking delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = botResponses["default"];

            for (const key in botResponses) {
                if (lowerText.includes(key)) {
                    response = botResponses[key];
                    break;
                }
            }
            addMessage(response, 'bot');
        }, 600);
    }
}

chatbotSendBtn.addEventListener('click', handleSend);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

// Theme Toggle Logic
const themeSwitch = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

themeSwitch.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});