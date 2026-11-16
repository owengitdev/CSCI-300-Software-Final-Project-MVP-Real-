const assert = require('node:assert/strict');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(title) {
    if (!title || !title.trim()) {
      throw new Error('Task title is required');
    }

    const task = {
      id: this.nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    return task;
  }

  getTask(id) {
    return this.tasks.find((task) => task.id === id) || null;
  }

  toggleTask(id) {
    const task = this.getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }

    task.completed = !task.completed;
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const [deleted] = this.tasks.splice(index, 1);
    return deleted;
  }

  listTasks() {
    return [...this.tasks];
  }

  getSummary() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter((task) => task.completed).length,
      pending: this.tasks.filter((task) => !task.completed).length,
    };
  }
}

const manager = new TaskManager();

assert.equal(manager.listTasks().length, 0);

const task1 = manager.addTask('Write project plan');
assert.equal(task1.title, 'Write project plan');
assert.equal(task1.completed, false);
assert.equal(manager.getSummary().total, 1);
assert.equal(manager.getSummary().pending, 1);

const task2 = manager.addTask('  Build MVP  ');
assert.equal(task2.title, 'Build MVP');

const found = manager.getTask(task1.id);
assert.ok(found);
assert.equal(found.title, 'Write project plan');

const toggled = manager.toggleTask(task1.id);
assert.equal(toggled.completed, true);
assert.equal(manager.getSummary().completed, 1);
assert.equal(manager.getSummary().pending, 1);

const deleted = manager.deleteTask(task2.id);
assert.equal(deleted.title, 'Build MVP');
assert.equal(manager.listTasks().length, 1);

assert.throws(() => manager.addTask('   '), /Task title is required/);
assert.throws(() => manager.toggleTask(999), /Task not found/);
assert.throws(() => manager.deleteTask(999), /Task not found/);

module.exports = { TaskManager };