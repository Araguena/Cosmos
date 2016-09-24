document.addEventListener("DOMContentLoaded", onDocumentLoaded);

function onDocumentLoaded() {

    getExistingMembersFromDB();

    var memberSubmissionForm = document.querySelector(".member-form form");
    memberSubmissionForm.addEventListener("submit", createNewMember);

    var memberContainer = document.querySelector(".js-team");
    memberContainer.addEventListener("click", displaySendEmailForm);


    function getExistingMembersFromDB() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", existingMembersReceived);
        xhr.addEventListener("error", memberLoadingFailed);

        xhr.open('GET', '/members');
        xhr.send();
    }

    function displaySendEmailForm() {

        var sendEmailDialog = document.getElementById("sendEmailToMember"),
            closeDialogBtn = document.querySelector(".closeEmailDialogBtn"),
            sendMailButton = document.querySelector(".js-send-email");

        sendEmailDialog.style.display = "block";


        closeDialogBtn.addEventListener("click", function () {
            sendEmailDialog.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target == sendEmailDialog) {
                sendEmailDialog.style.display = "none";
            }
        });

        var target = event.target;
        console.log(target);

        if (target.classList.contains("js-send-mail-to-member")) {
            while (target != event.currentTarget) {
                target = target.parentNode;
                if (target.classList.contains("team__member")) {
                    console.log(target, target.getAttribute('data-member-id'));
                    var memberId = target.getAttribute('data-member-id');
                    break;
                }
            }
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var memberData = JSON.parse(xhr.responseText);
                    console.log("Member data", memberData);
                    var memberEmail = memberData.email;

                    var sendToField = document.querySelector(".js-send-to-email");
                    sendToField.value = memberEmail;
                    sendToField.placeholder = memberEmail;
                }
                else {
                    console.log("Could not load options for member email");
                }
            }

        };
        xhr.open('GET', '/members/' + memberId, true);
        xhr.send();

        sendMailButton.onclick = function() {
            var emailForm = document.querySelector("#sendEmailToMember form");
            var emailService = "sendgrid",
                emailTemplate = "member_contacted",
                time = moment();
                time = time.format('MMMM D, YYYY'),
                data = {
                    emailAuthorName: emailForm.emailAuthor.value,
                    emailAuthorAddress: emailForm.emailAuthorEmail.value,
                    sendToMemberEmail: emailForm.memberEmail.value,
                    messageBody: emailForm.emailBody.value,
                    messageTime: time
                };
            emailjs.send(emailService, emailTemplate, data);
            sendEmailDialog.style.display = "none";
        }
    }

    function existingMembersReceived() {
        if (this.status >= 200) {
            var members = JSON.parse(this.responseText);
            members.forEach(function (member) {
                drawMember(member);
            });
        }
        else {
            memberLoadingFailed();
        }
        updateMemberCount();
    }

    function memberLoadingFailed() {
        alert("Could not retrieve existing members");
    }

    function drawMember(input) {
        var member = document.createElement('div');
        member.classList.add("team__member");
        member.innerHTML = "<img class='img-fluid img-circle' src='" + input.image + "'><h3>" +
            input.firstName + "<br>" + input.lastName + "</h3><p>" + input.position + "</p>" + "<button class='send-mail-btn'>" +
            "<i class='fa fa-envelope js-send-mail-to-member' aria-hidden='true'>" +
            "</i></button>" + "<a class='link-to-fb' href='https://www.facebook.com'><i class='fa fa-facebook aria-hidden='true'></a>";
        member.setAttribute("data-member-id", input.id);

        var membersContainer = document.querySelector(".js-team");
        membersContainer.insertBefore(member, membersContainer.firstChild);
    }

    function createNewMember() {
        event.preventDefault();
        getUserImageFromAPI();
    }

    //Request to Random User API
    function getUserImageFromAPI() {
        var userGender = memberSubmissionForm.memberGender.value,
            getImageRequest = new XMLHttpRequest();
        getImageRequest.addEventListener("load", sendNewMemberDataToDB);
        getImageRequest.addEventListener("error", function () {
            alert("Could not load image");
            sendNewMemberDataToDB();
        });

        getImageRequest.open('GET', 'https://randomuser.me/api/' + '?gender=' + userGender);
        getImageRequest.setRequestHeader('Content-Type', 'application/json');
        getImageRequest.send();
    }

    function sendNewMemberDataToDB() {
        var userImage = JSON.parse(this.responseText);
        //console.log("Result from API:", userImage);
        //console.log("Picture from API:", userImage.results[0].picture.large);
        var fallbackUserImageSrc = "styles/img/user.png",
            userImageSrc = userImage.results[0].picture.large || fallbackUserImageSrc;

        var xhr = new XMLHttpRequest(),
            memberCreationTime = moment(),
            memberData = {
                firstName: memberSubmissionForm.memberFirstName.value,
                lastName: memberSubmissionForm.memberLastName.value,
                email: memberSubmissionForm.memberEmail.value,
                gender: memberSubmissionForm.memberGender.value,
                position: "New member",
                creationTime: memberCreationTime,
                image: userImageSrc
            };

        if ((memberSubmissionForm.memberFirstName.value == "") || (memberSubmissionForm.memberLastName.value == "") ||
            (memberSubmissionForm.memberEmail.value == "")) {
            alert("Provide your first name, last name, and email");
            return false;
        }

        memberData = JSON.stringify(memberData);
        xhr.addEventListener("load", memberDataSent);
        xhr.addEventListener("error", memberCreationFailed);

        xhr.open('POST', '/members');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(memberData);
    }

    function memberDataSent() {
        var memberData = JSON.parse(this.responseText);
        drawMember(memberData);
        updateMemberCount();

        function sendEmailToAdmin() {
            var emailService = "gmail",
                emailTemplate = "new_member_added",
                data = {
                    memberName: memberData.firstName + " " + memberData.lastName,
                    memberEmail: memberData.email,
                    memberAddedOn: memberData.creationTime,
                    memberId: memberData.id
                };
            emailjs.send(emailService, emailTemplate, data);
        }

        sendEmailToAdmin();
    }

    function memberCreationFailed() {
        alert("Could not create member");
    }

    function updateMemberCount() {
        var totalMemberCount = 0,
            latestMemberCount = 0;

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var members = JSON.parse(this.responseText),
                    totalMemberCount = members.length;

                //Identify number of members added within latest hours

                var hoursForComparison = document.querySelector(".js-hours-diff").getAttribute("data-latest-hours"),
                    currentTime = moment();

                for (var i = 0; i < members.length; i++) {
                    var memberCreationTime = moment(members[i].creationTime),
                        timeDifference = currentTime.diff(memberCreationTime, 'hours');

                    if (timeDifference <= hoursForComparison) {
                        latestMemberCount++;
                    }

                    //console.log("Time difference is ", timeDifference);

                }
                //console.log("Member count received from DB is ", memberCountFromDB, "Length is ", memberCountFromDB.length);
                console.log("Hours diff value is", hoursForComparison);
            }

            //Update total member count and latest member count on the UI
            var totalMemberCountContainer = document.querySelector('.js-totalMemberCount');
            totalMemberCountContainer.innerHTML = totalMemberCount;

            var latestMemberCountContainer = document.querySelector('.js-latestMemberCount');
            latestMemberCountContainer.innerHTML = latestMemberCount;
        };

        xhr.open('GET', '/members');
        xhr.send();

    }
}