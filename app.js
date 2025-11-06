//The URL of the SpringBoot backend api
const API_URL='http://localhost:8080/api/tasks';

//Get the references to the html elements
const taskForm=document.getElementById('task-form');
const taskInput=document.getElementById('task-input');
const taskList=document.getElementById('task-list');

//Fetch all the task when the page loads....
window.addEventListener('load',fetchTasks);

async function fetchTasks() {
    try{
        const response=await fetch(API_URL);
        const tasks=await response.json();



        taskList.innerHTML='';
        tasks.forEach(task => {
            rendertask(task);
            
        });
    }catch(error){
        console.log('Error fetching Task:',error);

    }
    

}
//Helper function to create the and add the li to the page
function rendertask(task){
    const li=document.createElement('li');
    li.dataset.id=task.id;

    if(task.completed){
        li.classList.add('completed');
    }

    const taskContent = document.createElement('span');
    const checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.checked=task.completed;
    checkbox.addEventListener('change',()=> toggleComplete(task.id,!task.completed));

    taskContent.appendChild(checkbox);
    taskContent.append(`${task.description}`);

    const deleteBtn=document.createElement('button');
    deleteBtn.textContent='Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click',()=> deleteTask(task.id));

    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

}

//create : Add a new Task

    taskForm.addEventListener('submit',async (e) =>{
        e.preventDefault();//used to prevent the page reload
        const description=taskInput.value;
        if(!description){
            return;
        }

        try{
            const response=await fetch(API_URL,{
                method:'POST',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({description:description,completed:false})
            });

            const newTask=await response.json();
            rendertask(newTask);
            taskInput.value='';

        }catch(error){
            console.log('Error in adding task',error);

        }

    });
async function deleteTask(id) {
    try{
        await fetch(`${API_URL}/${id}`,{
            method:'DELETE'
        }
            
        );
        document.querySelector(`li[data-id='${id}']`).remove();
    }catch(error){
        console.log('Error in deletion task:',error);

    }
    
}



//update:Toggle task completion

async function toggleComplete(id,newStatus) {
    
    try{
        const response=await fetch(`${API_URL}/${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({completed:newStatus})
        });

        const updatedTask = await response.json();
        const taskElemnt=document.querySelector(`li[data-id='${id}']`) ;
        taskElemnt.classList.toggle('completed',updatedTask.completed);
    }catch(error){
        console.log('Error updating task',error);
    }
}




// --- (Your existing code for fetch, render, delete, etc.) ---


// --- NEW: Add logic for the SMS Form ---

// 1. Get the new form elements
const smsForm = document.getElementById('sms-form');
const phoneInput = document.getElementById('phone-input');

// 2. Add a submit event listener
smsForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    
    const phoneNumber = phoneInput.value;
    if (!phoneNumber) {
        alert('Please enter a phone number.');
        return;
    }

    console.log(`Sending SMS to: ${phoneNumber}`);
    
    try {
        await fetch('http://localhost:8080/api/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to: phoneNumber })
        });
        
        alert('To-Do list sent successfully!');
        phoneInput.value = ''; // Clear the input
    } catch (error) {
        console.error('Error sending SMS:', error);
        alert('Failed to send SMS. Check the console for details.');
    }
});

