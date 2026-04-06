let tasks = JSON.parse(localStorage.getItem('lunarTasks')) || [];
const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕'];

function toggleTheme() {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function addTask() {
    const input = document.getElementById('taskInput');
    const energy = document.getElementById('energyLevel').value;
    if (!input.value.trim()) return;

    tasks.push({
        text: input.value,
        energy: energy,
        completed: false,
        created: Date.now()
    });

    createEcho(input.value);
    input.value = '';
    save();
}

function createEcho(text) {
    const echo = document.createElement('div');
    echo.className = 'echo-text';
    echo.innerText = text;
    echo.style.left = '50%';
    echo.style.top = '50%';
    document.body.appendChild(echo);
    setTimeout(() => echo.remove(), 2000);
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    save();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    save();
}

function save() {
    localStorage.setItem('lunarTasks', JSON.stringify(tasks));
    render();
}

function render() {
    const list = document.getElementById('taskList');
    const shadowList = document.getElementById('shadowList');
    const shadowBox = document.getElementById('shadowBox');
    const moon = document.getElementById('lunar-orb');

    list.innerHTML = '';
    shadowList.innerHTML = '';
    let shadowCount = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.energy} ${task.text}</span>
            <button onclick="deleteTask(${index})">🗑️</button>
        `;

        // Real-world logic: Move to shadow box if older than 3 days
        const daysOld = (Date.now() - task.created) / (1000 * 60 * 60 * 24);
        if (daysOld > 3 && !task.completed) {
            shadowList.appendChild(li);
            shadowCount++;
        } else {
            list.appendChild(li);
        }
    });

    shadowBox.style.display = shadowCount > 0 ? 'block' : 'none';
    
    // Update Moon Phase based on completion %
    const done = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.floor((done / tasks.length) * 4);
    moon.innerText = moonPhases[progress];
}

render();
