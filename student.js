const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const dashboardPage = document.getElementById("dashboardPage");
const loginError = document.getElementById("loginError");

const demoStudent = {
    domainId: "STU2026001",
    password: "1234",
    attendance: [
        { subject: "Java Programming", present: 42, total: 48 },
        { subject: "Database Management", present: 40, total: 45 },
        { subject: "Mathematics", present: 38, total: 44 },
        { subject: "Operating Systems", present: 35, total: 42 },
        { subject: "Computer Networks", present: 41, total: 46 }
    ],
    marks: [
        { subject: "Java Programming", internal1: 42, internal2: 45 },
        { subject: "Database Management", internal1: 40, internal2: 43 },
        { subject: "Mathematics", internal1: 38, internal2: 41 },
        { subject: "Operating Systems", internal1: 44, internal2: 46 },
        { subject: "Computer Networks", internal1: 39, internal2: 42 }
    ]
};

let currentStudent = null;

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function getAttendancePercent(item) {
    return Math.round((item.present / item.total) * 100);
}

function getAverageMarks(item) {
    return Math.round((item.internal1 + item.internal2) / 2);
}

function getGrade(mark) {
    if (mark >= 90) return "A+";
    if (mark >= 80) return "A";
    if (mark >= 70) return "B";
    if (mark >= 60) return "C";
    return "D";
}

function showLogin() {
    dashboardPage.classList.add("hidden");
    loginScreen.classList.remove("hidden");
}

function showDashboard() {
    loginScreen.classList.add("hidden");
    dashboardPage.classList.remove("hidden");

    document.getElementById("headerName").textContent = currentStudent.name;
    document.getElementById("headerId").textContent = currentStudent.domainId;
    document.getElementById("welcomeName").textContent =
        "Hello, " + currentStudent.name + "!";

    renderDashboard();
    showPage("overview");
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const domainId = document.getElementById("domainId").value.trim();
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (
        domainId.toUpperCase() !== demoStudent.domainId ||
        password !== demoStudent.password
    ) {
        loginError.textContent =
            "Invalid Domain ID or password. Please try again.";
        return;
    }

    loginError.textContent = "";

    currentStudent = {
        name: name,
        domainId: domainId.toUpperCase(),
        department: department,
        year: year,
        email: email
    };

    showDashboard();
});

function renderDashboard() {
    const attendance = demoStudent.attendance;
    const marks = demoStudent.marks;

    const totalPresent = attendance.reduce(
        (sum, item) => sum + item.present, 0
    );
    const totalClasses = attendance.reduce(
        (sum, item) => sum + item.total, 0
    );
    const attendancePercent = Math.round(
        (totalPresent / totalClasses) * 100
    );

    const averageMarks = Math.round(
        marks.reduce((sum, item) => sum + getAverageMarks(item), 0) /
        marks.length
    );

    document.getElementById("attendanceStat").textContent =
        attendancePercent + "%";
    document.getElementById("marksStat").textContent = averageMarks + "%";
    document.getElementById("subjectsStat").textContent = marks.length;

    renderOverviewAttendance();
    renderOverviewMarks();
    renderAttendanceDetails();
    renderMarksTable();
    renderProfile();
}

function renderOverviewAttendance() {
    const container = document.getElementById("overviewAttendance");

    container.innerHTML = demoStudent.attendance.map(function (item) {
        const percent = getAttendancePercent(item);

        return `
            <div class="progress-row">
                <div class="progress-label">
                    <span>${escapeHTML(item.subject)}</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${percent}%"></div>
                </div>
            </div>
        `;
    }).join("");
}

function renderOverviewMarks() {
    const container = document.getElementById("overviewMarks");

    container.innerHTML = demoStudent.marks.map(function (item) {
        const average = getAverageMarks(item);

        return `
            <div class="mini-mark">
                <span>${escapeHTML(item.subject)}</span>
                <span class="mark-pill">${average}/50 · ${getGrade(average * 2)}</span>
            </div>
        `;
    }).join("");
}

function renderAttendanceDetails() {
    const container = document.getElementById("attendanceDetails");

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Present</th>
                        <th>Total Classes</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    ${demoStudent.attendance.map(function (item) {
                        const percent = getAttendancePercent(item);

                        return `
                            <tr>
                                <td>${escapeHTML(item.subject)}</td>
                                <td>${item.present}</td>
                                <td>${item.total}</td>
                                <td>${percent}%</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderMarksTable() {
    const container = document.getElementById("marksTable");

    container.innerHTML = demoStudent.marks.map(function (item) {
        const average = getAverageMarks(item);
        const percentage = average * 2;

        return `
            <tr>
                <td>${escapeHTML(item.subject)}</td>
                <td>${item.internal1}/50</td>
                <td>${item.internal2}/50</td>
                <td>${average}/50 (${percentage}%)</td>
                <td>${getGrade(percentage)}</td>
            </tr>
        `;
    }).join("");
}

function renderProfile() {
    const details = [
        ["Student Name", currentStudent.name],
        ["Domain / Register ID", currentStudent.domainId],
        ["Department", currentStudent.department],
        ["Academic Year", currentStudent.year],
        ["College Email", currentStudent.email],
        ["Portal Role", "Student"],
        ["Semester", "Current Semester"],
        ["Portal Status", "Active"]
    ];

    document.getElementById("profileDetails").innerHTML =
        details.map(function (item) {
            return `
                <div class="profile-item">
                    <span>${escapeHTML(item[0])}</span>
                    <strong>${escapeHTML(item[1])}</strong>
                </div>
            `;
        }).join("");
}

function showPage(pageName) {
    document.querySelectorAll(".page-section").forEach(function (section) {
        section.classList.add("hidden");
    });

    const selectedPage = document.getElementById("page-" + pageName);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-btn").forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    const titles = {
        overview: "Dashboard Overview",
        attendance: "Attendance Details",
        marks: "Marks & Grades",
        fees: "Fee Details",
        timetable: "Weekly Timetable",
        profile: "My Student Profile"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageName] || "Student ERP";
}

document.querySelectorAll(".nav-btn[data-page]").forEach(function (button) {
    button.addEventListener("click", function () {
        showPage(button.dataset.page);
    });
});

document.querySelectorAll("[data-goto]").forEach(function (button) {
    button.addEventListener("click", function () {
        showPage(button.dataset.goto);
    });
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    currentStudent = null;
    loginForm.reset();
    loginError.textContent = "";
    showLogin();
});