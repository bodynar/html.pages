
const dropdowns = document.getElementsByClassName('dropdown');

const dropdownLogs = document.getElementById('dropdown-logs');

for (let index = 0; index < dropdowns.length; index++) {
    const dropdown = dropdowns[index];

    if (!isNullOrUndefined(dropdown)) {
        initDropdown(dropdown);
    }
}

function initDropdown(element) {
    const dropdownIdentifier = element.attributes["data-dropdown-id"].value;
    const isValidIdentifier = document.querySelectorAll(`[data-dropdown-id="${dropdownIdentifier}"]`).length === 1;

    if (!isValidIdentifier) {
        throw Error('Dropdown with same identifier is exist');
    }

    var dropdownControl = document.getElementById(dropdownIdentifier);

    if (isNullOrUndefined(dropdownControl)) {
        throw Error('Dropdown control doesn\'t exist');
    }

    var dropdownOptions = document.querySelectorAll(`div[data-dropdown-for="${dropdownIdentifier}"]`)[0];
    if (isNullOrUndefined(dropdownOptions)) {
        throw Error('Dropdown list container doesn\'t exist');
    }

    var dropdownOptionsList = document.querySelectorAll(`div[data-dropdown-for="${dropdownIdentifier}"]`)[0];
    if (isNullOrUndefined(dropdownOptionsList)) {
        throw Error('Dropdown list doesn\'t exist');
    }

    document.addEventListener('click', onDocumentClick);
    dropdownControl.addEventListener('click', onDropdownControlClick);
}

function onDocumentClick(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    if (!isNullOrUndefined(target) && isDropdownItem(target)) {
        var dropdownIdentifier = getDropdownIdentifier(target);

        if (!isNullOrUndefined(target.attributes["data-dropdown-value"])) {
            var selectedValue = target.attributes["data-dropdown-value"].value;
            var dropdownControl = document.getElementById(dropdownIdentifier);

            dropdownControl.innerHTML = target.innerHTML;
            dropdownControl.setAttribute('data-dropdown-selected-value', selectedValue);
            
            var dropdownOptions = document.querySelectorAll(`div[data-dropdown-for="${dropdownIdentifier}"] a[data-dropdown-selected]`);
            for (let index = 0; index < dropdownOptions.length; index++) {
                const dropdownOption = dropdownOptions[index];
                dropdownOption.removeAttribute('data-dropdown-selected');
            }
            
            target.setAttribute('data-dropdown-selected', true);

            if (!isNullOrUndefined(dropdownLogs)){
                dropdownLogs.innerHTML += `\n[${new Date().toLocaleTimeString()}] Dropdown [${dropdownIdentifier}]: Selected ${selectedValue}`;
            }

            hideDropdowns();
        }
    } else {
        hideDropdowns();
    }
}

function hideDropdowns() {
    var dropdownOptionsContainers = document.querySelectorAll(`div[data-dropdown-for]`);

    for (let index = 0; index < dropdownOptionsContainers.length; index++) {
        const dropdownOptionsContainer = dropdownOptionsContainers[index];

        var dropdownIdentifier = dropdownOptionsContainer.attributes["data-dropdown-for"].value;
        var dropdownControl = document.getElementById(dropdownIdentifier);

        dropdownOptionsContainer.setAttribute('data-dropdown-displayed', false);
        dropdownControl.setAttribute('data-dropdown-displayed', false);

        if (!isNullOrUndefined(dropdownLogs)){
            dropdownLogs.innerHTML += `\n[${new Date().toLocaleTimeString()}] Dropdown [${dropdownIdentifier}]: hidded `;
        }
    }
}

function onDropdownControlClick(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    var isDropdownDisplayed = false;
    var dropdownIdentifier = target.id;

    if (isNullOrUndefined(target.attributes["data-dropdown-displayed"])) {
        target.setAttribute('data-dropdown-displayed', false);
    } else {
        isDropdownDisplayed = target.attributes["data-dropdown-displayed"].value === 'true';
    }
    var dropdownOptions = document.querySelectorAll(`div[data-dropdown-for="${dropdownIdentifier}"]`)[0];

    dropdownOptions.setAttribute('data-dropdown-displayed', !isDropdownDisplayed);
    target.setAttribute('data-dropdown-displayed', !isDropdownDisplayed);

    if (!isNullOrUndefined(dropdownLogs)){
        dropdownLogs.innerHTML += `\n[${new Date().toLocaleTimeString()}] Dropdown [${dropdownIdentifier}]: ${!isDropdownDisplayed ? "displayed" : "hidded"} `;
    }
}

function getDropdownIdentifier(element) {
    if (element.classList.contains('dropdown-control') && !isNullOrUndefined(element.attributes["data-dropdown-control"])){
        return element.id;
    }

    if (element.tagName === 'HTML' || element.tagName === 'BODY') {
        throw Error('Element is not a dropdown tree child');
    }

    if (!isNullOrUndefined(element.attributes["data-dropdown-for"])) {
        return element.attributes["data-dropdown-for"].value;
    }

    return getDropdownIdentifier(element.parentNode);
}

function isDropdownItem(element) {
    var result = !isNullOrUndefined(element) && !isNullOrUndefined(element.attributes["data-dropdown-control"]);

    if (!result && element.tagName !== 'HTML' && element.tagName !== 'BODY') {
        result = isDropdownItem(element.parentNode);
    }

    return result;
}