document.addEventListener('DOMContentLoaded', function() {
    main();
});

function main(){
    onButtonClick();
}

function onButtonClick(){
    const buttonLightMode = document.getElementById('buttonLightMode');
    const buttonDarkMode = document.getElementById('buttonDarkMode');
    const buttonSetting = document.getElementById('buttonSetting');
    const buttonDebug = document.getElementById('buttonDebug');

    buttons = [buttonLightMode, buttonDarkMode, buttonDebug, buttonSetting];
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("[DEBUG] Button '" + button.id.split("button")[1] + "' clicked.");
        });
    });
}

function createButtons(){

}

function createButton(buttonText){

}

function createTable(){

}

function createHeaders(){

}

function createHeader(headerText){

}

function createRows(data){
    
}