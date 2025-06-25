document.addEventListener('DOMContentLoaded', function () {
    main();
});

async function main() {
    console.log('[DEBUG] powered by v2.js.');
    onButtonClick();
    const data = await fetchData();
    createElements(data);
}

function onButtonClick() {
    const buttonDarkMode = document.getElementById('buttonDarkMode');
    const buttonDebug = document.getElementById('buttonDebug');
    const buttonSetting1 = document.getElementById('buttonSetting1');
    const buttonSetting2 = document.getElementById('buttonSetting2');

    buttons = [buttonDarkMode, buttonDebug, buttonSetting1, buttonSetting2];
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            console.log("[DEBUG] Button '" + button.id.split("button")[1] + "': " + button.checked);
        });
    });
}

function createElements(data) {
    const packages = data.packages;
    const headers = data.headers;
    const tableData = data.data;

    createButtons(packages);
    createTable(headers, tableData);
}

async function fetchData() {
    const response = await fetch('/rq1/data');
    const data = await response.json();

    return data;
}

function createButtons(buttonTexts) {
    const divPackages = document.getElementById('btnPackageGroup');

    while (divPackages.firstChild) {
        divPackages.removeChild(divPackages.firstChild);
    }

    buttonTexts.forEach(buttonText => {
        const button = createButton(buttonText);
        divPackages.appendChild(button);
    });

    // Handle first and last button styles, i.e., border radius
    const firstPackageButton = document.getElementById('btn' + createFirstCharUpperCase(buttonTexts[0]));
    const lastPackageButton = document.getElementById('btn' + createFirstCharUpperCase(buttonTexts[buttonTexts.length - 1]));
    firstPackageButton.classList.add('btn-first');
    lastPackageButton.classList.add('btn-last');
}

function createButton(buttonText) {
    const button = document.createElement('button');
    button.className = 'btn btn-primary btn-package';
    button.textContent = buttonText;
    button.id = 'btn' + createFirstCharUpperCase(buttonText);

    button.onclick = function () {
        fetch(`/rq1/data/${buttonText}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                createElements(data);
            });
    }

    return button;
}

function createTable(headers, data) {
    /*
    create a table with <thead> and <tbody> elements.
    */
    // If the table already exists, remove it before creating a new one
    if (document.querySelector('#tableRq1')) {
        document.querySelector('#tableRq1').remove();
    }

    const tableRq1 = document.createElement('table');
    tableRq1.id = 'tableRq1';
    tableRq1.className = 'table table-borderless table-hover';

    const tableRq1Container = document.getElementById('tableRq1Container');
    tableRq1Container.appendChild(tableRq1);

    const thead = createTableHeaders(headers, data);
    const tbody = createTableBody(data);
    tableRq1.appendChild(thead);
    tableRq1.appendChild(tbody);

    // createFilterDropdown(headers, data);
}

function createTableHeaders(headers, data) {
    /*
    create <thead> of the table with <th> elements for each header.
    */
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create a header for the row index, i.e., "No."
    thNo = createTableHeader('No.');
    headerRow.appendChild(thNo);

    headers.forEach((headerText, colIdx) => {
        const th = createTableHeader(headerText);
        const filterDropdown = createColumnFilterDropdown(data.map(row => row[colIdx]), colIdx + 1);
        th.appendChild(filterDropdown);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;

}

function createTableHeader(headerText) {
    /*
    create <th> for <thead> of the table.
    */

    const th = document.createElement('th');
    th.textContent = createFirstCharUpperCase(headerText);

    return th;
}

function createTableBody(data) {
    /*
    create <tbody> of the table
    */
    const tbody = document.createElement('tbody');

    data.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        const trIndex = createTableCell(rowIndex + 1); // Row index starts from 1
        row.appendChild(trIndex); // Add the row index as the first cell
        rowData.forEach(cellData => {
            const td = createTableCell(cellData);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    return tbody;
}

function createTableCell(cellData) {
    // create a <td> element for <tr> of the <tbody>
    const td = document.createElement('td');
    td.textContent = cellData;

    return td;
}

function createFirstCharUpperCase(str) {
    /*
    createFirstCharUpperCase takes a string and returns it with the first character in uppercase and the rest in lowercase.
    This is useful for creating consistent button IDs and table headers.
    Example: "example" becomes "Example".
    If the string is empty, it returns 'undefined'.
    */
    if (str.length === 0) {
        return undefined;
    }
    else if (str.length === 1) {
        return str.toUpperCase();
    }
    else if (str.length > 1) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

function createFilterDropdown(headers, data) {
    const thead = document.querySelector('#tableRq1 thead');
    const filterRow = document.createElement('tr');

    const thNoFilter = document.createElement('th');
    filterRow.appendChild(thNoFilter);

    headers.forEach((header, colIdx) => {
        // Create dropdown filter elements for each header
        const th = document.createElement('th');

        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        select.style.fontSize = 'xx-small';

        // retrive unique items in the column
        const headerFilterData = ['All', ...getUniqueColumnItems(data, colIdx)];
        headerFilterData.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });

        select.addEventListener('change', function () {
            const selectedValue = this.value;
            const tbody = document.querySelector('#tableRq1 tbody');
            tbody.innerHTML = ''; // Clear existing rows

            // Attention: Performance
            // Remarks  : may be slow for large datasets
            let filterIdx = 0;
            data.forEach(rowData => {
                if (selectedValue === 'All' || rowData[colIdx] === selectedValue) {
                    filterIdx++;
                    const row = document.createElement('tr');
                    const trIndex = createTableCell(filterIdx); // Row index starts from 1
                    row.appendChild(trIndex); // Add the row index as the first cell

                    // Add the row data cells
                    // Attention: Performance
                    rowData.forEach(cellData => {
                        const td = createTableCell(cellData);
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                }
            });
        });
        th.appendChild(select);
        filterRow.appendChild(th);
    });
    thead.appendChild(filterRow);
}

function createColumnFilterDropdown(data, idx) {
    const dropDownDiv = document.createElement('div');
    dropDownDiv.className = 'filter-dropdown';
    dropDownDiv.setAttribute('data-column', idx);

    const unique = ['All', ...Array.from(new Set(data.filter(x => x !== undefined && x !== null && x !== '')))];

    unique.forEach(item => {
        const filterElement = createCheckbox(item);
        dropDownDiv.appendChild(filterElement);
    });

    const checkboxAll = dropDownDiv.querySelector('label.select-all input[type="checkbox"]');
    checkboxAll.addEventListener('change', function () {
        onSelectAllCheckboxChange(dropDownDiv);
    });

    const checkboxes = dropDownDiv.querySelectorAll('input[type="checkbox"]:not([value="All"])');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            onCheckboxChange(dropDownDiv);
        });
    });
    return dropDownDiv;
}

function createCheckbox(labelText) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');

    if (labelText === 'All') {
        label.className = 'select-all';
    }

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
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Check all checkboxes if 'All' is selected
            document.querySelectorAll('#tableRq1 tbody tr').forEach(row => {
                row.style.display = ''; // Show all rows
            });
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Uncheck all checkboxes if 'All' is not selected
        });
    }
}

function onCheckboxChange(dropdown) {
    const columnIndex = parseInt(dropdown.dataset.column, 10);
    const selectedValues = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);


    document.querySelectorAll('#tableRq1 tbody tr').forEach(row => {
        const cell = row.cells[columnIndex];

        if (selectedValues.includes('All')) {
            row.style.display = ''; // Show the row if 'All' is selected
            return;
        }

        else {
            if (cell && selectedValues.includes(cell.textContent)) {
                row.style.display = ''; // Show the row
            }
            else {
                row.style.display = 'none'; // Hide the row
            }
        }
    });
}

function getUniqueColumnItems(data, colIdx) {
    /*
    getUniqueColumnItems takes a 2D array (data) and a column index (colIdx).
    It returns a sorted array of unique items in the specified column.
    */
    const columnData = data.map(row => row[colIdx]);
    const uniqueItems = [...new Set(columnData)];

    // Attention: Performance
    // Remarks  : may be slow for large datasets
    return uniqueItems.sort((a, b) => a.localeCompare(b));
}