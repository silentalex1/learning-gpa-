document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const usernameSpan = document.getElementById('username');
    const classDropdown = document.getElementById('classDropdown');
    const modal = document.getElementById('addClassModal');
    const closeModal = document.getElementById('closeModal');
    const submitClassBtn = document.getElementById('submitClassBtn');
    const newClassNameInput = document.getElementById('newClassName');
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const currentSubjectSpan = document.getElementById('currentSubjectSpan');
    const graphContainer = document.getElementById('graphContainer');
    const closeGraphBtn = document.getElementById('closeGraph');

    // State
    let currentSubject = 'Geometry';
    let isSignedIn = false;

    // --- Authentication (Puter.js) ---
    // Opens in a popup (standard browser behavior)
    
    const checkAuthStatus = async () => {
        if (puter.auth.isSignedIn()) {
            const user = await puter.auth.getUser();
            handleLoginSuccess(user);
        }
    };

    loginBtn.addEventListener('click', async () => {
        try {
            // Puter.auth.signIn() automatically handles the external window/popup flow
            const user = await puter.auth.signIn();
            handleLoginSuccess(user);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Authentication failed. If a popup was blocked, please allow it.");
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await puter.auth.signOut();
        handleLogout();
    });

    function handleLoginSuccess(user) {
        isSignedIn = true;
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        usernameSpan.textContent = user.username;
    }

    function handleLogout() {
        isSignedIn = false;
        loginBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
        usernameSpan.textContent = 'User';
        chatHistory.innerHTML = ''; // Clear chat on logout
    }

    // --- Dropdown & Modal Logic ---

    classDropdown.addEventListener('change', (e) => {
        if (e.target.value === 'add_new_class_trigger') {
            modal.classList.remove('hidden');
            // Reset dropdown temporarily until added
            classDropdown.value = currentSubject; 
        } else {
            currentSubject = e.target.value;
            currentSubjectSpan.textContent = currentSubject;
            addSystemMessage(`Switched subject to ${currentSubject}.`);
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    submitClassBtn.addEventListener('click', () => {
        const newClass = newClassNameInput.value.trim();
        if (newClass) {
            // Add new option before the "Add class" trigger
            const newOption = document.createElement('option');
            newOption.value = newClass;
            newOption.textContent = newClass;
            
            // Insert before the last element (which is the trigger)
            classDropdown.insertBefore(newOption, classDropdown.lastElementChild);
            
            // Select it
            classDropdown.value = newClass;
            currentSubject = newClass;
            currentSubjectSpan.textContent = currentSubject;
            
            // Close modal & Clear input
            modal.classList.add('hidden');
            newClassNameInput.value = '';
            
            addSystemMessage(`Class "${newClass}" added. I can now help you with that!`);
        }
    });

    // --- AI Logic & Custom Methods ---

    async function sendToAI(text) {
        if (!isSignedIn) {
            addSystemMessage("Please login to use the AI features.");
            return;
        }

        // Add User Message to UI
        addMessage(text, 'user-message');
        userInput.value = '';

        // Construct Prompt based on Subject
        // We instruct the AI to use specific tags for graphs/crosswords so we can parse them.
        const systemInstruction = `You are a helpful tutor specializing in ${currentSubject}. 
        If the user asks to graph a math function, strictly output the function in this format: [[GRAPH:fn=x^2]] (replace x^2 with the requested function).
        If the user asks for a crossword, provide a text-based crossword representation using code blocks.
        For ${currentSubject}, be precise and helpful.`;

        addMessage("Thinking...", 'ai-message', 'loading-msg');

        try {
            // Call Puter AI
            const response = await puter.ai.chat(text, {
                model: 'claude-3-5-sonnet', // or 'gpt-4o' if available via puter wrapper
                system: systemInstruction
            });

            // Remove loading message
            const loading = document.querySelector('.loading-msg');
            if(loading) loading.remove();

            // Process Response
            const messageContent = response.message || response; // Handle structure variations
            processAIResponse(messageContent);

        } catch (err) {
            const loading = document.querySelector('.loading-msg');
            if(loading) loading.remove();
            addSystemMessage("Error connecting to AI. Please try again.");
            console.error(err);
        }
    }

    function processAIResponse(text) {
        // 1. Check for Graphing Command [[GRAPH:fn=...]]
        const graphMatch = text.match(/\[\[GRAPH:fn=(.*?)\]\]/);
        
        if (graphMatch) {
            const formula = graphMatch[1];
            addMessage(`Graphing function: ${formula}`, 'ai-message');
            renderGraph(formula);
            // Remove the command string for display clarity if it's mixed with text
            text = text.replace(/\[\[GRAPH:fn=.*?\]\]/, '');
            if(text.trim()) addMessage(text, 'ai-message');
        } else {
            // Normal text response (includes crosswords in code blocks)
            addMessage(text, 'ai-message');
        }
    }

    // Custom Method: Render Graph using FunctionPlot
    function renderGraph(formula) {
        graphContainer.classList.remove('hidden');
        try {
            functionPlot({
                target: '#graphTarget',
                width: 500,
                height: 400,
                grid: true,
                data: [{
                    fn: formula
                }]
            });
        } catch (e) {
            console.error("Graph error", e);
            document.getElementById('graphTarget').innerHTML = "Could not render this graph syntax.";
        }
    }

    closeGraphBtn.addEventListener('click', () => {
        graphContainer.classList.add('hidden');
    });

    // Chat UI Helpers
    function addMessage(text, className, id = null) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        if(id) div.classList.add(id);
        
        // Handle code blocks or basic formatting
        // Simple replace for newlines to <br>
        div.innerHTML = text.replace(/\n/g, '<br>');
        
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addSystemMessage(text) {
        const div = document.createElement('div');
        div.className = 'message ai-message';
        div.style.fontStyle = 'italic';
        div.textContent = text;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
        const text = userInput.value.trim();
        if(text) sendToAI(text);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = userInput.value.trim();
            if(text) sendToAI(text);
        }
    });

    // Check auth on load
    checkAuthStatus();
});