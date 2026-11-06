"use strict";

const FILTERS = {
  all: "all",
  active: "active",
  done: "done",
};

let currentFilter = FILTERS.all;

let tasks = [];
const STORAGE_KEY = "todo.tasks";

const saveTasks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};

const loadTasks = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const dom = {
  taskTemplate: document.querySelector("#task-template"),
  form: document.querySelector("#add-form"),
  taskList: document.querySelector("#task-list"),
  inputTask: document.querySelector("#task-input"),
  remaining: document.querySelector("#remaining"),
  btnClearCompleted: document.querySelector("#clear-completed"),
  emptyMessage: document.querySelector("#empty-message"),
  filters: document.querySelector(".filters"),
  filterButtons: document.querySelectorAll(".filter"),
};

const addTask = (event) => {
  event.preventDefault();

  const text = dom.inputTask.value.trim();
  if (!text) return;

  tasks.push({ id: crypto.randomUUID(), text, done: false });
  dom.inputTask.value = "";
  saveTasks();
  render();
};

const getRemainingTasks = () => tasks.filter((task) => !task.done).length;

const getVisibleTasks = () => {
  if (currentFilter === FILTERS.active)
    return tasks.filter((task) => !task.done);
  if (currentFilter === FILTERS.done) return tasks.filter((task) => task.done);
  return tasks;
};

const deleteCompletedTask = () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
};

// === DOM OPERATIONS ===

function render() {
  dom.emptyMessage.hidden = tasks.length > 0;
  dom.remaining.textContent = `${getRemainingTasks()} left`;

  for (const filter of dom.filterButtons) {
    filter.setAttribute(
      "aria-pressed",
      String(currentFilter === filter.dataset.filter),
    );
  }

  renderList();
}

const createTaskElement = (task) => {
  const item = dom.taskTemplate.content.firstElementChild.cloneNode(true);
  item.dataset.id = task.id;
  item.querySelector(".task__text").textContent = task.text;
  return item;
};

// Reconciles the list with `tasks` instead of rebuilding it, so an existing
// <li> stays in the DOM and its CSS transitions (strike-through) can play.
function renderList() {
  const visible = getVisibleTasks();
  const visibleIds = new Set(visible.map((task) => task.id));
  const existing = new Map(
    [...dom.taskList.children].map((li) => [li.dataset.id, li]),
  );

  for (const [id, li] of existing) {
    if (!visibleIds.has(id)) li.remove();
  }

  visible.forEach((task, index) => {
    const li = existing.get(task.id) ?? createTaskElement(task);
    li.querySelector(".task__check").checked = task.done;

    if (dom.taskList.children[index] !== li) {
      dom.taskList.insertBefore(li, dom.taskList.children[index] ?? null);
    }
  });
}

// === LISTENERS ===

dom.form.addEventListener("submit", addTask);
dom.btnClearCompleted.addEventListener("click", deleteCompletedTask);

dom.taskList.addEventListener("click", (event) => {
  const btnDelete = event.target.closest(".task__delete");
  if (!btnDelete) return;

  const id = btnDelete.closest("li").dataset.id;
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
});

dom.taskList.addEventListener("change", (event) => {
  const check = event.target.closest(".task__check");
  if (!check) return;

  const id = check.closest("li").dataset.id;
  const task = tasks.find((task) => task.id === id);
  if (!task) return;

  task.done = check.checked;
  saveTasks();
  render();
});

dom.filters.addEventListener("click", (event) => {
  const filter = event.target.closest(".filter");
  if (!filter) return;
  currentFilter = filter.dataset.filter;

  render();
});

// === LOAD PAGE ===

tasks = loadTasks();
render();
