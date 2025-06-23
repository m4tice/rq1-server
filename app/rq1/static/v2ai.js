document.addEventListener('DOMContentLoaded', () => main());

async function main() {
    console.log('[DEBUG] powered by v2ai.js.');
    setupButtonListeners();
    const data = await fetchData();
    renderElements(data);
}

function setupButtonListeners() {
    const buttonIds = ['buttonDarkMode', 'buttonDebug', 'buttonSetting1', 'buttonSetting2'];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log(`[DEBUG] Button '${btn.id.split('button')[1]}': ${btn.checked}`);
            });
        }
    });
}

async function fetchData() {
    const response = await fetch('/rq1/data');
    return response.json();
}

function renderElements(data) {
    renderButtons(data.packages);
    renderTable(data.headers, data.data);
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
    table.className = 'table table-borderless table-hover';
    table.appendChild(createTableHeaders(headers, data));
    table.appendChild(createTableBody(data));
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

function createTableBody(data) {
    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();
    data.forEach((rowData, rowIdx) => {
        const row = document.createElement('tr');
        row.appendChild(createTableCell(rowIdx + 1));
        rowData.forEach(cellData => row.appendChild(createTableCell(cellData)));
        fragment.appendChild(row);
    });
    tbody.appendChild(fragment);
    return tbody;
}

function createTableCell(data) {
    const td = document.createElement('td');
    td.textContent = data;
    return td;
}

function createColumnFilterDropdown(data, idx) {
    const dropDownDiv = document.createElement('div');
    dropDownDiv.className = 'filter-dropdown';
    dropDownDiv.setAttribute('data-column', idx);

    // Create search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search...';
    searchBox.className = 'filter-search-box';
    searchBox.addEventListener('input', () => filterDropdownOptions(dropDownDiv, searchBox.value));
    dropDownDiv.appendChild(searchBox);

    const unique = ['All', ...Array.from(new Set(data.filter(x => x !== undefined && x !== null && x !== ''))).sort()];
    unique.forEach(item => dropDownDiv.appendChild(createCheckbox(item)));

    const checkboxAll = dropDownDiv.querySelector('label.select-all input[type="checkbox"]');
    if (checkboxAll) {
        checkboxAll.addEventListener('change', () => onSelectAllCheckboxChange(dropDownDiv));
    }
    dropDownDiv.querySelectorAll('input[type="checkbox"]:not([value="All"])').forEach(checkbox => {
        checkbox.addEventListener('change', () => onCheckboxChange(dropDownDiv));
    });
    return dropDownDiv;
}

// Helper to filter dropdown options based on search
function filterDropdownOptions(dropdown, searchValue) {
    const filter = searchValue.trim().toLowerCase();
    dropdown.querySelectorAll('label').forEach(label => {
        if (label.classList.contains('select-all')) return; // Always show 'All'
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

function onSelectAllCheckboxChange(dropdown) {
    const allCheckbox = dropdown.querySelector('label.select-all input[type="checkbox"]');
    const checkboxes = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:not([value="All"])'));
    if (allCheckbox.checked) {
        checkboxes.forEach(checkbox => { checkbox.checked = true; });
        document.querySelectorAll('#tableRq1 tbody tr').forEach(row => { row.style.display = ''; });
    } else {
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

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function textOrEmpty(str) {
    return typeof str === 'string' ? str : '';
}