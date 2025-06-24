// Entry point
// =====================
document.addEventListener('DOMContentLoaded', () => main());

async function main() {
    console.log('[DEBUG] powered by v2ai.js.');
    setupButtonListeners();
    const data = await fetchData();
    renderElements(data);
}

// Button Listeners
// =====================
function setupButtonListeners() {
    const buttonIds = ['buttonDarkMode', 'buttonBorder', 'buttonSimpleView', 'buttonNuke', 'buttonCola', 'buttonUpdateDb', 'buttonGitHub', 'buttonReservedFeature'];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log(`[DEBUG] Button '${btn.id.split('button')[1]}': ${btn.checked}`);
                if (btn.id === 'buttonDarkMode') onDarkModeClicked();
                else if (btn.id === 'buttonBorder') onBorderClicked();
                else if (btn.id === 'buttonSimpleView') onSimpleViewClicked();
                else if (btn.id === 'buttonNuke') onNukeClicked();
                else if (btn.id === 'buttonCola') onColaClicked();
                else if (btn.id === 'buttonUpdateDb') onUpdateDbClicked();
                else if (btn.id === 'buttonGitHub') onGitHubClicked();
                else if (btn.id === 'buttonReservedFeature') onReservedFeatureClicked();
                else {
                    // Fallback for any unhandled button
                }
            });
        }
    });
}

// Data Fetching
// =====================
async function fetchData() {
    const response = await fetch('/rq1/data');
    return response.json();
}

// Render UI
// =====================
function renderElements(data) {
    renderButtons(data.packages);
    renderTable(data.headers, data.data);
    setFixedColumns();
    evaluateData();
}

function renderButtons(buttonTexts) {
    const divPackages = document.getElementById('btnPackageGroup');
    if (!divPackages) return;
    divPackages.innerHTML = '';
    const fragment = document.createDocumentFragment();
    buttonTexts.forEach(text => fragment.appendChild(createButton(text)));
    divPackages.appendChild(fragment);
    // Border radius classes
    if (buttonTexts.length > 0) {
        const firstBtn = document.getElementById('btn' + capitalize(textOrEmpty(buttonTexts[0])));
        const lastBtn = document.getElementById('btn' + capitalize(textOrEmpty(buttonTexts[buttonTexts.length - 1])));
        if (firstBtn) firstBtn.classList.add('btn-first');
        if (lastBtn) lastBtn.classList.add('btn-last');
    }
}

function createButton(text) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary btn-package';
    btn.textContent = text;
    btn.id = 'btn' + capitalize(textOrEmpty(text));
    btn.onclick = () => {
        fetch(`/rq1/data/${text}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(res => res.json())
            .then(data => renderElements(data));
    };
    return btn;
}

function renderTable(headers, data) {
    const tableContainer = document.getElementById('tableRq1Container');
    if (!tableContainer) return;
    let table = document.getElementById('tableRq1');
    if (table) table.remove();
    table = document.createElement('table');
    table.id = 'tableRq1';
    table.className = 'table table-bordered table-hover';
    table.style.borderColor = 'transparent';
    table.appendChild(createTableHeaders(headers, data));
    table.appendChild(createTableBody(headers, data));
    tableContainer.appendChild(table);
}

function createTableHeaders(headers, data) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.appendChild(createTableHeader('No.'));
    headers.forEach((header, colIdx) => {
        const th = createTableHeader(header);
        th.appendChild(createColumnFilterDropdown(data.map(row => row[colIdx]), colIdx + 1));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    return thead;
}

function createTableHeader(text) {
    const th = document.createElement('th');
    th.textContent = capitalize(textOrEmpty(text));
    return th;
}

function createTableBody(headers, data) {
    const tbody = document.createElement('tbody');
    data.forEach((rowData, rowIdx) => {
        const row = document.createElement('tr');
        row.appendChild(createTableCell(rowIdx + 1));
        rowData.forEach((cellData, colIdx) => row.appendChild(createTableCell(cellData, headers[colIdx])));
        tbody.appendChild(row);
    });
    return tbody;
}

function createTableCell(data, className) {
    const td = document.createElement('td');
    td.textContent = data;
    if (className) td.className = className.toLowerCase() || 'null';
    return td;
}

// Column Filter Dropdown
// =====================
function createColumnFilterDropdown(data, idx) {
    const dropDownDiv = document.createElement('div');
    dropDownDiv.className = 'filter-dropdown';
    dropDownDiv.setAttribute('data-column', idx);

    // Search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search...';
    searchBox.className = 'filter-search-box';
    searchBox.addEventListener('input', () => filterDropdownOptions(dropDownDiv, searchBox.value));
    dropDownDiv.appendChild(searchBox);

    // Unique values
    const unique = ['All', ...Array.from(new Set(data.filter(x => x !== undefined && x !== null && x !== ''))).sort()];
    unique.forEach(item => dropDownDiv.appendChild(createCheckbox(item)));

    // Event listeners
    const checkboxAll = dropDownDiv.querySelector('label.select-all input[type="checkbox"]');
    if (checkboxAll) {
        checkboxAll.addEventListener('change', () => onSelectAllCheckboxChange(dropDownDiv));
    }
    dropDownDiv.querySelectorAll('input[type="checkbox"]:not([value="All"])').forEach(checkbox => {
        checkbox.addEventListener('change', () => onCheckboxChange(dropDownDiv));
    });
    return dropDownDiv;
}

function filterDropdownOptions(dropdown, searchValue) {
    const filter = searchValue.trim().toLowerCase();

    dropdown.querySelectorAll('label').forEach(label => {
        if (label.classList.contains('select-all')) return;
        const text = label.textContent.toLowerCase();
        label.style.display = text.includes(filter) ? '' : 'none';
    });
}

function createCheckbox(labelText) {
    const label = document.createElement('label');

    if (labelText === 'All') label.className = 'select-all';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.value = labelText;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(labelText));
    return label;
}

// Filter Logic
// =====================
function onSelectAllCheckboxChange(dropdown) {
    const allCheckbox = dropdown.querySelector('label.select-all input[type="checkbox"]');
    const checkboxes = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:not([value="All"])'));
    const th = document.querySelector(`#tableRq1 thead th:nth-child(${Number(dropdown.dataset.column) + 1})`);
    if (allCheckbox.checked) {
        console.log(`[DEBUG] Select All checkbox of col ${dropdown.dataset.column} checked` + th);
        if (th) {
            th.style.color = ''; // Reset text color
            th.style.backgroundColor = ''; // Show the column header
        }
        checkboxes.forEach(checkbox => { checkbox.checked = true; });
        document.querySelectorAll('#tableRq1 tbody tr').forEach(row => { row.style.display = ''; });
    } else {
        console.log(`[DEBUG] Select All checkbox of col ${dropdown.dataset.column} unchecked` + th);
        if (th) {
            th.style.color = 'black'; // Hide text color
            th.style.backgroundColor = '#FFE699'; // Hide the column header
        }
        checkboxes.forEach(checkbox => { checkbox.checked = false; });
    }
}

function onCheckboxChange(dropdown) {
    const columnIndex = parseInt(dropdown.dataset.column, 10);
    const selectedValues = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    document.querySelectorAll('#tableRq1 tbody tr').forEach(row => {
        const cell = row.cells[columnIndex];
        if (selectedValues.includes('All')) {
            row.style.display = '';
        } else {
            row.style.display = (cell && selectedValues.includes(cell.textContent)) ? '' : 'none';
        }
    });
}

// Utilities
// =====================
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function textOrEmpty(str) {
    return typeof str === 'string' ? str : '';
}

// Dark Mode & Border Toggle
// =====================
function onDarkModeClicked() {
    document.body.classList.toggle('dark-mode');
    const darkModeLabel = document.querySelector('label[for="buttonDarkMode"] i');
    if (darkModeLabel) {
        if (document.body.classList.contains('dark-mode')) {
            darkModeLabel.classList.remove('bi-moon');
            darkModeLabel.classList.add('bi-sun');
        } else {
            darkModeLabel.classList.remove('bi-sun');
            darkModeLabel.classList.add('bi-moon');
        }
    }
}

function onBorderClicked() {
    const table = document.getElementById('tableRq1');
    if (table) {
        table.classList.toggle('border-transparent');
    }
    // Toggle icon between bi-border and bi-border-all
    const borderIcon = document.querySelector('label[for="buttonBorder"] i');
    if (borderIcon) {
        if (table && table.classList.contains('border-transparent')) {
            borderIcon.classList.remove('bi-border-all');
            borderIcon.classList.add('bi-border');
        } else {
            borderIcon.classList.remove('bi-border');
            borderIcon.classList.add('bi-border-all');
        }
    }
}

function onSimpleViewClicked() {
    alert('This feature is under development!');
}

function onNukeClicked() {
    alert('Whoosh!');
    window.open('https://www.youtube.com/shorts/NLpMWs2Uq58', '_blank');
    window.focus();
}

function onColaClicked() {
    window.open('https://www.youtube.com/watch?v=qnSZMDmUpa4', '_blank');
    window.focus();
}

function onUpdateDbClicked(){
    alert('This feature is under development!');
}

function onGitHubClicked() {
    window.open('https://github.com/m4tice/rq1-server', '_blank');
}

function onReservedFeatureClicked() {
    alert('This button is reserved for future development!');
}

// Table Column Widths
// =====================
function setFixedColumns() {
    const widths = [34, 102, 280, 82, 89, 147, 109, 108, 94, 100, 70, 84, 112, 65];
    widths.forEach((width, index) => {
        const th = document.querySelector(`#tableRq1 thead th:nth-child(${index + 1})`);
        if (th) {
            th.style.width = `${width}px`;
            th.style.minWidth = `${width}px`;
        }
        const td = document.querySelectorAll(`#tableRq1 tbody td:nth-child(${index + 1})`);
        td.forEach(cell => {
            cell.style.width = `${width}px`;
            cell.style.minWidth = `${width}px`;
        });
    });
}

// Table Data Evaluation
// =====================
function evaluateData() {
    const tableRq1 = document.getElementById('tableRq1');
    evaluateLcs(tableRq1);
    evaluateAllocationAndDoor(tableRq1);
}

function evaluateLcs(table) {
    if (!table) return;
    const colorMap = {
        'Evaluated': '#FFE699',
        'Conflicted': '#FFC000'
    };
    Array.from(table.getElementsByClassName('lifecyclestate')).forEach(element => {
        const color = colorMap[element.textContent];
        if (color) {
            element.style.color = 'black';
            element.style.backgroundColor = color;
            element.style.fontWeight = 'bold';
        }
    });
}

function evaluateCategory(table) {
    // Reserved for future logic
}

function evaluateAllocationAndDoor(table) {
    if (!table) return;
    const dataAllocation = table.getElementsByClassName('allocation');
    const dataDoors = table.getElementsByClassName('doors');

    for (let i = 0; i < dataAllocation.length; i++) {
        const allocation = dataAllocation[i];
        const doors = dataDoors[i];
        if (allocation.textContent === 'None') {
            allocation.style.color = 'black';
            allocation.style.backgroundColor = '#FFC000';
            allocation.style.fontWeight = 'bold';
        } else if (allocation.textContent === 'Software' && doors && doors.textContent === 'None') {
            cssNullItem(doors);
        }
    }
}

function cssNullItem(item) {
    Object.assign(item.style, {
        backgroundColor: '#FF7C80',
        color: 'white',
        fontWeight: 'bold'
    });
}
