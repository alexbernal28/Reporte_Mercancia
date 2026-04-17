const inputUser = document.getElementById("user");
const inputPassword = document.getElementById("password");

function InputValidate(inputs, isValid) {

    const value = inputs.value.trim();
    const divError = inputs.nextElementSibling;

    // Mostrar u ocultar error

    if (value === "") {
        inputs.classList.add("is-invalid");
        if (divError) {
            divError.style.display = "block";
        }
        isValid = false;
    } else {
        inputs.classList.remove("is-invalid");
        if (divError) {
            divError.textContent = "";
            divError.style.display = "none";
        }
    }

    return isValid;
}

function validate() {
    let isvalid = true;

    isvalid = InputValidate(inputUser, isvalid);
    isvalid = InputValidate(inputPassword, isvalid);

    return isvalid;
}