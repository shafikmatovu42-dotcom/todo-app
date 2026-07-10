// Grab references to the elements we need
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');

// Runs every time the form is submitted (button click OR pressing Enter)
form.addEventListener('submit', function (event) {
  event.preventDefault(); // stops the page from reloading (default form behavior)

  const todoText = input.value.trim(); // trim removes leading/trailing whitespace

  if (todoText === '') {
    return; // don't add empty todos
  }

  addTodo(todoText);
  input.value = ''; // clear the input for the next entry
});

function addTodo(text) {
  const li = document.createElement('li');
  li.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');

  deleteBtn.addEventListener('click', function () {
    li.remove(); // removes this specific <li> from the DOM
  });

  li.appendChild(deleteBtn);
  list.appendChild(li);
}