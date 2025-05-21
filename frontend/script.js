const apiUrl = 'http://localhost:3000/api/todos';

async function renderTODOLIST() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json();
        
        todos.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(a.date) - new Date(b.date);
        });

        let todoListHtml = '';
        todos.forEach((todo, index) => {
           const html = `
                <div class="todo-item ${todo.priority}">
                    <div><strong>Title:</strong> ${todo.title}</div>
                    <div><strong>Date:</strong> ${todo.date}</div>
                    <div><strong>Priority:</strong> ${todo.priority}</div>
                    <div><strong>Category:</strong> ${todo.category || 'N/A'}</div>
                    <div><strong>Status:</strong> ${todo.status || 'N/A'}</div>
                    <button class="edit-button" data-id="${todo.id}" data-index="${index}">Edit</button>
                    <button class="delete-button" data-id="${todo.id}" data-index="${index}">Delete</button>
                </div>
            `;

            todoListHtml += html;
        });

        document.querySelector('.todo-grid').innerHTML = todoListHtml;

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                await deleteTodo(id);
            });
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                const id = button.dataset.id;
                editTodo(index, id);
            });
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function addTodo() {
    const inputElement = document.querySelector('.title-input');
    const dateInput = document.querySelector('.date-input');
    const priorityInput = document.querySelector('.priority-input');
    const categoryInput = document.querySelector('.category-input');
    const statusInput = document.querySelector('.status-input');

    const title = inputElement.value;
    const date = dateInput.value;
    const priority = priorityInput.value;
    const category_id = categoryInput.value;
    const status_id = statusInput.value;

    if (!title || !date || !priority || !category_id || !status_id) {
        alert('Please fill all fields.');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, priority, category_id, status_id })
        });

        if (response.ok) {
            inputElement.value = '';
            dateInput.value = '';
            priorityInput.value = 'medium';
            categoryInput.value = '1';  
            statusInput.value = '1';    
            renderTODOLIST();
        } else {
            const error = await response.json();
            alert('Error adding todo: ' + error.error);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}



async function deleteTodo(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            renderTODOLIST();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

async function editTodo(index, id) {
    const todoItems = document.querySelectorAll('.todo-item');
    const todoItem = todoItems[index];

    const title = todoItem.children[0].textContent.replace('Title: ', '');
    const date = todoItem.children[1].textContent.replace('Date: ', '');
    const priority = todoItem.children[2].textContent.replace('Priority: ', '');
    const category = todoItem.children[3].textContent.replace('Category: ', '');
    const status = todoItem.children[4].textContent.replace('Status: ', '');

    todoItem.innerHTML = `
        <input type="text" value="${title}" class="edit-title-input">
        <input type="date" value="${date}" class="edit-date-input">

        <select class="edit-priority-input">
            <option value="high" ${priority === 'high' ? 'selected' : ''}>High Priority</option>
            <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
            <option value="low" ${priority === 'low' ? 'selected' : ''}>Low Priority</option>
        </select>

        <select class="edit-category-input">
            <option value="1" ${category === 'Personal' ? 'selected' : ''}>Personal</option>
            <option value="2" ${category === 'Work' ? 'selected' : ''}>Work</option>
        </select>

        <select class="edit-status-input">
            <option value="1" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="2" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="3" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>

        <button class="save-button">Save</button>
        <button class="cancel-button">Cancel</button>
    `;

    todoItem.querySelector('.save-button').addEventListener('click', async () => {
        const newTitle = todoItem.querySelector('.edit-title-input').value;
        const newDate = todoItem.querySelector('.edit-date-input').value;
        const newPriority = todoItem.querySelector('.edit-priority-input').value;
        const newCategoryId = todoItem.querySelector('.edit-category-input').value;
        const newStatusId = todoItem.querySelector('.edit-status-input').value;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    date: newDate,
                    priority: newPriority,
                    category_id: newCategoryId,
                    status_id: newStatusId
                })
            });

            if (response.ok) {
                renderTODOLIST();
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    });

    todoItem.querySelector('.cancel-button').addEventListener('click', () => {
        renderTODOLIST();
    });
}


document.querySelector('.add-button').addEventListener('click', addTodo);
renderTODOLIST();
