/**
 * Employee Management System - Core Script
 * Designed with simple, basic, and clean JavaScript logic.
 */

// ==========================================================================
// 1. DOM Element Selections
// ==========================================================================
const employeeForm = document.getElementById("employeeForm");
const editIndexInput = document.getElementById("editIndex");
const empNameInput = document.getElementById("empName");
const empEmailInput = document.getElementById("empEmail");
const empDeptSelect = document.getElementById("empDept");
const empPositionInput = document.getElementById("empPosition");
const empSalaryInput = document.getElementById("empSalary");
const submitBtn = document.getElementById("submitBtn");

const employeeTableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");
const sortBySelect = document.getElementById("sortBy");
const emptyState = document.getElementById("emptyState");

// Dashboard Elements
const totalCountEl = document.getElementById("totalCount");
const avgSalaryEl = document.getElementById("avgSalary");
const deptCountEl = document.getElementById("deptCount");

// Other Controls
const themeToggleBtn = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");

// ==========================================================================
// 2. Global State (Employee Data Array)
// ==========================================================================
let employees = [];

// Fallback sample data to test layout if local storage is empty
const sampleEmployees = [
    {
        id: "EMP101",
        name: "Amit Sharma",
        email: "amit.sharma@example.com",
        department: "IT",
        position: "Software Engineer",
        salary: 65000
    },
    {
        id: "EMP102",
        name: "Priya Patel",
        email: "priya.patel@example.com",
        department: "HR",
        position: "HR Specialist",
        salary: 50000
    },
    {
        id: "EMP103",
        name: "Rohan Verma",
        email: "rohan.verma@example.com",
        department: "Marketing",
        position: "SEO Specialist",
        salary: 45000
    }
];

// ==========================================================================
// 3. Core Functions
// ==========================================================================

/**
 * Saves the current employees array to Local Storage
 */
function saveToLocalStorage() {
    localStorage.setItem("ems_employees", JSON.stringify(employees));
}

/**
 * Updates the dashboard cards (Total Employees, Average Salary, Departments)
 */
function updateDashboard() {
    const total = employees.length;
    totalCountEl.textContent = total;

    // Calculate Average Salary
    if (total > 0) {
        const sum = employees.reduce((acc, curr) => acc + Number(curr.salary), 0);
        const avg = Math.round(sum / total);
        // Format to Indian Rupees format
        avgSalaryEl.textContent = "₹" + avg.toLocaleString("en-IN");
    } else {
        avgSalaryEl.textContent = "₹0";
    }

    // Count unique departments
    const uniqueDepts = new Set(employees.map(emp => emp.department));
    deptCountEl.textContent = uniqueDepts.size;
}

/**
 * Dynamically renders the employee list table based on filters and sorting
 */
function renderTable() {
    const query = searchInput.value.toLowerCase().trim();
    const sortBy = sortBySelect.value;

    // Filter employees by Name or Department
    let filteredEmployees = employees.filter(emp => {
        return emp.name.toLowerCase().includes(query) || 
               emp.department.toLowerCase().includes(query);
    });

    // Sort employees
    if (sortBy === "name") {
        // Alphabetical sort (A-Z)
        filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "salary") {
        // Numeric sort (Highest to Lowest)
        filteredEmployees.sort((a, b) => b.salary - a.salary);
    }

    // Clear previous rows
    employeeTableBody.innerHTML = "";

    // Show/Hide Empty State
    if (filteredEmployees.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    // Populate rows
    filteredEmployees.forEach(emp => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><strong>${emp.id}</strong></td>
            <td>${emp.name}</td>
            <td><a href="mailto:${emp.email}" style="color: inherit; text-decoration: none;">${emp.email}</a></td>
            <td><span class="dept-badge">${emp.department}</span></td>
            <td>${emp.position}</td>
            <td>₹${Number(emp.salary).toLocaleString("en-IN")}</td>
            <td class="actions-col">
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="startEditEmployee('${emp.id}')">✏️ Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteEmployee('${emp.id}')">🗑️ Delete</button>
                </div>
            </td>
        `;

        employeeTableBody.appendChild(row);
    });

    // Keep dashboard metrics accurate
    updateDashboard();
}

/**
 * Generates a unique Employee ID (e.g. EMP104)
 */
function generateEmployeeId() {
    if (employees.length === 0) return "EMP101";
    
    // Extract numerical digits from employee IDs, find max, and increment
    const ids = employees.map(emp => {
        const numPart = emp.id.replace("EMP", "");
        return parseInt(numPart) || 100;
    });
    
    const maxId = Math.max(...ids);
    return "EMP" + (maxId + 1);
}

/**
 * Handles adding a new employee or updating an existing one
 */
function handleFormSubmit(event) {
    // Prevent default page reload
    event.preventDefault();

    const editId = editIndexInput.value;

    const employeeData = {
        name: empNameInput.value.trim(),
        email: empEmailInput.value.trim(),
        department: empDeptSelect.value,
        position: empPositionInput.value.trim(),
        salary: parseFloat(empSalaryInput.value)
    };

    if (editId === "-1") {
        // CREATE: Add new employee
        employeeData.id = generateEmployeeId();
        employees.push(employeeData);
    } else {
        // UPDATE: Modify existing employee
        const index = employees.findIndex(emp => emp.id === editId);
        if (index !== -1) {
            employeeData.id = editId; // preserve the ID
            employees[index] = employeeData;
        }
        
        // Reset form button back to normal
        submitBtn.textContent = "Submit";
        editIndexInput.value = "-1";
    }

    // Save data, reload table, and reset the form fields
    saveToLocalStorage();
    renderTable();
    employeeForm.reset();
}

/**
 * Prepares the form to edit an employee's details
 */
window.startEditEmployee = function(id) {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    // Fill form input fields with the employee's current details
    editIndexInput.value = employee.id;
    empNameInput.value = employee.name;
    empEmailInput.value = employee.email;
    empDeptSelect.value = employee.department;
    empPositionInput.value = employee.position;
    empSalaryInput.value = employee.salary;

    // Scroll to the form section smoothly on mobile devices
    employeeForm.scrollIntoView({ behavior: 'smooth' });

    // Change submit button to indicate edit mode
    submitBtn.textContent = "Update Employee";
};

/**
 * Deletes an employee record after verification
 */
window.deleteEmployee = function(id) {
    // Simple prompt confirmation
    const confirmDelete = confirm("Are you sure you want to delete this employee record?");
    if (!confirmDelete) return;

    // Remove employee from array using filter
    employees = employees.filter(emp => emp.id !== id);

    // Save and re-draw table
    saveToLocalStorage();
    renderTable();

    // If deleting the employee currently being edited, reset the form
    if (editIndexInput.value === id) {
        employeeForm.reset();
        submitBtn.textContent = "Submit";
        editIndexInput.value = "-1";
    }
};

/**
 * Export employee data to a downloadable CSV file (Bonus Feature)
 */
function exportCSV() {
    if (employees.length === 0) {
        alert("No employee data available to export!");
        return;
    }

    // Formulate CSV Headers and Rows
    const headers = ["Employee ID", "Name", "Email", "Department", "Position", "Salary"];
    const rows = employees.map(emp => [
        emp.id,
        `"${emp.name.replace(/"/g, '""')}"`, // wrap in quotes to support commas inside names
        emp.email,
        emp.department,
        `"${emp.position.replace(/"/g, '""')}"`,
        emp.salary
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    
    // Create download link and trigger it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employee_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================================================
// 4. Initialization & Theme Selection
// ==========================================================================

/**
 * Initializes the application state
 */
function init() {
    // Load existing employees from local storage or set initial samples
    const stored = localStorage.getItem("ems_employees");
    if (stored) {
        employees = JSON.parse(stored);
    } else {
        employees = [...sampleEmployees];
        saveToLocalStorage();
    }

    // Load user's dark mode preference
    const darkModePref = localStorage.getItem("ems_dark_mode") === "true";
    if (darkModePref) {
        document.body.classList.add("dark-mode");
    }

    // Render visual elements
    renderTable();
}

// ==========================================================================
// 5. Event Listeners
// ==========================================================================

// Form Submission Event
employeeForm.addEventListener("submit", handleFormSubmit);

// Reset form should clear edit index as well
employeeForm.addEventListener("reset", () => {
    editIndexInput.value = "-1";
    submitBtn.textContent = "Submit";
});

// Search & Filter Events
searchInput.addEventListener("input", renderTable);
sortBySelect.addEventListener("change", renderTable);

// CSV Export Button
exportBtn.addEventListener("click", exportCSV);

// Light/Dark Theme Toggle Event
themeToggleBtn.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("ems_dark_mode", isDarkMode);
});

// Run initializer on script load
init();
