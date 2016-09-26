document.addEventListener("DOMContentLoaded", membersListAutocomplete);

function membersListAutocomplete() {
    var datalist = document.getElementById('json-members-list'),
        input = document.getElementById('members-list'),
        request = new XMLHttpRequest();

    request.onreadystatechange = function (response) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                var memberNameOptions = JSON.parse(request.responseText);
                memberNameOptions.forEach(function (item) {
                    var option = document.createElement('option');
                    option.value = item.firstName + " " + item.lastName;
                    datalist.appendChild(option);
                });
                input.placeholder = "e.g. existing member name";
            }
            else {
                input.placeholder = "Could not load options";
            }
        }
    };

    input.placeholder = "Loading options...";

    request.open('GET', '/members', true);
    request.send();request.open('GET', '/members', true);
    request.send();
}
