// ===== STATE =====
const STORAGE_KEY = 'todo-app-tasks';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';

// ===== DOM REFS =====
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const itemsLeft = document.getElementById('itemsLeft');
const clearCompletedBtn = document.getElementById('clearCompleted');
const appFooter = document.getElementById('appFooter');
const statBadge = document.getElementById('statBadge');
const dateDisplay = document.getElementById('dateDisplay');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== INIT =====
function init() {
    renderDate();
    render();

    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// ===== DATE DISPLAY =====
function renderDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// ===== PERSISTENCE =====
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== ADD TASK =====
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.focus();
        // Shake animation for empty input
        const bar = document.getElementById('inputBar');
        bar.style.animation = 'none';
        bar.offsetHeight; // trigger reflow
        bar.style.animation = 'shake 0.4s ease';
        setTimeout(() => bar.style.animation = '', 400);
        return;
    }

    const task = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    tasks.unshift(task);
    save();
    render();
    taskInput.value = '';
    taskInput.focus();
}

// ===== TOGGLE TASK =====
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        save();
        render();
    }
}

// ===== DELETE TASK =====
function deleteTask(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
        el.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            save();
            render();
        }, 300);
    }
}

// ===== EDIT TASK =====
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const el = document.querySelector(`[data-id="${id}"]`);
    const textSpan = el.querySelector('.task-text');
    const actionsDiv = el.querySelector('.task-actions');

    // Replace text with input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    input.maxLength = 200;

    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // Hide actions while editing
    actionsDiv.style.display = 'none';

    // Save on Enter or blur
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== task.text) {
            task.text = newText;
            save();
        }
        render();
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') render();
    });

    input.addEventListener('blur', saveEdit);
}

// ===== CLEAR COMPLETED =====
function clearCompleted() {
    const completedEls = document.querySelectorAll('.task-item.completed');
    completedEls.forEach(el => el.classList.add('removing'));

    setTimeout(() => {
        tasks = tasks.filter(t => !t.completed);
        save();
        render();
    }, 300);
}

// ===== FILTER TASKS =====
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// ===== RENDER =====
function render() {
    const filtered = getFilteredTasks();
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    // Update stats
    statBadge.textContent = `${totalCount} task${totalCount !== 1 ? 's' : ''}`;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

    // Show/hide footer
    appFooter.classList.toggle('hidden', totalCount === 0);

    // Show/hide clear button
    clearCompletedBtn.style.visibility = completedCount > 0 ? 'visible' : 'hidden';

    // Show/hide empty state
    emptyState.classList.toggle('visible', filtered.length === 0);

    // Render tasks
    taskList.innerHTML = '';

    filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item${task.completed ? ' completed' : ''}`;
        div.dataset.id = task.id;

        div.innerHTML = `
            <label class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark">
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </span>
            </label>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="action-btn edit-btn" aria-label="Edit task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" aria-label="Delete task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        `;

        // Event delegation
        const checkbox = div.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const editBtn = div.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => startEdit(task.id));

        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(div);
    });
}

// ===== UTILS =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

// ===== START =====
init();
