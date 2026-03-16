(function() {
    const container = document.getElementById('agent-container');
    const landscape = document.getElementById('landscape');
    const addButton = document.getElementById('add-agent');

    const agents = [];

    function createAgent() {
        const agentEl = document.createElement('div');
        agentEl.className = 'agent';
        
        const statusEl = document.createElement('div');
        statusEl.className = 'status-bubble';
        statusEl.innerText = 'Idle';
        
        agentEl.appendChild(statusEl);
        
        const x = Math.random() * (landscape.clientWidth - 32);
        const y = Math.random() * (landscape.clientHeight - 32);
        
        agentEl.style.left = `${x}px`;
        agentEl.style.top = `${y}px`;
        
        container.appendChild(agentEl);

        const agent = {
            element: agentEl,
            status: statusEl,
            x: x,
            y: y,
            targetX: x,
            targetY: y,
            moving: false
        };

        agents.push(agent);
        moveAgent(agent);
    }

    function moveAgent(agent) {
        if (!agent.moving) {
            agent.moving = true;
            agent.status.innerText = 'Exploring...';
            
            const wander = () => {
                agent.targetX = Math.max(0, Math.min(landscape.clientWidth - 32, agent.x + (Math.random() - 0.5) * 100));
                agent.targetY = Math.max(0, Math.min(landscape.clientHeight - 32, agent.y + (Math.random() - 0.5) * 100));
                
                agent.x = agent.targetX;
                agent.y = agent.targetY;
                
                agent.element.style.left = `${agent.x}px`;
                agent.element.style.top = `${agent.y}px`;
                
                setTimeout(wander, 2000 + Math.random() * 3000);
            };
            
            wander();
        }
    }

    addButton.addEventListener('click', () => {
        createAgent();
    });

    // Start with three agents
    for (let i = 0; i < 3; i++) {
        createAgent();
    }

    // Handle messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'task':
                const agent = agents[message.agentId % agents.length];
                if (agent) {
                    showTask(agent, message.text);
                }
                break;
        }
    });

    function showTask(agent, taskText) {
        agent.status.innerText = taskText;
        agent.status.style.opacity = '1';
        agent.element.classList.add('working');
        
        setTimeout(() => {
            agent.status.innerText = 'Idle';
            agent.status.style.opacity = '0';
            agent.element.classList.remove('working');
        }, 3000);
    }
})();
