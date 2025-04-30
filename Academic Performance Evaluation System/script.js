document.addEventListener('DOMContentLoaded', function() {
    // Theme switching functionality
    const themeSwitch = document.getElementById('checkbox');
    const themeLabel = document.getElementById('theme-label');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
        themeLabel.textContent = 'Dark Mode';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeSwitch.checked = false;
        themeLabel.textContent = 'Light Mode';
    }
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Dark Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Light Mode';
        }
    });
    
    // Tab switching functionality
    const navItems = document.querySelectorAll('nav ul li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and tab contents
            navItems.forEach(navItem => navItem.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Settings tab switching
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsPanes = document.querySelectorAll('.settings-pane');
    
    settingsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
            settingsPanes.forEach(pane => pane.classList.remove('active'));
            
            this.classList.add('active');
            const paneId = this.getAttribute('data-settings-tab');
            document.getElementById(paneId).classList.add('active');
        });
    });
    
    // Search student functionality
    const searchBtn = document.getElementById('search-student');
    const studentIdInput = document.getElementById('student-id');
    
    searchBtn.addEventListener('click', function() {
        const studentId = studentIdInput.value.trim();
        
        if (studentId) {
            // Simulate fetching student data
            const studentData = getStudentData(studentId);
            
            if (studentData) {
                document.getElementById('student-name').textContent = studentData.name;
                document.getElementById('student-program').textContent = studentData.program;
                document.getElementById('student-status').textContent = studentData.status;
                document.getElementById('overall-cgpa').value = studentData.overallCGPA;
                document.getElementById('major-cgpa').value = studentData.majorCGPA;
                document.getElementById('failed-courses').value = studentData.failedCourses;
                
                // Highlight status
                const statusElement = document.getElementById('student-status');
                statusElement.className = 'info-value';
                if (studentData.status === 'Good Standing') {
                    statusElement.classList.add('status', 'good');
                } else if (studentData.status === 'Academic Warning') {
                    statusElement.classList.add('status', 'warning');
                } else if (studentData.status === 'Continue in Alternate') {
                    statusElement.classList.add('status', 'alternate');
                } else if (studentData.status === 'Dismissed') {
                    statusElement.classList.add('status', 'dismissed');
                }
            } else {
                alert('Student not found!');
            }
        } else {
            alert('Please enter a student ID');
        }
    });
    
    // Evaluation functionality
    const evaluateBtn = document.getElementById('evaluate-btn');
    
    evaluateBtn.addEventListener('click', function() {
        const overallCGPA = parseFloat(document.getElementById('overall-cgpa').value);
        const majorCGPA = parseFloat(document.getElementById('major-cgpa').value);
        const failedCourses = parseInt(document.getElementById('failed-courses').value);
        
        if (isNaN(overallCGPA)) {
            alert('Please enter a valid Overall CGPA');
            return;
        }
        
        if (isNaN(majorCGPA)) {
            alert('Please enter a valid Major CGPA');
            return;
        }
        
        if (isNaN(failedCourses)) {
            alert('Please enter a valid number of failed courses');
            return;
        }
        
        // Determine program requirements based on the student's program
        const program = document.getElementById('student-program').textContent;
        const requirements = getProgramRequirements(program);
        
        // Evaluate performance
        const evaluation = evaluatePerformance(overallCGPA, majorCGPA, failedCourses, requirements);
        
        // Display results
        document.getElementById('result-overall').textContent = overallCGPA.toFixed(2);
        document.getElementById('result-major').textContent = majorCGPA.toFixed(2);
        document.getElementById('result-failed').textContent = failedCourses;
        document.getElementById('result-requirements').textContent = `Overall: ${requirements.minOverallCGPA}, Major: ${requirements.minMajorCGPA}, Max Failed: ${requirements.maxFailedCourses}`;
        
        const resultStatus = document.getElementById('result-status');
        resultStatus.textContent = evaluation.status;
        resultStatus.className = 'result-value';
        
        if (evaluation.status === 'Good Standing') {
            resultStatus.classList.add('status', 'good');
        } else if (evaluation.status === 'Academic Warning') {
            resultStatus.classList.add('status', 'warning');
        } else if (evaluation.status === 'Continue in Alternate') {
            resultStatus.classList.add('status', 'alternate');
        } else if (evaluation.status === 'Dismissed from Program') {
            resultStatus.classList.add('status', 'dismissed');
        }
        
        document.getElementById('result-recommendation').textContent = evaluation.recommendation;
        
        // Show evaluation result section
        document.getElementById('evaluation-result').style.display = 'block';
    });
    
    // Report generation functionality
    const generateReportBtn = document.getElementById('generate-report');
    
    generateReportBtn.addEventListener('click', function() {
        const reportType = document.getElementById('report-type').value;
        const program = document.getElementById('program-filter').value;
        const year = document.getElementById('year-filter').value;
        
        // Update report title and meta
        let reportTitle = '';
        let programName = '';
        
        switch (reportType) {
            case 'status-summary':
                reportTitle = 'Status Summary Report';
                break;
            case 'warning-list':
                reportTitle = 'Academic Warning List';
                break;
            case 'dismissal-list':
                reportTitle = 'Dismissal List';
                break;
            case 'alternate-list':
                reportTitle = 'Alternate Program Recommendation List';
                break;
        }
        
        switch (program) {
            case 'all':
                programName = 'All Programs';
                break;
            case 'cs':
                programName = 'Computer Science';
                break;
            case 'ee':
                programName = 'Electrical Engineering';
                break;
            case 'me':
                programName = 'Mechanical Engineering';
                break;
            case 'ba':
                programName = 'Business Administration';
                break;
        }
        
        document.getElementById('report-title').textContent = reportTitle;
        document.getElementById('report-program').textContent = programName;
        document.getElementById('report-year').textContent = `${year}-${parseInt(year)+1} Academic Year`;
        
        // Simulate report content update based on filters
        updateReportContent(reportType, program, year);
    });
    
    // Helper functions
    function getStudentData(studentId) {
        // Simulated student database
        const students = {
            'S1001': {
                name: 'John Smith',
                program: 'Computer Science',
                status: 'Good Standing',
                overallCGPA: 3.45,
                majorCGPA: 3.60,
                failedCourses: 1
            },
            'S1002': {
                name: 'Emily Johnson',
                program: 'Electrical Engineering',
                status: 'Academic Warning',
                overallCGPA: 2.85,
                majorCGPA: 2.70,
                failedCourses: 3
            },
            'S1003': {
                name: 'Michael Brown',
                program: 'Mechanical Engineering',
                status: 'Continue in Alternate',
                overallCGPA: 1.95,
                majorCGPA: 1.80,
                failedCourses: 5
            },
            'S1004': {
                name: 'Sarah Davis',
                program: 'Business Administration',
                status: 'Dismissed',
                overallCGPA: 1.65,
                majorCGPA: 1.50,
                failedCourses: 7
            },
            'S1005': {
                name: 'David Wilson',
                program: 'Computer Science',
                status: 'Good Standing',
                overallCGPA: 3.20,
                majorCGPA: 3.35,
                failedCourses: 0
            }
        };
        
        return students[studentId] || null;
    }
    
    function getProgramRequirements(program) {
        // Default requirements
        const requirements = {
            minOverallCGPA: 2.0,
            minMajorCGPA: 2.0,
            maxFailedCourses: 2
        };
        
        // Program-specific requirements
        if (program.includes('Computer Science')) {
            requirements.minMajorCGPA = 2.3;
        } else if (program.includes('Electrical Engineering')) {
            requirements.minMajorCGPA = 2.2;
        } else if (program.includes('Mechanical Engineering')) {
            requirements.minMajorCGPA = 2.1;
        }
        
        return requirements;
    }
    
    function evaluatePerformance(overallCGPA, majorCGPA, failedCourses, requirements) {
        let status = '';
        let recommendation = '';
        
        if (overallCGPA >= requirements.minOverallCGPA && 
            majorCGPA >= requirements.minMajorCGPA && 
            failedCourses <= requirements.maxFailedCourses) {
            status = 'Good Standing';
            recommendation = 'Continue in current program';
        } 
        else if (overallCGPA >= 1.7 && majorCGPA >= 1.7) {
            status = 'Academic Warning';
            recommendation = 'Academic probation. Student must improve performance in next semester.';
        }
        else if (overallCGPA >= 1.5 || majorCGPA >= 1.5) {
            status = 'Continue in Alternate';
            recommendation = 'Recommend transfer to alternate program based on student strengths.';
        }
        else {
            status = 'Dismissed from Program';
            recommendation = 'Initiate dismissal process. Student may reapply after one year.';
        }
        
        return {
            status,
            recommendation
        };
    }
    
    function updateReportContent(reportType, program, year) {
        // In a real application, this would fetch data from a server
        // For demo purposes, we'll just simulate different report content
        
        const reportContent = document.getElementById('report-content');
        
        if (reportType === 'status-summary') {
            // Simulate different data based on filters
            let totalStudents = 1248;
            let goodStanding = 1012;
            let academicWarning = 156;
            let alternateProgram = 64;
            let dismissed = 16;
            
            if (program !== 'all') {
                totalStudents = 300 + Math.floor(Math.random() * 200);
                goodStanding = Math.floor(totalStudents * 0.8);
                academicWarning = Math.floor(totalStudents * 0.15);
                alternateProgram = Math.floor(totalStudents * 0.04);
                dismissed = Math.floor(totalStudents * 0.01);
            }
            
            const goodStandingPercent = (goodStanding / totalStudents * 100).toFixed(1);
            const warningPercent = (academicWarning / totalStudents * 100).toFixed(1);
            const alternatePercent = (alternateProgram / totalStudents * 100).toFixed(1);
            const dismissedPercent = (dismissed / totalStudents * 100).toFixed(1);
            
            reportContent.innerHTML = `
                <div class="report-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Students:</span>
                        <span class="summary-value">${totalStudents}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Good Standing:</span>
                        <span class="summary-value">${goodStanding} (${goodStandingPercent}%)</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Academic Warning:</span>
                        <span class="summary-value">${academicWarning} (${warningPercent}%)</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Alternate Program:</span>
                        <span class="summary-value">${alternateProgram} (${alternatePercent}%)</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Dismissed:</span>
                        <span class="summary-value">${dismissed} (${dismissedPercent}%)</span>
                    </div>
                </div>
                
                <div class="report-chart">
                    <div class="chart-bar" style="--value:${goodStandingPercent}%; --color:var(--success-color);">
                        <span>Good Standing</span>
                        <div class="bar"></div>
                        <span>${goodStandingPercent}%</span>
                    </div>
                    <div class="chart-bar" style="--value:${warningPercent}%; --color:var(--warning-color);">
                        <span>Academic Warning</span>
                        <div class="bar"></div>
                        <span>${warningPercent}%</span>
                    </div>
                    <div class="chart-bar" style="--value:${alternatePercent}%; --color:var(--alternate-color);">
                        <span>Alternate Program</span>
                        <div class="bar"></div>
                        <span>${alternatePercent}%</span>
                    </div>
                    <div class="chart-bar" style="--value:${dismissedPercent}%; --color:var(--danger-color);">
                        <span>Dismissed</span>
                        <div class="bar"></div>
                        <span>${dismissedPercent}%</span>
                    </div>
                </div>
            `;
        } else {
            // For list-type reports, show a table
            const students = generateStudentList(reportType, program, year);
            
            let tableHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>Overall CGPA</th>
                            <th>Major CGPA</th>
                            <th>Failed Courses</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            students.forEach(student => {
                tableHtml += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.program}</td>
                        <td>${student.overallCGPA.toFixed(2)}</td>
                        <td>${student.majorCGPA.toFixed(2)}</td>
                        <td>${student.failedCourses}</td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            reportContent.innerHTML = tableHtml;
        }
    }
    
    function generateStudentList(reportType, program, year) {
        // Simulate generating a list of students based on report type and filters
        const programs = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration'];
        const statuses = ['Good Standing', 'Academic Warning', 'Continue in Alternate', 'Dismissed'];
        
        // Filter programs if needed
        const filteredPrograms = program === 'all' ? programs : [programs[['all', 'cs', 'ee', 'me', 'ba'].indexOf(program) - 1]];
        
        // Generate random student data
        const count = 5 + Math.floor(Math.random() * 10);
        const students = [];
        
        for (let i = 0; i < count; i++) {
            const prog = filteredPrograms[Math.floor(Math.random() * filteredPrograms.length)];
            
            // Generate appropriate CGPAs based on report type
            let overallCGPA, majorCGPA, failedCourses;
            
            if (reportType === 'warning-list') {
                overallCGPA = 1.7 + Math.random() * 0.3;
                majorCGPA = 1.7 + Math.random() * 0.3;
                failedCourses = 3 + Math.floor(Math.random() * 3);
            } else if (reportType === 'dismissal-list') {
                overallCGPA = 1.0 + Math.random() * 0.7;
                majorCGPA = 1.0 + Math.random() * 0.7;
                failedCourses = 5 + Math.floor(Math.random() * 5);
            } else if (reportType === 'alternate-list') {
                overallCGPA = 1.5 + Math.random() * 0.4;
                majorCGPA = 1.5 + Math.random() * 0.4;
                failedCourses = 4 + Math.floor(Math.random() * 3);
            } else {
                overallCGPA = 2.0 + Math.random() * 2.0;
                majorCGPA = 2.0 + Math.random() * 2.0;
                failedCourses = Math.floor(Math.random() * 3);
            }
            
            students.push({
                id: 'S' + (2000 + Math.floor(Math.random() * 1000)),
                name: generateRandomName(),
                program: prog,
                overallCGPA,
                majorCGPA,
                failedCourses
            });
        }
        
        return students;
    }
    
    function generateRandomName() {
        const firstNames = ['John', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'Robert', 'Jennifer', 'William', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Taylor', 'Anderson', 'Thomas', 'Jackson'];
        
        return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + 
               lastNames[Math.floor(Math.random() * lastNames.length)];
    }
});