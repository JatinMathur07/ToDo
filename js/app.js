// To-Do List Application
// Professional Elegance Design with Complete CRUD Functionality

let todos = [];
let currentFilter = 'all';
let editingId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
    updateStats();
});

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add or Update Todo
function addOrUpdateTodo() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        showNotification('Please enter a task title', 'error');
        return;
    }

    if (editingId) {
        // Update existing todo
        const todo = todos.find(t => t.id === editingId);
        if (todo) {
            todo.title = title;
            todo.description = description;
            todo.priority = priority;
            showNotification('Task updated successfully', 'success');
        }
        cancelEdit();
    } else {
        // Add new todo
        const newTodo = {
            id: Date.now().toString(),
            title: title,
            description: description,
            priority: priority,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        };
        todos.unshift(newTodo);
        showNotification('Task added successfully', 'success');
    }

    // Clear form
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskPriority').value = 'medium';

    saveTodos();
    renderTodos();
    updateStats();
}

// Delete Todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        showNotification('Task deleted', 'success');
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Toggle Todo Completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Start Editing Todo
function startEdit(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        editingId = id;
        document.getElementById('taskTitle').value = todo.title;
        document.getElementById('taskDescription').value = todo.description;
        document.getElementById('taskPriority').value = todo.priority;
        document.getElementById('formTitle').textContent = 'Edit Task';
        document.getElementById('submitBtnText').textContent = 'Update Task';
        document.getElementById('cancelBtn').classList.remove('hidden');
        document.getElementById('taskTitle').focus();
    }
}

// Cancel Editing
function cancelEdit() {
    editingId = null;
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('formTitle').textContent = 'Add New Task';
    document.getElementById('submitBtnText').textContent = 'Add Task';
    document.getElementById('cancelBtn').classList.add('hidden');
}

// Filter Todos
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    });
    
    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Render Todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filtered = getFilteredTodos();

    if (filtered.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state bg-white border border-slate-200 rounded-lg card-elevated">
                <i class="fas fa-inbox text-slate-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-bold text-slate-900 mb-2">
                    ${currentFilter === 'completed' ? 'No completed tasks yet' : currentFilter === 'active' ? 'All tasks completed!' : 'No tasks yet'}
                </h3>
                <p class="text-slate-500 text-sm">
                    ${currentFilter === 'all' ? 'Create your first task to get started' : 'Try adjusting your filters'}
                </p>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filtered.map(todo => `
        <div class="task-item bg-white border border-slate-200 rounded-lg card-elevated p-4 group">
            <div class="flex items-start gap-4">
                <!-- Checkbox -->
                <button onclick="toggleTodo('${todo.id}')" class="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                    ${todo.completed 
                        ? '<i class="fas fa-check-circle text-green-500 text-xl"></i>' 
                        : '<i class="fas fa-circle text-slate-300 text-xl hover:text-indigo-500"></i>'
                    }
                </button>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium transition-all ${todo.completed ? 'task-completed' : 'text-slate-900'}">
                        ${todo.title}
                    </h3>
                    ${todo.description ? `
                        <p class="text-sm mt-1 transition-all ${todo.completed ? 'text-slate-300' : 'text-slate-600'}">
                            ${todo.description}
                        </p>
                    ` : ''}
                    <div class="flex items-center gap-2 mt-2">
                        <span class="inline-block px-2 py-1 text-xs font-medium rounded border priority-${todo.priority}">
                            ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </span>
                        <span class="text-xs text-slate-400">${todo.createdAt}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="startEdit('${todo.id}')" class="p-2 btn-edit rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTodo('${todo.id}')" class="p-2 btn-danger rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

// Show Notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg text-white font-medium shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    notification.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter to add task
    if (e.key === 'Enter' && (e.target.id === 'taskTitle' || e.target.id === 'taskDescription')) {
        if (e.ctrlKey || e.metaKey) {
            addOrUpdateTodo();
        }
    }
    
    // Escape to cancel edit
    if (e.key === 'Escape' && editingId) {
        cancelEdit();
    }
});
