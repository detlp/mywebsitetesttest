document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  checkDueDates();  // ตรวจสอบวันครบกำหนดเมื่อโหลดหน้าเว็บ
  requestNotificationPermission();  // ขออนุญาตการแจ้งเตือน
});

document.getElementById('task-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');
  const task = taskInput.value;
  const dueDate = dueDateInput.value;

  if (task && dueDate) {
      addTaskToTable(task, dueDate);
      saveTask(task, dueDate);
      taskInput.value = '';
      dueDateInput.value = '';
  }
});

function addTaskToTable(task, dueDate, completed = false) {
  const tableBody = document.querySelector('#task-table tbody');
  const row = document.createElement('tr');

      row.innerHTML = `
        <td>${task}</td>
        <td>${dueDate}</td>
        <td><input type="checkbox" ${completed ? 'checked' : ''}></td>
      `;

  ;

  // ฟังค์ชั่นเมื่อสถานะของ checkbox เปลี่ยน
  row.querySelector('input[type="checkbox"]').addEventListener('change', function() {
      handleCheckboxChange(this, task, dueDate);
  });

  tableBody.appendChild(row);
}

function handleCheckboxChange(checkbox, task, dueDate) {
  if (checkbox.checked) {
      // ตั้งเวลาในการลบงานหลังจาก 5 นาที
      setTimeout(() => {
          removeTask(task, dueDate);
      }, 5 * 60 * 1000);  // 5 นาที
  } else {
      // ถ้าติ๊กออก ให้ลบงานทันที
      removeTask(task, dueDate);
  }
}
function saveTask(task, dueDate, completed = false) {
  let tasks = JSON.parse(localStorage.getItem('tasks'))|| [];
  tasks.push({ task, dueDate, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(task, dueDate) {
  let tasks = JSON.parse(localStorage.getItem('tasks'))|| [];
  tasks = tasks.filter(t => t.task !== task , t.dueDate !== dueDate);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  reloadTable();
}

function reloadTable() {
  const tableBody = document.querySelector('#task-table tbody');
  tableBody.innerHTML = ''; 
  loadTasks();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks'))|| [];
  tasks.forEach(({ task, dueDate, completed }) => {
      addTaskToTable(task, dueDate, completed);
  });
}

function checkDueDates() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const now = new Date();

  tasks.forEach(({ task, dueDate }) => {
      const dueDateTime = new Date(dueDate);
      if (dueDateTime <= now) {
          notifyUser(task, dueDate);
      }
  });
}

    function notifyUser(task, dueDate) {
      if (Notification.permission === 'granted') {
          new Notification('To-Do Reminder', {
              body: `Task: ${task}\nDue Date: ${dueDate}`,
              icon: 'icon.png'
          });
      }
    }


function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
              console.log('Notification permission granted.');
          } else {
              console.log('Notification permission denied.');
          }
      });
  }
}
