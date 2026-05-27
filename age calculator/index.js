function calculateAge() {
    var dob = document.getElementById("dob").value;
    var error = document.getElementById("error");
    var result = document.getElementById("result");

    error.textContent = "";
    result.style.display = "none";

    if (dob == "") {
        error.textContent = "Please enter your date of birth!";
        return;
    }

    var birthDate = new Date(dob);
    var today = new Date();

    if (birthDate > today) {
        error.textContent = "Date cannot be in the future!";
        return;
    }

    var years = today.getFullYear() - birthDate.getFullYear();
    var months = today.getMonth() - birthDate.getMonth();
    var days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        var lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById("years").textContent = years;
    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;

    result.style.display = "block";
}
