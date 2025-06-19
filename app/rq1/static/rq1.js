// Global variable for user settings
let DEBUG = false;
let BILLED = false;

document.addEventListener('DOMContentLoaded', function () {
    fetchData();
    applyResponsiveTableStyles();

    // Settings button handler
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
        });
        // Hide menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
                settingsMenu.style.display = 'none';
            }
        });
    }

    const billedToggle = document.getElementById('billedToggle');
    if (billedToggle) {
        billedToggle.addEventListener('click', function () {
            if (billedToggle.checked) {
                BILLED = true;
                fetchData();
            } else {
                BILLED = false;
                fetchData();
            }
        });
    }

    window.addEventListener('resize', function () {
        applyResponsiveTableStyles();
    });
});

function fetchData() {
    fetch('/rq1/data')
        .then(response => response.json())
        .then(data => {

            // User settings
            const SETTINGS = data.settings;

            // Default to false if not set
            DEBUG = SETTINGS.DEBUG || false;
            // BILLED = SETTINGS.BILLED || false;

            // Create foundation for the page
            createFoundation(SETTINGS);

            // Create buttons - corresponding to packages
            createButtons(data.packages);

            // Create table with headers and data
            createTable(data.headers, data.data);

            // Adding CSS styles to the table
            styleTable();
        });
}

function createFoundation(settings) {
    const BACKGROUND_URL = settings.BACKGROUND_URL || null;

    if (DEBUG) {
        console.log("[DEBUG] Background URL: " + BACKGROUND_URL);
    }

    // Setting background as per user settings
    if (BACKGROUND_URL && BACKGROUND_URL !== "None") {
        document.body.style.background = `url('${BACKGROUND_URL}') no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
    }
}


function createButtons(button_names) {
    if (document.querySelector('.container-buttons')) {
        document.querySelector('.container-buttons').remove();
    }

    const divCont = document.createElement('div');
    divCont.className = 'container container-buttons';

    const divRow = document.createElement('div');
    divRow.className = 'row';
    button_names.forEach(name => {
        divRow.appendChild(createButton(name));
    });

    divCont.appendChild(divRow);
    document.body.appendChild(divCont);
}

function createButton(button_name) {
    const divButton = document.createElement('div');
    divButton.className = 'col-md-3';
    divButton.style.display = 'flex';
    divButton.style.padding = '10px 12px 10px 12px';
    divButton.style.flexDirection = 'column';
    divButton.style.alignItems = 'center';

    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = button_name;
    button.style.width = '100%';
    button.style.fontSize = 'small';

    button.onclick = function () {
        fetch(`/rq1/data/${button_name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                createButtons(data.packages);
                createTable(data.headers, data.data);
                styleTable();
            });
    }

    divButton.appendChild(button);

    return divButton;
}

function createTable(headers, data) {
    if (document.querySelector('.container-table')) {
        document.querySelector('.container-table').remove();
    }

    const divContTable = document.createElement('div');
    divContTable.className = 'container container-table';
    divContTable.style.margin = '0 auto'; // Center the table horizontally
    divContTable.style.padding = '0 10px'; // Add padding for left and right margins
    divContTable.style.maxWidth = 'calc(100% - 20px)'; // Ensure the table fits within the device width

    const table = document.createElement('table');
    table.className = 'table table-hover';
    table.id = 'table-rq1';

    createHeaders(table, headers, data);
    createData(table, headers, data);

    divContTable.appendChild(table);
    document.body.appendChild(divContTable);
}

function createHeaders(table, headers, data) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    // Append additonal header for Billed button
    if (BILLED) {
        headers.push('Billed');
    }

    // Append headers to row
    headers.forEach((header, idx) => {
        const th = document.createElement('th');
        // Pass column index to dropdown
        const divFilter = createColumnFiltersDropdown(data.map(row => row[idx]), idx);
        th.className = 'table-dark';
        th.textContent = header;
        th.style.textAlign = 'left';
        th.style.fontSize = 'xx-small';
        console.log(`Header: ${header}, Index: ${idx}`);
        th.appendChild(divFilter); // Append filter dropdown to header        
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);
}

function createFilterDropdowns(table, headers, data) {
    const thead = table.querySelector('thead');
    const filterRow = document.createElement('tr');

    headers.forEach((header, colIdx) => {
        const th = document.createElement('th');
        if (header === 'Billed') {
            filterRow.appendChild(th);
            return;
        }
        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        select.style.fontSize = 'xx-small';

        // Get unique values for this column
        const values = new Set();
        data.forEach(row => {
            if (row[colIdx] !== undefined && row[colIdx] !== null) {
                values.add(row[colIdx]);
            }
        });

        // Add "All" option
        const optionAll = document.createElement('option');
        optionAll.value = '';
        optionAll.textContent = 'All';
        select.appendChild(optionAll);

        // Add unique values as options
        Array.from(values).sort().forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            select.appendChild(option);
        });

        select.addEventListener('change', function () {
            filterTableDropdown(table, headers);
        });

        th.appendChild(select);
        filterRow.appendChild(th);
    });

    thead.appendChild(filterRow);
}

function createData(table, headers, data) {
    const tbody = document.createElement('tbody');

    data.forEach(rowData => {
        const tr = document.createElement('tr');

        // Append data to row
        for (const idx of rowData.keys()) {
            const td = document.createElement('td');
            td.textContent = rowData[idx];
            td.dataLabel = headers[idx];
            td.className = headers[idx].toLowerCase();
            td.style.fontSize = 'xx-small';
            tr.appendChild(td);
        }

        if (BILLED) {
            const tdButton = document.createElement('td');

            // Billed button
            const buttonBilled = document.createElement('button');
            buttonBilled.className = 'btn btn-primary btn-billed';
            buttonBilled.textContent = 'Billed';
            buttonBilled.style.width = '100%';
            buttonBilled.style.fontSize = 'xx-small';
            buttonBilled.onclick = function () {
                alert(tr.getElementsByClassName(headers[0].toLowerCase())[0].innerText);
            }

            tdButton.appendChild(buttonBilled);
            tr.appendChild(tdButton);
        }

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

function styleTable() {
    const table = document.getElementById("table-rq1");
    const rows = table.getElementsByTagName("tr");

    styleLifeCycleState(table);
    styleAllocationCategoryDoors(table);
}

function styleLifeCycleState(table) {
    const items = table.getElementsByClassName("lifecyclestate");

    for (item of items) {
        // Conflicted
        if ("Conflicted" === item.innerText) {
            item.style.backgroundColor = "#FFC000";
            item.style.fontWeight = "bold";
        }

        // Evaluated
        else if ("Evaluated" === item.innerText) {
            item.style.backgroundColor = "#FFE699";
            item.style.fontWeight = "bold";
        }
    }
}

function styleAllocationCategoryDoors(table) {
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const allocation = rows[i].getElementsByClassName("allocation")[0];
        const category = rows[i].getElementsByClassName("category")[0];
        const doors = rows[i].getElementsByClassName("doors")[0];

        // Allocation, Category and DOORS validation
        if ("None" === allocation.innerText) {
            allocation.style.backgroundColor = "#FFC000";
            allocation.style.fontWeight = "bold";
        }

        if (("Software" === allocation.innerText) && ("None" === doors.innerText)) {
            doors.style.backgroundColor = "#FF7C80";
            doors.style.color = "white";
            doors.style.fontWeight = "bold";
        }
    }
}

function applyResponsiveTableStyles() {
    const tables = document.querySelectorAll('.table');

    if (window.innerWidth <= 768) {
        tables.forEach(table => {
            const thead = table.querySelector('thead');
            if (thead) {
                thead.style.display = 'none';
            }

            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.style.display = 'block';
                tbody.width = '100%';
            }

            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = 'block';
                row.style.width = '100%';
                row.style.marginBottom = '15px';

                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.display = 'block';
                    cell.style.width = '100%';
                    cell.style.textAlign = 'right';
                    cell.style.paddingLeft = '50%';
                    cell.style.position = 'relative';
                    cell.style.fontSize = 'x-small';

                    const label = cell.getAttribute('data-label');
                    if (label) {
                        const beforeContent = document.createElement('span');
                        beforeContent.style.position = 'absolute';
                        beforeContent.style.left = '0';
                        beforeContent.style.width = '50%';
                        beforeContent.style.paddingLeft = '15px';
                        beforeContent.style.textAlign = 'left';
                        beforeContent.style.fontWeight = '600';
                        beforeContent.style.fontSize = 'x-small';
                        beforeContent.textContent = label;
                        cell.insertBefore(beforeContent, cell.firstChild);
                    }
                });
            });
        });
    } else {
        tables.forEach(table => {
            const thead = table.querySelector('thead');
            if (thead) {
                thead.style.display = '';
            }

            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.style.display = '';
                tbody.width = '';
            }

            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
                row.style.width = '';
                row.style.marginBottom = '';

                const tds = row.querySelectorAll('td');
                tds.forEach(td => {
                    td.style.display = '';
                    td.style.width = '';
                    td.style.textAlign = '';
                    td.style.paddingLeft = '';
                    td.style.position = '';
                    td.style.fontSize = 'xx-small';

                    const beforeContent = td.querySelector('span');
                    if (beforeContent) {
                        td.removeChild(beforeContent);
                    }
                });
            });
        });
    }
}

function filterTableDropdown(table, headers) {
    const thead = table.querySelector('thead');
    const selects = thead.querySelectorAll('select');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        let show = true;
        selects.forEach((select, idx) => {
            if (headers[idx] === 'Billed') return;
            const filterValue = select.value;
            if (filterValue) {
                const cell = row.querySelectorAll('td')[idx];
                if (!cell || cell.textContent !== filterValue) {
                    show = false;
                }
            }
        });
        row.style.display = show ? '' : 'none';
    });
}

function createColumnFiltersDropdown(data, colIdx) {
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'filter-dropdown';
    dropdownDiv.setAttribute('data-column', colIdx);

    // Get unique values and filter out undefined/null/empty
    const unique = Array.from(new Set(data.filter(x => x !== undefined && x !== null && x !== '')));

    // "Select All" option
    const selectAllLabel = document.createElement('label');
    const selectAllInputCheckbox = document.createElement('input');
    selectAllInputCheckbox.type = 'checkbox';
    selectAllInputCheckbox.className = 'select-all';
    selectAllInputCheckbox.checked = true;
    selectAllLabel.appendChild(selectAllInputCheckbox);
    selectAllLabel.appendChild(document.createTextNode('Select All'));
    dropdownDiv.appendChild(selectAllLabel);

    // Other options
    unique.forEach(item => {
        const label = document.createElement('label');
        const inputCheckbox = document.createElement('input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.checked = true;
        inputCheckbox.value = item;
        label.appendChild(inputCheckbox);
        label.appendChild(document.createTextNode(item));
        dropdownDiv.appendChild(label);
    });

    // Attach event listeners for select-all and individual checkboxes
    selectAllInputCheckbox.addEventListener('change', () => {
        const checkboxes = dropdownDiv.querySelectorAll('input[type="checkbox"]:not(.select-all)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllInputCheckbox.checked;
        });
        filterTable(dropdownDiv);
    });
    dropdownDiv.querySelectorAll('input[type="checkbox"]:not(.select-all)').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterTable(dropdownDiv);
        });
    });

    return dropdownDiv;
}

// Filter table rows based on selected checkboxes
function filterTable(dropdown) {
    const columnIndex = parseInt(dropdown.dataset.column, 10);
    const selectedValues = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked:not(.select-all)')).map(input => input.value);

    document.querySelectorAll('tbody tr').forEach(row => {
        const cell = row.cells[columnIndex];
        if (cell && selectedValues.includes(cell.textContent)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}