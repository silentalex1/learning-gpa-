document.addEventListener('DOMContentLoaded', () => {
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

    let currentSubject = 'Geometry';
    let isSignedIn = false;

    const checkAuthStatus = async () => {
        if (puter.auth.isSignedIn()) {
            const user = await puter.auth.getUser();
            handleLoginSuccess(user);
        }
    };

    loginBtn.addEventListener('click', async () => {
        try {
            const user = await puter.auth.signIn();
            handleLoginSuccess(user);
        } catch (error) {
            alert("Authentication failed.");
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
        chatHistory.innerHTML = '';
    }

    classDropdown.addEventListener('change', (e) => {
        if (e.target.value === 'add_new_class_trigger') {
            modal.classList.remove('hidden');
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
            const newOption = document.createElement('option');
            newOption.value = newClass;
            newOption.textContent = newClass;
            classDropdown.insertBefore(newOption, classDropdown.lastElementChild);
            classDropdown.value = newClass;
            currentSubject = newClass;
            currentSubjectSpan.textContent = currentSubject;
            modal.classList.add('hidden');
            newClassNameInput.value = '';
            addSystemMessage(`Class "${newClass}" added.`);
        }
    });

    async function sendToAI(text) {
        if (!isSignedIn) {
            addSystemMessage("Please login to use the AI features.");
            return;
        }

        addMessage(text, 'user-message');
        userInput.value = '';

        const systemInstruction = `You are a helpful tutor specializing in ${currentSubject}. 
        If the user asks to graph a math function, strictly output the function in this format: [[GRAPH:fn=x^2]] (replace x^2 with the requested function).
        If the user asks for a crossword, provide a text-based crossword representation using code blocks.
        For ${currentSubject}, be precise and helpful.`;

        addMessage("Thinking...", 'ai-message', 'loading-msg');

        try {
            const response = await puter.ai.chat(text, {
                model: 'claude-3-5-sonnet',
                system: systemInstruction
            });

            const loading = document.querySelector('.loading-msg');
            if(loading) loading.remove();

            const messageContent = response.message || response;
            processAIResponse(messageContent);

        } catch (err) {
            const loading = document.querySelector('.loading-msg');
            if(loading) loading.remove();
            addSystemMessage("Error connecting to AI.");
        }
    }

    function processAIResponse(text) {
        const graphMatch = text.match(/\[\[GRAPH:fn=(.*?)\]\]/);
        
        if (graphMatch) {
            const formula = graphMatch[1];
            addMessage(`Graphing function: ${formula}`, 'ai-message');
            renderGraph(formula);
            text = text.replace(/\[\[GRAPH:fn=.*?\]\]/, '');
            if(text.trim()) addMessage(text, 'ai-message');
        } else {
            addMessage(text, 'ai-message');
        }
    }

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
            document.getElementById('graphTarget').innerHTML = "Could not render graph.";
        }
    }

    closeGraphBtn.addEventListener('click', () => {
        graphContainer.classList.add('hidden');
    });

    function addMessage(text, className, id = null) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        if(id) div.classList.add(id);
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

    checkAuthStatus();
});