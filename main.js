/* START helper functions */
let latestId = -1;
let unique_id_generator = (function (s) {
    return function () {
        s += 1;
        latestId = s;
        localStorage.setItem("latestId", latestId);
        return s;
    };
})(latestId);
latestId = localStorage.getItem("latestId");
/* END helper functions */

// for opening upper modal just add class open-upper to element and so on...

let lowerModal = document.querySelector("#lower-modal");
let upperModal = document.querySelector("#upper-modal");

let upperModalClosers = document.querySelectorAll(".close-upper");
let ifOpener = document.getElementById("if-opener");
let thenOpener = document.getElementById("then-opener");
let elseOpener = document.getElementById("else-opener");

let lowerModalClosers = document.querySelectorAll(".close-lower");
let lowerModalOpeners = document.querySelectorAll(".open-lower");

let saveUpper = document.getElementById("save-upper");

let ifSummary = document.getElementById("if-summary");

let sendNotification = document.getElementById("send-notification");
let inputName = document.getElementById("input-name");
let nameIsRequired = document.getElementById("name-is-required");

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
close_modal(upperModal);
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
    if (inputName.value) {
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

ifOpener.addEventListener("click", () => open_modal(upperModal));
thenOpener.addEventListener("click", () => open_modal(upperModal, "then"));
elseOpener.addEventListener("click", () => open_modal(upperModal, "else"));

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
    let mode = saveUpper.dataset.mode;
    let id = saveUpper.dataset.number;
    save_upper_modal(mode, id);
    persist_rules_state(mode);
    close_modal(upperModal);
});

function close_modal(node) {
    node.style.opacity = 0;
    node.style.visibility = "hidden";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,-100px)";
}

function open_modal(node, mode = "if", id = false) {
    reset_upper_modal();
    let operator = document.getElementById("operator");
    let saveUpper = document.getElementById("save-upper");
    node.style.opacity = 100;
    node.style.visibility = "visible";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,0)";
    if (mode == "if") {
        // nothing
        saveUpper.dataset.mode = "if";
    } else if (mode == "then") {
        operator.innerHTML = thenOperatorInnerHTML;
        saveUpper.dataset.mode = "then";
    } else if (mode == "else") {
        operator.innerHTML = elseOperatorInnerHTML;
        saveUpper.dataset.mode = "else";
    }
    if (id) {
        saveUpper.dataset.number = id;
    } else {
        delete saveUpper.dataset.number;
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
operatorValue.addEventListener("change", function () {
    if (operatorValue.value == "Blank") {
        switch_to_blank_mode();
    } else if (operatorValue.value == "Attribute") {
        switch_to_attribute_mode();
    } else if (operatorValue.value == "Attribute value") {
        switch_to_attribute_value_mode();
        check_if_upper_modal_save_button_should_be_actived();
    }
});

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

function check_if_second_attribute_alert_should_be_shown() {
    let secondAttribute = document.getElementById("second-attribute");
    let valueIsRequired = document.getElementById("value-is-required");
    secondAttribute.addEventListener("change", function () {
        check_if_second_attribute_alert_should_be_shown();
        check_if_upper_modal_save_button_should_be_actived();
    });
    if (operatorValue.value == "Attribute value") {
        if (!secondAttribute.value) {
            secondAttribute.classList.add("alert");
            valueIsRequired.classList.remove("invisible");
        } else {
            secondAttribute.classList.remove("alert");
            valueIsRequired.classList.add("invisible");
        }
    } else {
        valueIsRequired.classList.add("invisible");
    }
}

// END change second attribute when operator value change

/* END operator change events */
function save_upper_modal(mode = "if", id = false) {
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
            conditionSentence = conditionSentence + " Blank";
            break;
        default:
            conditionSentence = conditionSentence + " " + selects[3].value;
    }

    if (id) {
        let conditionState = {
            id: +id,
            attribute: selects[0].value,
            operator: selects[1].value,
            operatorValue: selects[2].value,
            secondAttribute: secondAttribute.value,
            sentence: conditionSentence,
            mode,
        };
        localStorage.setItem(id, JSON.stringify(conditionState));
    } else {
        let conditionState = {
            id: unique_id_generator(),
            attribute: selects[0].value,
            operator: selects[1].value,
            operatorValue: selects[2].value,
            secondAttribute: secondAttribute.value,
            sentence: conditionSentence,
            mode,
        };
        localStorage.setItem(latestId, JSON.stringify(conditionState));
    }
}

function persist_rules_state(mode = "if") {
    if (mode == "if") {
        // START if
        let newIfSentence = "";
        let ifSentences = document.getElementById("if-sentences");
        ifSentences.innerHTML = "";
        for (let index = 0; index <= latestId; index++) {
            if (
                localStorage.getItem(index) &&
                !document.getElementById(
                    JSON.parse(localStorage.getItem(index)).id
                ) &&
                JSON.parse(localStorage.getItem(index)).mode == mode
            ) {
                create_new_sentence_and_append(ifSentences, index);
            }
        }
        // TODO
        // ifSummary.innerHTML += newIfSentence + " AND ";

        // END if
    } else if (mode == "then") {
        // START then
        let thenSentences = document.getElementById("then-sentences");
        thenSentences.innerHTML = "";
        for (let index = 0; index <= latestId; index++) {
            if (
                localStorage.getItem(index) &&
                !document.getElementById(
                    JSON.parse(localStorage.getItem(index)).id
                ) &&
                JSON.parse(localStorage.getItem(index)).mode == mode
            ) {
                create_new_sentence_and_append(thenSentences, index);
            }
        }
        // END then
    } else if (mode == "else") {
        // START else
        let elseSentences = document.getElementById("else-sentences");
        elseSentences.innerHTML = "";
        for (let index = 0; index <= latestId; index++) {
            if (
                localStorage.getItem(index) &&
                !document.getElementById(
                    JSON.parse(localStorage.getItem(index)).id
                ) &&
                JSON.parse(localStorage.getItem(index)).mode == mode
            ) {
                create_new_sentence_and_append(elseSentences, index);
            }
        }
        // END else
    }
}

function create_new_sentence_and_append(parentNode, index) {
    let newElem = document.createElement("div");
    newElem.classList.add("sentence");
    newElem.innerHTML = JSON.parse(localStorage.getItem(index)).sentence;
    newElem.id = JSON.parse(localStorage.getItem(index)).id;
    parentNode.appendChild(newElem);
}

function load_upper_modal(id) {
    data = JSON.parse(localStorage.getItem(id));
    let attribute = document.getElementById("attribute");
    let operator = document.getElementById("operator");
    let operatorValue = document.getElementById("operator-value");
    change_selected_option_by_text(attribute, data.attribute);
    change_selected_option_by_text(operator, data.operator);
    change_selected_option_by_text(operatorValue, data.operatorValue);

    if (data.operatorValue == "Attribute value") {
        switch_to_attribute_value_mode();
        let secondAttribute = document.getElementById("second-attribute");
        secondAttribute.value = data.secondAttribute;
    } else if (data.operatorValue == "Blank") {
        switch_to_blank_mode();
    } else {
        switch_to_attribute_mode();
        let secondAttribute = document.getElementById("second-attribute");
        change_selected_option_by_text(secondAttribute, data.secondAttribute);
    }
}

function change_selected_option_by_text(selectNode, text) {
    const options = Array.from(selectNode.options);
    const optionToSelect = options.find((item) => item.text === text);
    optionToSelect.selected = true;
}

/* START Context menu */
let contextMenu = document.getElementById("context-menu");
let ifSentencesContainer = document.getElementById("if-sentences-container");
let latestElementRightClick;
ifSentencesContainer.addEventListener("contextmenu", (e) => {
    latestElementRightClick = e.target.id;
    show_context_menu(e, contextMenu, "if");
});
document.body.addEventListener("click", (e) => {
    hide_context_menu(e, contextMenu);
});

let thenSentencesContainer = document.getElementById(
    "then-sentences-container"
);
let elseSentencesContainer = document.getElementById(
    "else-sentences-container"
);
thenSentencesContainer.addEventListener("contextmenu", (e) => {
    latestElementRightClick = e.target.id;
    show_context_menu(e, contextMenu, "then");
});
elseSentencesContainer.addEventListener("contextmenu", (e) => {
    latestElementRightClick = e.target.id;
    show_context_menu(e, contextMenu, "else");
});

let addMenu = document.getElementById("add");
let editMenu = document.getElementById("edit");
let deleteMenu = document.getElementById("delete");
let groupMenu = document.getElementById("group");
let ungroupMenu = document.getElementById("ungroup");

deleteMenu.addEventListener("click", function () {
    localStorage.removeItem(latestElementRightClick);
    persist_rules_state("if");
    persist_rules_state("then");
    persist_rules_state("else");
});

addMenu.addEventListener("click", function () {
    open_modal(upperModal, addMenu.dataset.mode);
});

editMenu.addEventListener("click", function () {
    open_modal(upperModal, editMenu.dataset.mode, latestElementRightClick);
    console.log(latestElementRightClick);
    load_upper_modal(latestElementRightClick);
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
    e.preventDefault();
    e.stopPropagation();
    if (contextMenu.style.display === "none") {
        contextMenu.style.display = "block";
    }
    contextMenu.style.top = e.clientY + "px";
    contextMenu.style.left = e.clientX + "px";

    addMenu.dataset.mode = mode;
    editMenu.dataset.mode = mode;
    deleteMenu.dataset.mode = mode;
    if (mode == "then" || "else") {
        groupMenu.style.display = "none";
        ungroupMenu.style.display = "none";
    } else if (mode == "if") {
        groupMenu.style.display = "block";
        ungroupMenu.style.display = "block";
    }
}

function hide_context_menu(e, contextMenu) {
    e.stopPropagation();
    contextMenu.style.display = "none";
}

/* END Context menu */

/*
  {
    NOR : false,
    operator : OR,
    nodes : null,
    childs : {
      {
        NOR : false
        operator : AND,
        nodes : [1,2],
        childs : null
      },
      {
        NOR : false
        operator : AND,
        nodes : [3,4],
        childs : null
      }
    }
  }

result is 
    (1 AND 2 AND 3 AND !(5 OR 6 OR (7 AND 9)))
    (1 AND 2) OR (3 AND 4)
*/

// !(5 OR 6) OR (1 AND 2)

let data = {
    NOR: false,
    operator: "OR",
    nodes: [5, 6],
    childs: [
        {
            NOR: false,
            operator: "AND",
            nodes: [1, 2],
            childs: [
                {
                    NOR: false,
                    operator: "AND",
                    nodes: [12, 13],
                    childs: null,
                },
                {
                    NOR: false,
                    operator: "AND",
                    nodes: [14, 15],
                    childs: null,
                },
            ],
        },
        {
            NOR: false,
            operator: "AND",
            nodes: [3, 4],
            childs: null,
        },
    ],
};

let result = [];
function create_tree(data) {
    // there is no childs
    if (!data.childs) {
        if (data.NOR) {
            result.push("!");
        }
        if (data.nodes.length >= 2) {
            result.push("(");
        }
        data.nodes.forEach(function (singleNode, index, array) {
            result.push(singleNode);
            if (index !== array.length - 1) {
                result.push(data.operator);
            }
        });
        if (data.nodes.length >= 2) {
            result.push(")");
        }
    } else {
        result.push("(");
        if (data.NOR) {
            result.push("!");
        }
        // there is a number of child
        if (data.nodes) {
            data.nodes.forEach(function (singleNode, index, array) {
                result.push(singleNode);
                if (index !== array.length - 1) {
                    result.push(data.operator);
                }
            });
            result.push(data.operator);
        }
        data.childs.forEach(function (singleChild, index, array) {
            create_tree(singleChild);
            if (index !== array.length - 1) {
                result.push(data.operator);
            }
        });
        result.push(")");
    }
}
create_tree(data);
console.log(result.join(" "));
