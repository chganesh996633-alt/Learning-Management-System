/* =====================================================
   EDULEARN LMS - JAVASCRIPT
   Student and Administrator Login
===================================================== */

function onReady(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}
/* =====================================================
   1. LOGIN SYSTEM
===================================================== */


/* =========================================
   1. REGISTRATION AND LOGIN SYSTEM
========================================= */

onReady(function () {

    const registerForm =
        document.getElementById("registerForm");

    const loginForm =
        document.getElementById("loginForm");

    // REGISTRATION
  // REGISTRATION
if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("regName").value.trim();

        const email =
            document.getElementById("regEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("regPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const role =
            document.getElementById("regRole").value.trim().toLowerCase();

        const error =
            document.getElementById("registerError");

        // Check passwords
        if (password !== confirmPassword) {
            error.textContent = "Passwords do not match!";
            return;
        }

        // Get existing users
        const users = JSON.parse(
            localStorage.getItem("registeredUsers") || "[]"
        );

        // Check duplicate email
        const existingUser = users.find(function (user) {
            return user.email.toLowerCase() === email;
        });

        if (existingUser) {
            error.textContent = "Email already registered!";
            return;
        }

        // Save new user
        const newUser = {
            name: name,
            email: email,
            password: password,
            role: role
        };

        users.push(newUser);

        localStorage.setItem(
            "registeredUsers",
            JSON.stringify(users)
        );

        error.textContent = "";

        alert("Registration successful! Please login.");

        registerForm.reset();

        showLoginForm();

        document.getElementById("email").value = email;
        document.getElementById("role").value = role;

    });
} 

    // LOGIN
    // LOGIN
if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const role =
            document.getElementById("role").value.trim().toLowerCase();

        const error =
            document.getElementById("loginError");

        if (!email) {
            error.textContent = "Please enter your email!";
            return;
        }

        error.textContent = "";

        // STUDENT LOGIN
        if (role === "student") {

            const users = JSON.parse(
                localStorage.getItem("registeredUsers") || "[]"
            );

            const user = users.find(function (item) {
                return item.email.trim().toLowerCase() === email &&
                       item.role.trim().toLowerCase() === "student";
            });

            const studentName = user
                ? user.name
                : email.split("@")[0].replace(/[._-]/g, " ");

            loginAsStudent(studentName, email);

            return;
        }

        // ADMIN LOGIN
        if (role === "admin") {

            loginAsAdmin("Administrator", email);

            return;
        }

        error.textContent = "Please select a valid role!";

    });
}
    loadSavedUser();

});


/* =========================================
   2. SWITCH BETWEEN FORMS
========================================= */

function showRegisterForm() {

    hideElement("loginForm");
    showElement("registerForm");

    setText("authTitle", "Create Account");

    setText(
        "authSubtitle",
        "Register to start your learning journey"
    );

}

function showLoginForm() {

    hideElement("registerForm");
    showElement("loginForm");

    setText("authTitle", "Welcome Back!");

    setText(
        "authSubtitle",
        "Enter your login details"
    );

}

/* =====================================================
   2. ADMINISTRATOR LOGIN
===================================================== */

function loginAsAdmin(name, email) {
    localStorage.setItem("currentRole", "admin");
    localStorage.setItem("adminName", name);
    localStorage.setItem("adminEmail", email);

    const adminDisplayName =
        document.getElementById("adminDisplayName");

    const adminProfileName =
        document.getElementById("adminProfileName");

    const adminProfileEmail =
        document.getElementById("adminProfileEmail");

    if (adminDisplayName) {
        adminDisplayName.textContent = name;
    }

    if (adminProfileName) {
        adminProfileName.textContent = name;
    }

    if (adminProfileEmail) {
        adminProfileEmail.textContent = email;
    }

    hideElement("loginPage");
    hideElement("app");

    showElement("adminApp");

    showAdminSection("adminDashboard");

    updateAdminCounts();
}


/* =====================================================
   3. STUDENT LOGIN
===================================================== */
function loginAsStudent(name, email) {

    localStorage.setItem("currentRole", "student");
    localStorage.setItem("studentName", name);
    localStorage.setItem("studentEmail", email);

    const displayName = document.getElementById("displayName");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (displayName) {
        displayName.textContent = name;
    }

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileEmail) {
        profileEmail.textContent = email;
    }

    hideElement("loginPage");
    hideElement("adminApp");

    showElement("app");

    showSectionById("dashboard");

}


/* =====================================================
   4. HELPER FUNCTIONS
===================================================== */

function hideElement(id) {
    const element = document.getElementById(id);

    if (element) {
        element.classList.add("hidden");
    }
}

function showElement(id) {
    const element = document.getElementById(id);

    if (element) {
        element.classList.remove("hidden");
    }
}


/* =====================================================
   5. STUDENT NAVIGATION
===================================================== */

function showSection(sectionId, clickedButton) {
    const sections = document.querySelectorAll(".page-section");

    sections.forEach(function (section) {
        section.classList.add("hidden");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
    }

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        courses: "My Courses",
        assignments: "Assignments",
        progress: "Learning Progress",
        discussion: "Discussion Forum",
        certificates: "My Certificates",
        profile: "My Profile"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "Dashboard";
    }
}


/* =====================================================
   6. OPEN STUDENT SECTION
===================================================== */

function showSectionById(sectionId) {
    const sections = document.querySelectorAll(".page-section");

    sections.forEach(function (section) {
        section.classList.add("hidden");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
    }

    const titles = {
        dashboard: "Dashboard",
        courses: "My Courses",
        assignments: "Assignments",
        progress: "Learning Progress",
        discussion: "Discussion Forum",
        certificates: "My Certificates",
        profile: "My Profile"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "Dashboard";
    }
}


/* =====================================================
   7. ADMINISTRATOR NAVIGATION
===================================================== */

function showAdminSection(sectionId, clickedButton) {
    const sections = document.querySelectorAll(".admin-section");

    sections.forEach(function (section) {
        section.classList.add("hidden");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
    }

    const navItems = document.querySelectorAll(".admin-nav-item");

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        navItems.forEach(function (item) {
            const onclick = item.getAttribute("onclick") || "";

            if (onclick.includes("'" + sectionId + "'")) {
                item.classList.add("active");
            }
        });
    }

    const titles = {
        adminDashboard: "Admin Dashboard",
        adminCourses: "Manage Courses",
        adminStudents: "Students",
        adminAssignments: "Assignments",
        adminProfile: "Admin Details"
    };

    const pageTitle = document.getElementById("adminPageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "Admin Dashboard";
    }
}


/* =====================================================
   8. ADD COURSE
===================================================== */

function addAdminCourse() {
    const courseName = prompt("Enter course name:");

    if (!courseName || !courseName.trim()) {
        return;
    }

    const category = prompt("Enter course category:", "General");

    if (category === null) {
        return;
    }

    const instructor = prompt("Enter instructor name:", "Not assigned");

    if (instructor === null) {
        return;
    }

    const table = document.getElementById("adminCourseTable");

    if (!table) {
        alert("Course table not found.");
        return;
    }

    const row = document.createElement("tr");

    const values = [
        courseName.trim(),
        category.trim() || "General",
        instructor.trim() || "Not assigned"
    ];

    values.forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    const statusCell = document.createElement("td");
    const status = document.createElement("span");

    status.className = "admin-status";
    status.textContent = "Active";

    statusCell.appendChild(status);
    row.appendChild(statusCell);

    table.appendChild(row);

    updateAdminCounts();

    alert("Course added successfully!");
}


/* =====================================================
   9. ADD STUDENT
===================================================== */

function addAdminStudent() {
    const studentName = prompt("Enter student name:");

    if (!studentName || !studentName.trim()) {
        return;
    }

    const studentEmail = prompt("Enter student email:");

    if (!studentEmail || !studentEmail.trim()) {
        return;
    }

    const table = document.getElementById("adminStudentTable");

    if (!table) {
        alert("Student table not found.");
        return;
    }

    const row = document.createElement("tr");

    [studentName.trim(), studentEmail.trim()].forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    const statusCell = document.createElement("td");
    const status = document.createElement("span");

    status.className = "admin-status";
    status.textContent = "Active";

    statusCell.appendChild(status);
    row.appendChild(statusCell);

    table.appendChild(row);

    updateAdminCounts();

    alert("Student added successfully!");
}


/* =====================================================
   10. UPDATE ADMIN DASHBOARD COUNTS
===================================================== */

function updateAdminCounts() {
    const courseTable = document.getElementById("adminCourseTable");
    const studentTable = document.getElementById("adminStudentTable");
    const assignmentTable = document.getElementById("adminAssignmentTable");

    const courseCount = document.getElementById("adminCourseCount");
    const studentCount = document.getElementById("adminStudentCount");
    const assignmentCount = document.getElementById("adminAssignmentCount");

    if (courseTable && courseCount) {
        courseCount.textContent = courseTable.rows.length;
    }

    if (studentTable && studentCount) {
        studentCount.textContent = studentTable.rows.length;
    }

    if (assignmentTable && assignmentCount) {
        assignmentCount.textContent = assignmentTable.rows.length;
    }
}


/* =====================================================
   11. COURSE SEARCH
===================================================== */

function searchCourses() {
    const searchInput = document.getElementById("courseSearch");

    if (!searchInput) {
        return;
    }

    const searchText = searchInput.value.toLowerCase();

    const courses = document.querySelectorAll(".searchable");

    courses.forEach(function (course) {
        const courseText = course.textContent.toLowerCase();

        course.style.display =
            courseText.includes(searchText) ? "" : "none";
    });
}


/* =====================================================
   12. OPEN COURSE WITH TUTORIALS
===================================================== */

function openCourse(courseName) {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");

    if (!modal || !content) {
        alert("Course details: " + courseName);
        return;
    }

    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = courseName;

    const description = document.createElement("p");
    description.textContent =
        "Welcome to this course. Select a lesson to start learning.";

    content.appendChild(heading);
    content.appendChild(description);

    const lessons = [
        "Introduction",
        "Fundamentals",
        "Practical Concepts",
        "Advanced Topics"
    ];

    // Tutorial links for all supported courses
    const courseLinks = {
        java: {
            introduction:
                "https://www.geeksforgeeks.org/java/introduction-to-java/",
            fundamentals:
                "https://www.geeksforgeeks.org/java/java-tutorial/",
            practical:
                "https://www.geeksforgeeks.org/java/",
            advanced:
                "https://www.geeksforgeeks.org/java/"
        },

        "web development": {
            introduction:
                "https://www.geeksforgeeks.org/web-development/",
            fundamentals:
                "https://www.geeksforgeeks.org/html/",
            practical:
                "https://www.geeksforgeeks.org/css/",
            advanced:
                "https://www.geeksforgeeks.org/javascript/"
        },

        sql: {
            introduction:
                "https://www.geeksforgeeks.org/sql/sql-tutorial/",
            fundamentals:
                "https://www.geeksforgeeks.org/sql/",
            practical:
                "https://www.geeksforgeeks.org/sql/sql-queries/",
            advanced:
                "https://www.geeksforgeeks.org/sql/"
        },

        database: {
            introduction:
                "https://www.geeksforgeeks.org/dbms/",
            fundamentals:
                "https://www.geeksforgeeks.org/dbms/",
            practical:
                "https://www.geeksforgeeks.org/dbms/",
            advanced:
                "https://www.geeksforgeeks.org/dbms/"
        },

        // NEW: Python Programming tutorials
        python: {
            introduction:
                "https://www.w3schools.com/python/",
            fundamentals:
                "https://www.geeksforgeeks.org/python/python-programming-language-tutorial/",
            practical:
                "https://docs.python.org/3/tutorial/",
            advanced:
                "https://www.programiz.com/python-programming"
        },

        // NEW: Artificial Intelligence and Machine Learning tutorials
        ai: {
            introduction:
                "https://www.ibm.com/think/topics/artificial-intelligence",
            fundamentals:
                "https://www.w3schools.com/ai/",
            practical:
                "https://scikit-learn.org/stable/tutorial/index.html",
            advanced:
                "https://www.tensorflow.org/tutorials"
        }
    };

    // Identify the selected course
    const courseNameLower = courseName.toLowerCase();

    let selectedCourse = null;

    if (courseNameLower.includes("java")) {
        selectedCourse = courseLinks.java;

    } else if (courseNameLower.includes("web development")) {
        selectedCourse = courseLinks["web development"];

    } else if (courseNameLower.includes("sql")) {
        selectedCourse = courseLinks.sql;

    } else if (courseNameLower.includes("database")) {
        selectedCourse = courseLinks.database;

    } else if (courseNameLower.includes("python")) {
        selectedCourse = courseLinks.python;

    } else if (
        courseNameLower.includes("artificial intelligence") ||
        courseNameLower.includes("machine learning") ||
        courseNameLower.includes("ai/ml") ||
        courseNameLower === "ai"
    ) {
        selectedCourse = courseLinks.ai;
    }

    // Create lesson buttons
    lessons.forEach(function (lessonName) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = "📘 " + lessonName;
        button.className = "lesson";

        button.addEventListener("click", function () {
            if (!selectedCourse) {
                alert("Tutorial is not available for this course yet.");
                return;
            }

            let url;

            switch (lessonName) {
                case "Introduction":
                    url = selectedCourse.introduction;
                    break;

                case "Fundamentals":
                    url = selectedCourse.fundamentals;
                    break;

                case "Practical Concepts":
                    url = selectedCourse.practical;
                    break;

                case "Advanced Topics":
                    url = selectedCourse.advanced;
                    break;

                default:
                    return;
            }

            window.open(url, "_blank", "noopener,noreferrer");
        });

        content.appendChild(button);
    });

    modal.classList.remove("hidden");
}


/* =====================================================
   13. CLOSE MODAL
===================================================== */

function closeModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.add("hidden");
    }
}


/* =====================================================
   14. SUBMIT ASSIGNMENT
===================================================== */

function submitAssignment(button) {
    if (!button) {
        return;
    }

    const confirmed = confirm("Do you want to submit this assignment?");

    if (!confirmed) {
        return;
    }

    button.textContent = "Submitted ✓";
    button.disabled = true;

    updateAssignmentCount();
}


/* =====================================================
   15. UPDATE ASSIGNMENT COUNT
===================================================== */

function updateAssignmentCount() {
    const buttons = document.querySelectorAll("#assignmentList button");

    let remaining = 0;

    buttons.forEach(function (button) {
        if (!button.disabled) {
            remaining++;
        }
    });

    const count = document.getElementById("assignmentCount");

    if (count) {
        count.textContent = remaining;
    }
}


/* =====================================================
   16. CREATE DISCUSSION
===================================================== */

function createDiscussion() {
    const topic = prompt("Enter your discussion topic:");

    if (!topic || !topic.trim()) {
        return;
    }

    const list = document.getElementById("discussionList");

    if (!list) {
        alert("Discussion list not found.");
        return;
    }

    const discussion = document.createElement("div");
    discussion.className = "discussion";

    const heading = document.createElement("h3");
    heading.textContent = topic.trim();

    const paragraph = document.createElement("p");
    paragraph.textContent = "Created by you";

    discussion.appendChild(heading);
    discussion.appendChild(paragraph);

    list.prepend(discussion);

    alert("Discussion created successfully!");
}


/* =====================================================
   17. DOWNLOAD CERTIFICATE
===================================================== */

function downloadCertificate(courseName) {
    const studentNameElement = document.getElementById("displayName");

    const studentName = studentNameElement
        ? studentNameElement.textContent
        : "Student";

    const certificateWindow = window.open("", "_blank");

    if (!certificateWindow) {
        alert("Please allow pop-ups to print your certificate.");
        return;
    }

    const safeStudentName = escapeHTML(studentName);
    const safeCourseName = escapeHTML(courseName);

    certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>EduLearn Certificate</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 40px;
                }

                .certificate {
                    border: 8px solid #5b43e8;
                    padding: 50px;
                    margin: 20px auto;
                }

                h1 {
                    color: #5b43e8;
                    font-size: 40px;
                }

                h2 {
                    font-size: 30px;
                }
            </style>
        </head>

        <body>
            <div class="certificate">
                <h1>EDULEARN</h1>
                <h2>Certificate of Completion</h2>

                <p>This certificate is presented to</p>

                <h2>${safeStudentName}</h2>

                <p>For completing the course</p>

                <h2>${safeCourseName}</h2>

                <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
    `);

    certificateWindow.document.close();

    certificateWindow.onload = function () {
        certificateWindow.print();
    };
}


/* =====================================================
   18. ESCAPE HTML
===================================================== */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


/* =====================================================
   19. NOTIFICATIONS
===================================================== */

function showNotifications() {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");

    if (!modal || !content) {
        alert("You have no new notifications.");
        return;
    }

    content.innerHTML = `
        <h2>Notifications</h2>

        <div class="lesson">
            📝 Check your pending assignments.
        </div>

        <div class="lesson">
            📚 Continue learning your enrolled courses.
        </div>

        <div class="lesson">
            🏆 Keep working towards your certificates.
        </div>
    `;

    modal.classList.remove("hidden");
}


/* =====================================================
   20. UPDATE LEARNING PROGRESS
===================================================== */

let progress = 65;

function updateProgress() {
    if (progress < 100) {
        progress++;
    }

    const overallProgress = document.getElementById("overallProgress");
    const overallProgressBar = document.getElementById("overallProgressBar");
    const circleProgress = document.getElementById("circleProgress");

    if (overallProgress) {
        overallProgress.textContent = progress + "%";
    }

    if (overallProgressBar) {
        overallProgressBar.style.width = progress + "%";
    }

    if (circleProgress) {
        circleProgress.textContent = progress + "%";
    }
}


/* =====================================================
   21. DARK MODE
===================================================== */

function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}


/* =====================================================
   22. LOGOUT
===================================================== */

function logout() {
    const confirmed = confirm("Are you sure you want to log out?");

    if (!confirmed) {
        return;
    }

    hideElement("app");
    hideElement("adminApp");

    showElement("loginPage");

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.reset();
    }

    localStorage.removeItem("currentRole");

    const error = document.getElementById("loginError");

    if (error) {
        error.textContent = "";
    }
}


/* =====================================================
   23. LOAD SAVED USER DETAILS
===================================================== */

function loadSavedUser() {
    const role = localStorage.getItem("currentRole");

    const studentName = localStorage.getItem("studentName");
    const studentEmail = localStorage.getItem("studentEmail");

    const adminName = localStorage.getItem("adminName");
    const adminEmail = localStorage.getItem("adminEmail");

    if (studentName) {
        setText("displayName", studentName);
        setText("profileName", studentName);
        setText("profileEmail", studentEmail || "");
    }

    if (adminName) {
        setText("adminDisplayName", adminName);
        setText("adminProfileName", adminName);
        setText("adminProfileEmail", adminEmail || "");
    }

    hideElement("app");
    hideElement("adminApp");
    showElement("loginPage");

    if (role === "admin" || role === "student") {
        localStorage.removeItem("currentRole");
    }

    updateAdminCounts();
}


/* =====================================================
   24. SET TEXT SAFELY
===================================================== */

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


/* =====================================================
   25. RESTORE DARK MODE
===================================================== */

(function restoreTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
    }
})();


/* =====================================================
   26. GRADE ASSIGNMENT
===================================================== */

function gradeAssignment(button) {
    const row = button.closest("tr");

    if (!row) {
        return;
    }

    const assignment = row.cells[0].textContent;
    const course = row.cells[1].textContent;

    const marks = prompt(
        `Enter marks for ${assignment} (out of 100):`
    );

    if (marks === null || marks.trim() === "") {
        return;
    }

    const score = Number(marks);

    if (!Number.isFinite(score) || score < 0 || score > 100) {
        alert("Enter valid marks between 0 and 100.");
        return;
    }

    row.cells[3].innerHTML =
        `<span class="admin-status">${score}/100 - Graded</span>`;

    button.textContent = "Graded ✓";
    button.disabled = true;

    const table = document.getElementById("adminAssignmentTable");

    if (table) {
        localStorage.setItem(
            "assignmentGrades",
            table.innerHTML
        );
    }

    alert(
        `You have graded the course successfully!\n\n` +
        `Course: ${course}\n` +
        `Assignment: ${assignment}\n` +
        `Marks: ${score}/100`
    );
}


/* =====================================================
   27. RESTORE SAVED ASSIGNMENT GRADES
===================================================== */

onReady(function () {
    const savedGrades = localStorage.getItem("assignmentGrades");
    const table = document.getElementById("adminAssignmentTable");

    if (savedGrades && table) {
        table.innerHTML = savedGrades;
    }
});
/* =====================================================
   28. ASSIGNMENTS: ADMIN UPLOAD, STUDENT DOWNLOAD/SUBMIT
===================================================== */

onReady(function () {

    const KEY_ASSIGNMENTS = "eduAssignments";
    const KEY_SUBMISSIONS = "eduSubmissions";

    function load(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch (e) {
            return [];
        }
    }

    function save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            alert("File is too large to store in the browser. Please use smaller files (under 2 MB).");
            return false;
        }
    }

    function esc(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function readFile(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () {
                resolve({ name: file.name, data: reader.result });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function dueClass(due) {
        const days = (new Date(due) - new Date()) / 86400000;
        if (days < 1) return "red";
        if (days < 4) return "orange";
        return "green-text";
    }

    /* ---------- RENDER ---------- */

    function render() {
        const assignments = load(KEY_ASSIGNMENTS);
        const submissions = load(KEY_SUBMISSIONS);

        /* Student page */
        const studentList = document.getElementById("studentAssignmentList");

        if (studentList) {
            if (assignments.length === 0) {
                studentList.innerHTML =
                    '<div class="assignment"><div class="assignment-info">' +
                    '<p>No assignments uploaded yet.</p></div></div>';
            } else {
                studentList.innerHTML = assignments.map(function (a) {
                    const submitted = submissions.find(function (s) {
                        return s.assignmentId === a.id &&
                            s.student === (localStorage.getItem("studentEmail") || "");
                    });

                    const downloads = a.files.map(function (f, i) {
                        return '<a href="' + f.data + '" download="' + esc(f.name) + '">⬇ ' +
                            esc(f.name) + '</a>';
                    }).join("<br>");

                    return '' +
                        '<div class="assignment">' +
                        '  <div class="assignment-icon">📝</div>' +
                        '  <div class="assignment-info">' +
                        '    <h4>' + esc(a.title) + '</h4>' +
                        '    <p>' + esc(a.course) + '</p>' +
                        '    <p>' + downloads + '</p>' +
                        '    <span class="due ' + dueClass(a.due) + '">Due: ' + esc(a.due) + '</span>' +
                        (submitted
                            ? '<p class="upload-message">✔ Submitted: ' + esc(submitted.file.name) + '</p>'
                            : '') +
                        '  </div>' +
                        '  <input type="file" class="assignment-file" id="submit-' + a.id + '">' +
                        '  <button type="button" data-submit="' + a.id + '">' +
                        (submitted ? "Resubmit" : "Upload") + '</button>' +
                        '</div>';
                }).join("");
            }
        }

        /* Admin: uploaded assignments */
        const adminFiles = document.getElementById("adminAssignmentFiles");

        if (adminFiles) {
            adminFiles.innerHTML = assignments.length === 0
                ? "<p>No assignments uploaded yet.</p>"
                : assignments.map(function (a) {
                    return '' +
                        '<div class="assignment">' +
                        '  <div class="assignment-icon">📁</div>' +
                        '  <div class="assignment-info">' +
                        '    <h4>' + esc(a.title) + '</h4>' +
                        '    <p>' + esc(a.course) + ' | Due: ' + esc(a.due) + '</p>' +
                        '    <p>' + a.files.map(function (f) { return esc(f.name); }).join(", ") + '</p>' +
                        '  </div>' +
                        '  <button type="button" data-delete="' + a.id + '">Delete</button>' +
                        '</div>';
                }).join("");
        }

        /* Admin: student submissions */
        const adminSubs = document.getElementById("adminStudentSubmissions");

        if (adminSubs) {
            adminSubs.innerHTML = submissions.length === 0
                ? "<p>No student submissions yet.</p>"
                : submissions.map(function (s) {
                    const a = assignments.find(function (x) { return x.id === s.assignmentId; });
                    return '' +
                        '<div class="assignment">' +
                        '  <div class="assignment-icon">📥</div>' +
                        '  <div class="assignment-info">' +
                        '    <h4>' + esc(a ? a.title : "Deleted assignment") + '</h4>' +
                        '    <p>Student: ' + esc(s.studentName || s.student) + ' | ' + esc(s.time) + '</p>' +
                        '    <p><a href="' + s.file.data + '" download="' + esc(s.file.name) + '">⬇ ' +
                        esc(s.file.name) + '</a></p>' +
                        '  </div>' +
                        '</div>';
                }).join("");
        }
    }

    /* ---------- ADMIN: CREATE ASSIGNMENT ---------- */

    const form = document.getElementById("createAssignmentForm");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("newAssignmentTitle").value.trim();
            const course = document.getElementById("newAssignmentCourse").value.trim();
            const due = document.getElementById("newAssignmentDue").value;
            const fileInput = document.getElementById("teacherAssignmentFiles");

            const files = await Promise.all(Array.from(fileInput.files).map(readFile));

            const assignments = load(KEY_ASSIGNMENTS);
            assignments.push({
                id: String(Date.now()),
                title: title,
                course: course,
                due: due,
                files: files
            });

            if (save(KEY_ASSIGNMENTS, assignments)) {
                form.reset();
                render();
                alert("Assignment uploaded successfully!");
            }
        });
    }

    /* ---------- BUTTON CLICKS (student submit, admin delete) ---------- */

    document.addEventListener("click", async function (event) {
        const submitBtn = event.target.closest("[data-submit]");
        const deleteBtn = event.target.closest("[data-delete]");

        if (submitBtn) {
            const id = submitBtn.getAttribute("data-submit");
            const input = document.getElementById("submit-" + id);

            if (!input || input.files.length === 0) {
                alert("Please choose a file first.");
                return;
            }

            const file = await readFile(input.files[0]);
            const submissions = load(KEY_SUBMISSIONS);
            const email = localStorage.getItem("studentEmail") || "";

            const filtered = submissions.filter(function (s) {
                return !(s.assignmentId === id && s.student === email);
            });

            filtered.push({
                assignmentId: id,
                student: email,
                studentName: localStorage.getItem("studentName") || email,
                file: file,
                time: new Date().toLocaleString()
            });

            if (save(KEY_SUBMISSIONS, filtered)) {
                render();
            }
        }

        if (deleteBtn) {
            const id = deleteBtn.getAttribute("data-delete");

            if (confirm("Delete this assignment?")) {
                save(KEY_ASSIGNMENTS, load(KEY_ASSIGNMENTS).filter(function (a) {
                    return a.id !== id;
                }));
                save(KEY_SUBMISSIONS, load(KEY_SUBMISSIONS).filter(function (s) {
                    return s.assignmentId !== id;
                }));
                render();
            }
        }
    });

    window.addEventListener("storage", render);

    render();
});
/* STUDENT ASSIGNMENT UPLOAD */
onReady(function () {

    const KEY = "studentUploads";

    function getUploads() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "{}");
        } catch (e) {
            return {};
        }
    }

    function showMessage(id, fileName) {
        const msg = document.getElementById("msg-" + id);
        if (msg) msg.textContent = "✔ Uploaded: " + fileName;
    }

    // Restore earlier uploads
    const saved = getUploads();
    Object.keys(saved).forEach(function (id) {
        showMessage(id, saved[id]);
    });

    // Upload button click
    document.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-upload]");
        if (!btn) return;

        const id = btn.getAttribute("data-upload");
        const input = document.getElementById("file-" + id);

        if (!input || input.files.length === 0) {
            alert("Please choose a file first.");
            return;
        }

        const uploads = getUploads();
        uploads[id] = input.files[0].name;
        localStorage.setItem(KEY, JSON.stringify(uploads));

        showMessage(id, input.files[0].name);
        input.value = "";
    });
});
