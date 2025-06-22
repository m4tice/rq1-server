document.addEventListener('DOMContentLoaded', function () {
    main();
});

async function main() {
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
    
    const thead = createTableHeaders(headers);
    const tbody = createTableBody(data);
    tableRq1.appendChild(thead);
    tableRq1.appendChild(tbody);
}

function createTableHeaders(headers) {
    /*
    create <thead> of the table with <th> elements for each header.
    */
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create a header for the row index, i.e., "No."
    thNo = createTableHeader('No.');
    headerRow.appendChild(thNo);

    headers.forEach(headerText => {
        const th = createTableHeader(headerText);
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