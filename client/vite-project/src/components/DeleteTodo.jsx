import React from 'react'

const deleteTodo = ({ todoId, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
                method: 'DELETE',
            });
            if (response.status === 200) {
                onDelete(todoId);
            } else {
                const data = await response.json();
                console.error('Error deleting todo:', data.message);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };
    return (
        <button 
            onClick={handleDelete}
            className="delete-btn"
        >
            Delete
        </button>
    );
};

export default deleteTodo
