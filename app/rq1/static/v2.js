document.addEventListener('DOMContentLoaded', function () {
    main();
});

async function main() {
    onButtonClick();
    const data = await fetchData();
    createElements(data);
}

function onButtonClick() {
    const buttonLightMode = document.getElementById('buttonLightMode');
    const buttonDarkMode = document.getElementById('buttonDarkMode');
    const buttonSetting = document.getElementById('buttonSetting');
    const buttonDebug = document.getElementById('buttonDebug');

    buttons = [buttonLightMode, buttonDarkMode, buttonDebug, buttonSetting];
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            console.log("[DEBUG] Button '" + button.id.split("button")[1] + "' clicked.");
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
    console.log("[DEBUG] Fetched data: ", data);

    return data;
}

function createButtons(buttonTexts) {
    const divPackages = document.getElementsByClassName('div-packages')[0];
    buttonTexts.forEach(buttonText => {
        const button = createButton(buttonText);
        console.log("[DEBUG] Creating button: ", button);
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

    return button;
}

function createTable(headers, data) {
    const tableRq1 = document.getElementById('tableRq1');
    const thead = createTableHeaders(headers);
    const tbody = createTableBody(data);
    tableRq1.appendChild(thead);
    tableRq1.appendChild(tbody);
}

function createTableHeaders(headers) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        const th = createTableHeader(headerText);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;

}

function createTableHeader(headerText) {
    const th = document.createElement('th');
    th.textContent = createFirstCharUpperCase(headerText);

    return th;
}

function createTableBody(data) {
    const tbody = document.createElement('tbody');

    data.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const td = createTableCell(cellData);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    return tbody;
}

function createTableCell(cellData) {
    const td = document.createElement('td');
    td.textContent = cellData;

    return td;
}

function createFirstCharUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}