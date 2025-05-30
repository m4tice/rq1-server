document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

function fetchData() {
    fetch('/rq1/data')
        .then(response => response.json())
        .then(data => {
            createButtons(data.packages);
            createTable(data.headers, data.data);
            styleTable();
        });
}

function createButtons(button_names){
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

function createButton(button_name){
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

    button.onclick = function(){
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

    const table = document.createElement('table');
    table.className = 'table table-hover';
    table.id = 'table-rq1';

    createHeaders(table, headers);
    createData(table, headers, data);

    divContTable.appendChild(table);
    document.body.appendChild(divContTable);
    // new DataTable('#table-rq1');
    new DataTable('#table-rq1', {
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    var column = this;
                    var title = column.footer().textContent;
     
                    // Create input element and add event listener
                    $('<input type="text" placeholder="Search ' + title + '" />')
                        .appendTo($(column.footer()).empty())
                        .on('keyup change clear', function () {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                });
        },
        layout: {
            top1: {
                searchPanes: {
                    viewTotal: true
                }
            }
        }
    });
}

function createHeaders(table, headers){
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    
    // Append additonal header for Billed button
    headers.push('Billed');

    // Append headers to row
    headers.forEach(header => {
        const th = document.createElement('th');
        th.className = 'table-dark';
        th.textContent = header;
        th.style.textAlign = 'left';
        th.style.fontSize = 'xx-small';
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);
}

function createData(table, headers, data){
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
        
        const tdButton = document.createElement('td');

        // Billed button
        const buttonBilled = document.createElement('button');
        buttonBilled.className = 'btn btn-primary btn-billed';
        buttonBilled.textContent = 'Billed';
        buttonBilled.style.width = '100%';
        buttonBilled.style.fontSize = 'xx-small';
        buttonBilled.onclick = function(){
            alert(tr.getElementsByClassName(headers[0].toLowerCase())[0].innerText);
        }

        tdButton.appendChild(buttonBilled);
        tr.appendChild(tdButton);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

function styleTable(){
    const table = document.getElementById("table-rq1");
    const rows = table.getElementsByTagName("tr");

    styleLifeCycleState(table);
    styleAllocationCategoryDoors(table);
}

function styleLifeCycleState(table){
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

function styleAllocationCategoryDoors(table){
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

document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveTableStyles();

    window.addEventListener('resize', function() {
        applyResponsiveTableStyles();
    });
});

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