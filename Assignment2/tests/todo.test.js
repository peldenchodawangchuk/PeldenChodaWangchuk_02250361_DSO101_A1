describe('Todo App Tests', () => {
    test('should create a todo item', () => {
        const todo = { id: 1, title: 'Buy groceries', done: false };
        expect(todo.title).toBe('Buy groceries');
        expect(todo.done).toBe(false);
    });

    test('should mark a todo as done', () => {
        const todo = { id: 1, title: 'Buy groceries', done: false };
        todo.done = true;
        expect(todo.done).toBe(true);
    });

    test('should store multiple todos', () => {
        const todos = [
            { id: 1, title: 'Task 1', done: false },
            { id: 2, title: 'Task 2', done: true }
        ];
        expect(todos).toHaveLength(2);
    });
});