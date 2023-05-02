let latestElementRightClick = {
    id: null,
    node: null,
};
let allData = [{}, {}, {}];
let lowerModalData;
if (localStorage.getItem("data")) {
    lowerModalData = JSON.parse(localStorage.getItem("data"));
    allData = lowerModalData.allData;
}

/* START helper functions */
let latestId = -1;
if (localStorage.getItem("latestId")) {
    latestId = +(localStorage.getItem("latestId"));
}
let unique_id_generator = (function (s) {
    return function () {
        s += 1;
        latestId = s;
        localStorage.setItem("latestId", latestId);
        return s;
    };
})(latestId);
/* END helper functions */

// for opening upper modal just add class open-upper to element and so on...

let lowerModal = document.querySelector("#lower-modal");
let upperModal = document.querySelector("#upper-modal");

let upperModalClosers = document.querySelectorAll(".close-upper");

let lowerModalClosers = document.querySelectorAll(".close-lower");
let lowerModalOpeners = document.querySelectorAll(".open-lower");

let saveUpper = document.getElementById("save-upper");

let sendNotification = document.getElementById("send-notification");
let inputName = document.getElementById("input-name");
let nameIsRequired = document.getElementById("name-is-required");

let cancelLower = document.getElementById("lower-modal-cancel-button");

let elseOperatorInnerHTML = `<optgroup label="Default value">
<option>defaults to</option>
<option>defaults to a generated value</option>
<option>defaults to a concatenated value</option>
</optgroup>
<optgroup label="Change value">
<option>equals</option>
<option>equals a concatenated value</option>
</optgroup>
<optgroup label="Validation">
<option>is required</option>
<option>is not valid</option>
<option>must contain the pattern</option>
<option>must be unique</option>
<option>must be greater than</option>
<option>must be equal to</option>
<option>must be greater than or equal to</option>
<option>must be less than</option>
<option>must be less than or equal to</option>
<option>must be between</option>
<option>must have a minimum length of</option>
<option>must have a maximum length of</option>
</optgroup>
<optgroup label="User defined script"></optgroup>
<optgroup label="External action">
<option>start workflow</option>
</optgroup>`;

let thenOperatorInnerHTML = `<optgroup label="Default value">
<option>defaults to</option>
<option>defaults to a generated value</option>
<option>defaults to a concatenated value</option>
</optgroup>
<optgroup label="Change value">
<option>equals</option>
<option>equals a concatenated value</option>
</optgroup>
<optgroup label="Validation">
<option>is required</option>
<option>is not valid</option>
<option>must contain the pattern</option>
<option>must be unique</option>
<option>must be greater than</option>
<option>must be equal to</option>
<option>must be greater than or equal to</option>
<option>must be less than</option>
<option>must be less than or equal to</option>
<option>must be between</option>
<option>must have a minimum length of</option>
<option>must have a maximum length of</option>
</optgroup>
<optgroup label="User defined script"></optgroup>
<optgroup label="External action">
<option>start workflow</option>
</optgroup>`;

init_lower_modal();
// close_modal(upperModal);
// close_modal(lowerModal);

function init_lower_modal() {
    if (!inputName.value) {
        nameIsRequired.classList.remove("invisible");
    }
}

inputName.addEventListener("change", function () {
    check_if_lower_modal_save_button_should_be_actived();
    check_if_name_alert_should_be_shown();
});

function check_if_upper_modal_save_button_should_be_actived() {
    let secondAttribute = document.getElementById("second-attribute");
    if (secondAttribute.value) {
        saveUpper.removeAttribute("disabled");
    } else {
        saveUpper.setAttribute("disabled", "");
    }
}

function check_if_lower_modal_save_button_should_be_actived() {
    let lowerModalSaveButton = document.getElementById(
        "lower-modal-save-button"
    );
    if (
        allData[1] &&
        allData[1].nodes &&
        allData[1].nodes.length &&
        inputName.value
    ) {
        lowerModalSaveButton.removeAttribute("disabled");
    } else {
        lowerModalSaveButton.setAttribute("disabled", "");
    }
}

function check_if_name_alert_should_be_shown() {
    if (!inputName.value) {
        nameIsRequired.classList.remove("invisible");
        inputName.classList.add("alert");
    } else {
        nameIsRequired.classList.add("invisible");
        inputName.classList.remove("alert");
    }
}

cancelLower.addEventListener("click", function () {
    localStorage.removeItem("latestId");
    localStorage.removeItem("data");
    allData = [{}, {}, {}];
    rebuild_page();
});

upperModalClosers.forEach(function (single) {
    single.addEventListener("click", function () {
        close_modal(upperModal);
    });
});

lowerModalOpeners.forEach(function (single) {
    single.addEventListener("click", function () {
        open_modal(lowerModal);
    });
});

lowerModalClosers.forEach(function (single) {
    single.addEventListener("click", function () {
        close_modal(lowerModal);
    });
});

saveUpper.addEventListener("click", function () {
    let allDataIndex = saveUpper.dataset.index;
    save_upper_modal(allDataIndex, latestElementRightClick);
    close_modal(upperModal);
    rebuild_page();
});

function close_modal(node) {
    node.style.opacity = 0;
    node.style.visibility = "hidden";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,-100px)";
}

function open_modal(
    node,
    allDataIndex = false,
    latestElementRightClick = false,
    mode = "add"
) {
    reset_upper_modal();

    let saveUpper = document.getElementById("save-upper");
    node.style.opacity = 100;
    node.style.visibility = "visible";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,0)";
    if (mode == "edit") {
        saveUpper.dataset.number = latestElementRightClick.id;
    } else {
        delete saveUpper.dataset.number;
    }

    if (
        (latestElementRightClick && latestElementRightClick.allDataIndex) ||
        allDataIndex
    ) {
        saveUpper.dataset.index =
            allDataIndex || latestElementRightClick.allDataIndex;
    }


    let conditionMode = change_all_data_index_to_mode(allDataIndex);
    console.log(conditionMode);
    if (conditionMode == "if") {
        operator.innerHTML = defaultOperatorInnerHTML;
    } else if (conditionMode == "else") {
        operator.innerHTML = elseOperatorInnerHTML;
    } else if (conditionMode == "then") {
        operator.innerHTML = thenOperatorInnerHTML;
    }
}

/* START notification toggle */
sendNotification.addEventListener("change", function () {
    let notificationReceiver = document.getElementById("notification-receiver");
    if (!sendNotification.checked) {
        notificationReceiver.setAttribute("disabled", "");
    } else {
        notificationReceiver.removeAttribute("disabled");
    }
});
/* END notification toggle */

/* START operator change events */
let operator = document.getElementById("operator");
let operatorValue = document.getElementById("operator-value");
let operatorValueLabel = document.getElementById("operator-value-label");
operator.addEventListener("change", function () {
    operatorValueLabel.innerHTML =
        operator.options[operator.selectedIndex].text;
});

// START change second attribute when operator value change
let secondAttribute = document.getElementById("second-attribute");
let secondAttributeOrginalInnerHTML = secondAttribute.innerHTML;

function add_operator_value_events(operatorValueNode) {
    operatorValueNode.addEventListener("change", function () {
        if (operatorValueNode.value == "Blank") {
            switch_to_blank_mode();
        } else if (operatorValueNode.value == "Attribute") {
            switch_to_attribute_mode();
        } else if (operatorValueNode.value == "Attribute value") {
            switch_to_attribute_value_mode();
            check_if_upper_modal_save_button_should_be_actived();
        }
    });

}


operator.addEventListener("change", function () {
    console.log(operator.value);
    switch (operator.value) {
        case "defaults to a concatenated value":
        case "equals a concatenated value":
            switch_to_table_mode();
            break;
        case "has changed":
        case "has not changed":
        case "is required":
        case "is not valid":
            switch_to_base_form();
            break;
        default:
            switch_to_default_form();
            break;
    }
})

function switch_to_blank_mode() {
    let secondAttributeDiv = document.getElementById("second-attribute-div");
    secondAttributeDiv.style.display = "none";
}

function switch_to_attribute_mode() {
    let secondAttributeDiv = document.getElementById("second-attribute-div");
    let secondAttribute = document.getElementById("second-attribute");
    secondAttributeDiv.style.display = "block";
    let newElem = document.createElement("select");
    newElem.setAttribute("id", "second-attribute");
    newElem.setAttribute(
        "class",
        "w-full p-2 bg-white border border-[#cccccc] rounded"
    );
    newElem.innerHTML = secondAttributeOrginalInnerHTML;
    secondAttribute = document.getElementById("second-attribute");
    secondAttribute.parentNode.replaceChild(newElem, secondAttribute);
    check_if_second_attribute_alert_should_be_shown();
}

function switch_to_attribute_value_mode() {
    let secondAttributeDiv = document.getElementById("second-attribute-div");
    let secondAttribute = document.getElementById("second-attribute");
    secondAttributeDiv.style.display = "block";

    let newElem = document.createElement("input");
    newElem.setAttribute("id", "second-attribute");
    newElem.setAttribute(
        "class",
        "w-full p-2 bg-white border border-[#cccccc] rounded"
    );
    secondAttribute = document.getElementById("second-attribute");
    secondAttribute.parentNode.replaceChild(newElem, secondAttribute);
    check_if_second_attribute_alert_should_be_shown();
}




/* START table mode */

let addRow = document.querySelector(".add-new-row");
let deleteRow = document.querySelector(".delete-new-row");
let tableRow = document.querySelector(".table-mode-row");
let clonedSecondTdInTableMode = tableRow.children[1].children[0].cloneNode(true);

function add_table_row_events(tableRowNode) {

    tableRowNode.addEventListener("change", function (e) {
        if (e.target != tableRowNode.children[0].children[0]) {
            return;
        }
        if (tableRowNode.children[0].children[0].value == "Text") {
            tableRowNode.children[1].innerHTML = `<input
            class="w-full border border-solid border-gray-400 px-2 py-[6px] rounded bg-white"
            type="text">`;
            tableRowNode.children[2].children[0].setAttribute("disabled", "disabled");
            tableRowNode.children[3].children[0].setAttribute("disabled", "disabled");

        } else if (tableRowNode.children[0].children[0].value == "Attribute") {
            tableRowNode.children[1].innerHTML = `<select
            class="w-full border border-solid border-gray-400 p-2 rounded bg-white">
            <optgroup label="Attributes">
                <option value="">Name</option>
                <option value="">Code</option>
            </optgroup>
        </select>`;
            tableRowNode.children[2].children[0].removeAttribute("disabled");
            tableRowNode.children[3].children[0].removeAttribute("disabled");
        }
    })
}

add_table_row_events(tableRow);

let tableDiv = document.getElementById("table-div");
let clonedTableDiv = tableDiv.cloneNode(true);
function switch_to_table_mode() {

    switch_to_base_form();
    let operatorDiv = document.getElementById("operator-div");
    operatorDiv.parentNode.insertBefore(clonedTableDiv, operatorDiv.nextSibling)
    let addRow = clonedTableDiv.querySelector(".add-new-row");
    let deleteRow = clonedTableDiv.querySelector(".delete-new-row");
    add_addrow_and_deleterow_events(addRow, deleteRow);

}

let clonedDefaultFormOfTableRow = tableRow.cloneNode(true);


function add_addrow_and_deleterow_events(addRowNode, deleteRowNode) {
    addRowNode.addEventListener("click", function () {
        let newRow = clonedDefaultFormOfTableRow.cloneNode(true);
        let tableRow = document.querySelector(".table-mode-row");
        tableRow.parentNode.appendChild(newRow);
        add_table_row_events(newRow);
    })

    deleteRowNode.addEventListener("click", function () {
        let tableRow = document.querySelector(".table-mode-row");
        if (tableRow.parentNode.children.length <= 1) {
            return;
        }
        tableRow.parentNode.children[(tableRow.parentNode.children.length - 1)].remove();
    })
}
/* END table mode */




let operatorValueDiv = document.getElementById("operator-value-div");
let secondAttributeDiv = document.getElementById("second-attribute-div");
let clonedOperatorValueDiv = operatorValueDiv.cloneNode(true);
let clonedSecondAttributeDiv = secondAttributeDiv.cloneNode(true);
function switch_to_base_form() {
    let operatorValueDiv = document.getElementById("operator-value-div");
    let secondAttributeDiv = document.getElementById("second-attribute-div");
    let tableDiv = document.getElementById("table-div");
    tableDiv && tableDiv.remove();
    operatorValueDiv && operatorValueDiv.remove();
    secondAttributeDiv && secondAttributeDiv.remove();
}

function switch_to_default_form() {
    switch_to_base_form();
    let operatorDiv = document.getElementById("operator-div");
    operatorDiv.parentNode.insertBefore(clonedOperatorValueDiv, operatorDiv.nextSibling)
    operatorDiv.parentNode.insertBefore(clonedSecondAttributeDiv, operatorDiv.nextSibling.nextSibling)
    let operatorValue = clonedOperatorValueDiv.querySelector("#operator-value");
    add_operator_value_events(operatorValue)
}


function check_if_second_attribute_alert_should_be_shown() {
    let valueIsRequired = document.getElementById("value-is-required");
    let secondAttribute = document.getElementById("second-attribute");
    let operatorValue = document.getElementById("operator-value");
    if (operatorValue.value == "Attribute value") {
        if (secondAttribute && secondAttribute.value) {
            secondAttribute.classList.remove("alert");
            valueIsRequired.classList.add("invisible");
        } else {
            secondAttribute.classList.add("alert");
            valueIsRequired.classList.remove("invisible");
        }
    } else {
        secondAttribute.classList.remove("alert");
        valueIsRequired.classList.add("invisible");
    }
    secondAttribute.addEventListener("change", function () {
        check_if_upper_modal_save_button_should_be_actived();
        check_if_second_attribute_alert_should_be_shown();
    });
}

// END change second attribute when operator value change

/* END operator change events */
function save_upper_modal(allDataIndex = 0, latestElementRightClick = false) {
    let conditionSentence;
    let selects = upperModal.querySelectorAll("select");
    let secondAttribute = upperModal.querySelector("#second-attribute");
    conditionSentence = selects[0].value + " " + selects[1].value;
    switch (selects[2].value) {
        case "Attribute value":
            conditionSentence = conditionSentence + " " + secondAttribute.value;
            break;
        case "Attribute":
            conditionSentence = conditionSentence + " " + selects[3].value;
            break;
        case "Blank":
            conditionSentence = conditionSentence + " " + "Blank";
            break;
        default:
            conditionSentence = conditionSentence + " " + selects[3].value;
    }

    let newNode = {
        left: selects[0].value,
        operator: selects[1].value,
        operatorValue: selects[2].value,
        right: secondAttribute.value,
        sentence: conditionSentence,
    };

    if (saveUpper.dataset.number) {
        // edit
        update_mini_node_logical_data_operator_structure(
            allData[allDataIndex],
            latestElementRightClick.id,
            latestElementRightClick.node,
            newNode
        );
        return;
    }
    insert_logical_operator_data_structure(
        allData[allDataIndex],
        newNode,
        allDataIndex,
        latestElementRightClick.id
    );
}

function create_new_sentence_and_append(parentNode, index) {
    let newElem = document.createElement("div");
    newElem.classList.add("sentence");
    newElem.innerHTML = JSON.parse(localStorage.getItem(index)).sentence;
    newElem.id = JSON.parse(localStorage.getItem(index)).id;
    parentNode.appendChild(newElem);
}

let defaultOperatorInnerHTML = operator.innerHTML;
function load_upper_modal(latestElementRightClick) {
    let chosen;
    chosen = select_in_logical_operator_data_structure(
        allData[latestElementRightClick.allDataIndex],
        latestElementRightClick.id
    );

    data = chosen.nodes[latestElementRightClick.node];
    let attribute = document.getElementById("attribute");
    let operator = document.getElementById("operator");
    let operatorValue = document.getElementById("operator-value");
    change_selected_option_by_text(attribute, data.left);
    change_selected_option_by_text(operator, data.operator);
    change_selected_option_by_text(operatorValue, data.operatorValue);
    if (data.operatorValue == "Attribute value") {
        switch_to_attribute_value_mode();
        let secondAttribute = document.getElementById("second-attribute");
        secondAttribute.value = data.right;
        check_if_second_attribute_alert_should_be_shown();
    } else if (data.operatorValue == "Blank") {
        switch_to_blank_mode();
    } else {
        switch_to_attribute_mode();
        let secondAttribute = document.getElementById("second-attribute");
        change_selected_option_by_text(secondAttribute, data.right);
    }
}

function change_selected_option_by_text(selectNode, text) {
    const options = Array.from(selectNode.options);
    const optionToSelect = options.find((item) => item.text === text);
    optionToSelect.selected = true;
}

/* START Context menu */
let contextMenu = document.getElementById("context-menu");

let dataContainer = document.querySelectorAll(".data-container");

function check_if_div_should_be_been_blue(e) {
    if (e.target.id.includes("operator")) {
        return;
    }
    e.target.classList.add("div-selected");
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    if (!e.ctrlKey) {
        for (let i = allDivSelectedElem.length - 1; i >= 0; i--) {
            if (allDivSelectedElem[i] != e.target) {
                allDivSelectedElem[i].classList.remove("div-selected");
            }
        }
    }
}

function change_all_data_index_to_mode(index) {
    if (index <= 2) {
        if (index == 0) {
            return "if";
        } else if (index == 1) {
            return "then";
        } else if (index == 2) {
            return "else";
        }
    } else {
        if (index % 2 != 0) {
            return "if";
        } else {
            return "then";
        }
    }
}

function find_all_data_index(node) {
    if (node && node.dataset && node.dataset.index) {
        return node.dataset.index;
    } else {
        return find_all_data_index(node.parentNode);
    }
}

function add_data_container_events(node) {
    let allDataIndex = find_all_data_index(node);
    let mode = change_all_data_index_to_mode(allDataIndex);

    node.addEventListener("click", (e) => {
        check_if_div_should_be_been_blue(e);
    });

    node.addEventListener("contextmenu", function (e) {
        let allDataIndex = find_all_data_index(node);
        if (mode == "if") {
            e.preventDefault();
            e.stopPropagation();

            if (!e.target.classList.contains("div-selected")) {
                return;
            }

            targetId = e.target.parentNode.id;
            if (targetId.includes("if-sentence-complete")) {
                latestElementRightClick = {
                    id: targetId.replace("if-sentence-complete-", ""),
                    allDataIndex,
                    node: null,
                };
            } else if (targetId.includes("if-sentence")) {
                latestElementRightClick = {
                    id: targetId.replace("if-sentence-", ""),
                    allDataIndex,
                    node: e.target.id,
                };
            }
        } else {
            e.preventDefault();
            e.stopPropagation();
            if (!e.target.classList.contains("div-selected")) {
                return;
            }
            latestElementRightClick.id = e.target.id;
            targetId = e.target.parentNode.id;

            latestElementRightClick = {
                id: targetId.replace("nonIf-sentence-", ""),
                allDataIndex:
                    e.target.parentNode.parentNode.parentNode.parentNode
                        .parentNode.dataset.index,
                node: e.target.id,
            };
        }
        show_context_menu(e, contextMenu, mode);
    });

    node.addEventListener("change", function (e) {
        if (mode == "if") {
            let id;
            if (e.target.id.includes("operator")) {
                id = e.target.id.replace("operator-", "");
                let chosen = select_in_logical_operator_data_structure(
                    allData[allDataIndex],
                    id
                );
                if (e.target.value == "NOT") {
                    chosen.NOT = true;
                } else {
                    chosen.operator = e.target.value;
                }
            } else if (e.target.id.includes("not")) {
                id = e.target.id.replace("not-", "");
                let chosen = select_in_logical_operator_data_structure(
                    allData[allDataIndex],
                    id
                );
                if (e.target.value == "NOT") {
                    chosen.NOT = true;
                } else {
                    chosen.NOT = false;
                }
            }
            rebuild_page();
        }
    });
}

dataContainer.forEach(function (single) {
    add_data_container_events(single);
});

document.body.addEventListener("click", (e) => {
    hide_context_menu(e, contextMenu);
});

let addMenu = document.getElementById("add");
let editMenu = document.getElementById("edit");
let deleteMenu = document.getElementById("delete");
let groupMenu = document.getElementById("group");
let ungroupMenu = document.getElementById("ungroup");

deleteMenu.addEventListener("click", function () {
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    let id;
    let node;
    let nonIf = false;
    for (let i = allDivSelectedElem.length - 1; i >= 0; i--) {
        if (
            allDivSelectedElem[i].parentElement.id.includes(
                "if-sentence-complete"
            )
        ) {
            id = allDivSelectedElem[i].parentElement.id.replace(
                "if-sentence-complete-",
                ""
            );
            node = null;
        } else if (
            allDivSelectedElem[i].parentElement.id.includes("if-sentence")
        ) {
            nonIf = false;
            id = allDivSelectedElem[i].parentElement.id.replace(
                "if-sentence-",
                ""
            );
            node = allDivSelectedElem[i].id;
        } else if (
            allDivSelectedElem[i].parentElement.id.includes("nonIf-sentence")
        ) {
            nonIf = true;
            id = allDivSelectedElem[i].parentElement.id.replace(
                "nonIf-sentence-",
                ""
            );
            node = allDivSelectedElem[i].id;
        }
        if (node) {
            delete_mini_node_logical_operator_data_structure(
                allData[latestElementRightClick.allDataIndex],
                id,
                node
            );
        } else {
            delete_logical_operator_data_structure(
                allData[latestElementRightClick.allDataIndex],
                id
            );
        }
    }
    rebuild_page();
});

addMenu.addEventListener("click", function () {
    open_modal(upperModal, false, latestElementRightClick, "add");
});

editMenu.addEventListener("click", function () {
    open_modal(upperModal, false, latestElementRightClick, "edit");
    load_upper_modal(latestElementRightClick);
});

groupMenu.addEventListener("click", function () {
    if (!check_if_group_menu_should_be_shown()) {
        return;
    }
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    let id = allDivSelectedElem[0].parentNode.id.replace("if-sentence-", "");
    let nodeIndexArray = [];
    for (let i = 0; i < allDivSelectedElem.length; i++) {
        nodeIndexArray.push(+allDivSelectedElem[i].id);
    }
    group_logical_operator_data_structure(
        allData[latestElementRightClick.allDataIndex],
        id,
        nodeIndexArray
    );
    rebuild_page();
});

ungroupMenu.addEventListener("click", function () {
    if (!check_if_ungroup_menu_should_be_shown()) {
        return;
    }
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    let id = allDivSelectedElem[0].parentNode.id.replace(
        "if-sentence-complete-",
        ""
    );
    ungroup_logical_operator_data_structure(
        allData[latestElementRightClick.allDataIndex],
        id
    );
    rebuild_page();
});

function reset_upper_modal() {
    switch_to_attribute_mode();
    let selects = upperModal.querySelectorAll("select");
    selects[0].querySelectorAll("option")[0].selected = "selected";
    selects[1].querySelectorAll("option")[0].selected = "selected";
    selects[2].querySelectorAll("option")[1].selected = "selected";
    selects[3].querySelectorAll("option")[0].selected = "selected";
}

function show_context_menu(e, contextMenu, mode = "if") {
    check_if_group_menu_should_be_shown();
    check_if_ungroup_menu_should_be_shown();
    if (contextMenu.style.display === "none") {
        contextMenu.style.display = "block";
    }
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.left = e.clientX + "px";

    addMenu.dataset.mode = mode;
    editMenu.dataset.mode = mode;
    deleteMenu.dataset.mode = mode;
    if (mode == "then" || mode == "else") {
        groupMenu.style.display = "none";
        ungroupMenu.style.display = "none";
    } else if (mode == "if") {
        groupMenu.style.display = "block";
        ungroupMenu.style.display = "block";
    }
}

function check_if_group_menu_should_be_shown() {
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    let flag = true;
    let previous;
    for (let i = 0; i < allDivSelectedElem.length; i++) {
        if (
            previous &&
            allDivSelectedElem[i].parentNode.id != previous.parentNode.id
        ) {
            flag = false;
        }
        previous = allDivSelectedElem[i];
    }
    if (allDivSelectedElem.length <= 1) {
        flag = false;
    }
    if (flag) {
        let chosen = select_in_logical_operator_data_structure(
            allData[latestElementRightClick.allDataIndex],
            allDivSelectedElem[0].parentNode.id.replace("if-sentence-", "")
        );
        if (
            chosen.nodes &&
            chosen.nodes.length - allDivSelectedElem.length <= 1
        ) {
            flag = false;
        }
    }
    if (flag === true) {
        groupMenu.classList.remove("not-allowed");
        return true;
    } else {
        groupMenu.classList.add("not-allowed");
        return false;
    }
}

function check_if_ungroup_menu_should_be_shown() {
    let flag = true;
    let allDivSelectedElem = document.getElementsByClassName("div-selected");
    if (allDivSelectedElem.length > 1) {
        flag = false;
    }
    if (
        !allDivSelectedElem[0].parentNode.id.includes("if-sentence-complete-")
    ) {
        flag = false;
    }
    let parent = select_in_logical_operator_data_structure(
        allData[latestElementRightClick.allDataIndex],
        allDivSelectedElem[0].parentNode.id.replace(
            "if-sentence-complete-",
            ""
        ),
        true
    );
    if (!parent) {
        flag = false;
    }
    if (flag === true) {
        ungroupMenu.classList.remove("not-allowed");
        return true;
    } else {
        ungroupMenu.classList.add("not-allowed");
        return false;
    }
}

function hide_context_menu(e, contextMenu) {
    e.stopPropagation();
    contextMenu.style.display = "none";
}

/* END Context menu */




/* START Logic of data structure */

function traslate_operator_en_to_fa(operator) {
    switch (operator) {
        case "AND":
            return "و"
        case "OR":
            return "یا"
        case "NOT":
            return "نفی"
        default:
            return "و"
    }
}
let result = [];
function create_logical_operator_data_structure_sentence(data) {
    if (!data || Object.keys(data).length === 0) {
        return "";
    }
    // there isn't any child
    if (data.childs && data.childs.length) {
        // there is a number of childs
        if (data.NOT) {
            result.push("!");
        }
        result.push("(");
        if (data.nodes) {
            data.nodes.forEach(function (singleNode, index, array) {
                result.push(singleNode.sentence);
                if (index !== array.length - 1) {
                    result.push(traslate_operator_en_to_fa(data.operator));
                }
            });
            result.push(traslate_operator_en_to_fa(data.operator));
        }
        data.childs.forEach(function (singleChild, index, array) {
            create_logical_operator_data_structure_sentence(singleChild);
            if (index !== array.length - 1) {
                result.push(traslate_operator_en_to_fa(data.operator));
            }
        });
        result.push(")");
    } else {
        if (data.NOT) {
            result.push("!");
        }
        if (data.nodes.length >= 2) {
            result.push("(");
        }
        data.nodes.forEach(function (singleNode, index, array) {
            result.push(singleNode.sentence);
            if (index !== array.length - 1) {
                result.push(traslate_operator_en_to_fa(data.operator));
            }
        });
        if (data.nodes.length >= 2) {
            result.push(")");
        }
    }
    return result.join(" ");
}

function insert_logical_operator_data_structure(
    data,
    object,
    allDataIndex = 0,
    id = data.id
) {
    if (data && !(Object.keys(data).length === 0)) {
        if (id) {
            let chosen = select_in_logical_operator_data_structure(data, id);
            chosen.nodes.push(object);
        } else {
            let chosen = select_in_logical_operator_data_structure(
                data,
                data.id
            );
            chosen.nodes.push(object);
        }
    } else {
        data = {
            id: unique_id_generator(),
            NOT: false,
            operator: "AND",
            nodes: [],
            childs: [],
        };
        data.nodes.push(object);
        allData[allDataIndex] = data;
    }
}

function update_logical_operator_data_structure(data, id, object) {
    let result = select_in_logical_operator_data_structure(data, id);
    result.NOT = object.NOT || result.NOT;
    result.operator = object.operator || result.operator;
    result.nodes = object.nodes || result.nodes;
    result.childs = object.childs || result.childs;
}

function update_mini_node_logical_data_operator_structure(
    data,
    id,
    nodeIndex,
    object
) {
    let chosen = select_in_logical_operator_data_structure(data, id);
    chosen.nodes[nodeIndex].left = object.left || chosen.nodes[nodeIndex].left;
    chosen.nodes[nodeIndex].operator =
        object.operator || chosen.nodes[nodeIndex].operator;
    chosen.nodes[nodeIndex].operatorValue =
        object.operatorValue || chosen.nodes[nodeIndex].operatorValue;
    chosen.nodes[nodeIndex].right =
        object.right || chosen.nodes[nodeIndex].right;
    chosen.nodes[nodeIndex].sentence =
        object.sentence || chosen.nodes[nodeIndex].sentence;
}

function delete_logical_operator_data_structure(data, id) {
    let parent = select_in_logical_operator_data_structure(data, id, true);
    if (parent) {
        let newChild = [];
        parent.childs.forEach(function (singleChild) {
            if (singleChild.id == id) {
                return;
            }
            newChild.push(singleChild);
        });
        parent.childs = newChild;
    } else {
        // node is root
        allData[latestElementRightClick.allDataIndex] = null;
    }
}

function delete_mini_node_logical_operator_data_structure(data, id, nodeIndex) {
    let bigNode = select_in_logical_operator_data_structure(data, id);
    if (bigNode) {
        bigNode.nodes.splice(nodeIndex, 1);
    }
}

function group_logical_operator_data_structure(data, id, nodeIndexArray) {
    let chosen = select_in_logical_operator_data_structure(data, id);
    insert_child_in_logical_data_operator_structure(data, id, false, "AND");
    let childsCount = chosen.childs.length;
    if (nodeIndexArray) {
        nodeIndexArray.forEach(function (nodeIndex) {
            chosen.childs[childsCount - 1].nodes.push(chosen.nodes[nodeIndex]);
        });
        let newNodes = [];
        chosen.nodes.forEach(function (singleNode, index) {
            if (nodeIndexArray.includes(index)) {
                return;
            }
            newNodes.push(singleNode);
        });
        chosen.nodes = newNodes;
    }
}

function insert_child_in_logical_data_operator_structure(
    data,
    id,
    NOT = false,
    operator = "AND"
) {
    let chosen = select_in_logical_operator_data_structure(data, id);
    chosen.childs.push({
        id: unique_id_generator(),
        NOT,
        operator,
        nodes: [],
        childs: [],
    });
}

function ungroup_logical_operator_data_structure(data, id) {
    let parent = select_in_logical_operator_data_structure(data, id, true);
    if (!parent) {
        return;
    }
    let chosen = select_in_logical_operator_data_structure(data, id);
    chosen.nodes.forEach(function (singleNode) {
        parent.nodes.push(singleNode);
    });
    delete_logical_operator_data_structure(data, id);
}

setInterval(function () {
    console.log(allData);
}, 2000);

function select_in_logical_operator_data_structure(
    data,
    id = data.id,
    parentMode = false
) {
    let find = false;
    let resultInAll;
    if (data === allData) {
        data.forEach(function (singleData) {
            if (select(singleData, id, parentMode)) {
                resultInAll = select(singleData, id, parentMode);
            }
        });
        return resultInAll;
    } else {
        return select(data, id, parentMode);
    }

    function select(data, id, parentMode) {
        let indexArray = index_array_node_in_logical_operator_data_structure(
            data,
            id
        );
        if (indexArray) {
            find = true;
        } else {
            find = false;
        }

        if (!find) {
            return false;
        }

        if (parentMode) {
            indexArray.pop();
        }

        if (indexArray.length == 0) {
            return false;
        }

        if (indexArray.length == 1) {
            return data;
        }

        let result = data;
        if (indexArray.length >= 2) {
            //result = allData[0];
            indexArray.forEach(function (singleIndex, index) {
                if (index === indexArray.length - 1) {
                    result = result[singleIndex];
                } else if (index === 0) {
                    result = result.childs;
                } else {
                    result = result[singleIndex];
                    result = result.childs;
                }
            });
        }
        return result;
    }
}

function index_array_node_in_logical_operator_data_structure(data, id) {
    let finIndex = [];
    function find(data, dataId, currentIndex = 0) {
        if (data && data.id == dataId) {
            finIndex.push(currentIndex);
            // find in root
        } else {
            if (data && data.childs) {
                finIndex.push(currentIndex);
                let oldlen = finIndex.length;
                data.childs.forEach(function (singleNode, index) {
                    find(singleNode, dataId, index);
                });
                let newlen = finIndex.length;
                if (newlen == oldlen) {
                    finIndex.pop();
                }
            }
        }
    }
    find(data, id);
    return finIndex;
}
/* END Logic of data structure */

/* START elements factory */
function create_AND_OR_NOT_element() {
    document.body.appendChild(newElem);
}

function create_elements_of_one_node_of_logical_operator_data_structure(
    data,
    parendNode,
    mode = "if"
) {
    if (!data || Object.keys(data).length === 0) {
        return;
    }

    if (mode == "if") {
        //
        let newElemIfSentenceComplete = document.createElement("div");

        newElemIfSentenceComplete.setAttribute("class", "if-sentence-complete");
        newElemIfSentenceComplete.setAttribute(
            "id",
            "if-sentence-complete-" + data.id
        );

        if (data.NOT) {
            let newElemSelect = document.createElement("div");
            newElemSelect.setAttribute(
                "class",
                "w-full  my-0 px-3 py-2 border border-solid border-gray-300"
            );
            newElemSelect.innerHTML =
                `<select id="not-` +
                data.id +
                `" class="rounded px-2 py-1 text-xs border border-solid border-300-gray">
    <option value="AND">و</option>
    <option value="OR">یا</option>
    <option value="NOT" selected>نفی</option>
</select>`;
            newElemIfSentenceComplete.appendChild(newElemSelect);
            parendNode.appendChild(newElemIfSentenceComplete);
        }

        //
        let newElemSelect = document.createElement("div");
        newElemSelect.setAttribute(
            "class",
            "w-full  my-0 px-3 py-2 border border-solid border-gray-300"
        );
        newElemSelect.innerHTML =
            `<select id="operator-` +
            data.id +
            `" class="rounded px-2 py-1 text-xs border border-solid border-300-gray">
    <option value="AND">و</option>
    <option value="OR">یا</option>
    <option value="NOT">نفی</option>
</select>`;
        newElemIfSentenceComplete.appendChild(newElemSelect);
        parendNode.appendChild(newElemIfSentenceComplete);

        //
        let selected = document.getElementById("operator-" + data.id);
        selected.value = data.operator;

        //
        let newElemSentenceContainer = document.createElement("div");
        newElemSentenceContainer.setAttribute("class", "sentences");
        newElemSentenceContainer.setAttribute("id", "if-sentence-" + data.id);
        newElemIfSentenceComplete.appendChild(newElemSentenceContainer);

        //

        let newElemIfSentenceChild = document.createElement("div");
        newElemIfSentenceChild.setAttribute("class", "if-sentence-child");
        if (data.childs && data.childs.length) {
            newElemIfSentenceComplete.appendChild(newElemIfSentenceChild);
        }

        //
        data.childs &&
            data.childs.forEach(function (singleChild) {
                create_elements_of_one_node_of_logical_operator_data_structure(
                    singleChild,
                    newElemIfSentenceChild
                );
            });

        //
        data.nodes &&
            data.nodes.forEach(function (singleNode, index) {
                create_new_sentence(
                    newElemSentenceContainer,
                    singleNode.sentence,
                    index
                );
            });
    } else {
        parendNode.innerHTML = "";
        let newElemNonIfSentenceComplete = document.createElement("div");

        newElemNonIfSentenceComplete.setAttribute(
            "class",
            "nonIf-sentence-complete"
        );
        newElemNonIfSentenceComplete.setAttribute(
            "id",
            "nonIf-sentence-complete-" + data.id
        );

        //
        let newElemSentenceContainer = document.createElement("div");
        newElemSentenceContainer.setAttribute("class", "nonIf-sentences");
        newElemSentenceContainer.setAttribute(
            "id",
            "nonIf-sentence-" + data.id
        );

        //
        data.nodes &&
            data.nodes.forEach(function (singleNode, index) {
                create_new_sentence(
                    newElemSentenceContainer,
                    singleNode.sentence,
                    index
                );
            });

        newElemNonIfSentenceComplete.appendChild(newElemSentenceContainer);
        parendNode.appendChild(newElemNonIfSentenceComplete);
    }
}

function create_new_sentence(parentNode, sentence, id) {
    let newElem = document.createElement("div");
    newElem.classList.add("sentence");
    newElem.innerHTML = sentence;
    newElem.id = id;
    parentNode.appendChild(newElem);
}

/* END elements factory */

function count_of_extra_ifThens() {
    if (allData.length < 3) {
        return 0;
    } else {
        return (allData.length - 3) / 2;
    }
}

function rebuild_page() {
    result = [];
    let dataContainer = document.querySelectorAll(".if-then");
    dataContainer.forEach(function (single, index) {
        if (index == 0) {
            return;
        }
        single.remove();
    });
    for (let index = 0; index < count_of_extra_ifThens(); index++) {
        add_new_if_then();
    }

    dataContainer = document.querySelectorAll(".data-container");
    dataContainer.forEach(function (single) {
        let allDataIndex = single.parentNode.parentNode.dataset.index;
        let mode = change_all_data_index_to_mode(allDataIndex);
        single.innerHTML = "";
        create_elements_of_one_node_of_logical_operator_data_structure(
            allData[allDataIndex],
            single,
            mode
        );
    });

    let ifArray = [0];
    allData.forEach(function (single, index) {
        if (index >= 3) {
            if ((index - 3) % 2 == 0) {
                ifArray.push(index);
            }
        }
    });

    let ifSummaries = document.querySelectorAll(".if-summary");

    ifSummaries.forEach(function (single, index) {
        single.innerHTML = "";
        result = [];
        single.innerHTML = create_logical_operator_data_structure_sentence(
            allData[ifArray[index]]
        );
    });

    lowerModalData = {
        allData,
    };
    localStorage.setItem("data", JSON.stringify(lowerModalData));
    check_if_lower_modal_save_button_should_be_actived();
}

rebuild_page();

/* START add if then block to page */
let upperModalOpeners = document.querySelectorAll(".open-upper");

let addIfThenButton = document.getElementById("add-if-then");

// TODO
addIfThenButton.addEventListener("click", function () {
    allData.push({}, {});
    rebuild_page();
});

function add_new_if_then() {
    let ifThens = document.querySelectorAll(".if-then");
    let newIfThen = ifThens[0].cloneNode(true);
    newIfThen.children[0].children[0].innerHTML = "و اگر";
    newIfThen.querySelector(".close-if-then").style.display = "block";
    ifThens[ifThens.length - 1].parentNode.insertBefore(
        newIfThen,
        ifThens[ifThens.length - 1].nextSibling
    );
    let ifThenClosers = newIfThen.querySelectorAll(".close-if-then");
    add_close_events(ifThenClosers[0]);

    let currentCount = document.querySelectorAll(".block-container").length;
    newIfThen.children[0].dataset.index = currentCount - 2;
    newIfThen.children[1].dataset.index = currentCount - 1;

    let upperModalOpeners = newIfThen.querySelectorAll(".open-upper");
    add_open_upper_events(upperModalOpeners[0]);
    add_open_upper_events(upperModalOpeners[1]);

    let dataContainer = newIfThen.querySelectorAll(".data-container");
    add_data_container_events(dataContainer[0]);
    add_data_container_events(dataContainer[1]);
}

let ifThenClosers = document.querySelectorAll(".close-if-then");
ifThenClosers.forEach(function (single) {
    add_close_events(single);
});

function add_close_events(node) {
    node.addEventListener("click", function () {
        let allDataIndex = node.parentNode.children[0].dataset.index;
        allData.splice(allDataIndex, 2);
        rebuild_page();
    });
}

upperModalOpeners.forEach(function (single) {
    add_open_upper_events(single);
});

function add_open_upper_events(node) {
    node.addEventListener("click", () => {
        latestElementRightClick.id = null;
        open_modal(upperModal, find_add_data_index(node))
    }
    );
}

function find_add_data_index(node) {
    return node.parentNode.parentNode.dataset.index;
}

switch_to_default_form();

/* END add if then block to page */
