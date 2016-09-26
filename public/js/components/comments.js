document.addEventListener("DOMContentLoaded", onDocumentLoad);

function onDocumentLoad() {
    getExistingCommentsFromDB();
    generateOptionsForCommentFilters();

    //=====================================================================================================
    //Add event listeners for creating and deleting comments
    //=====================================================================================================

    var commentSubmissionForm = document.querySelector(".feedback-form form");
    commentSubmissionForm.addEventListener("submit", createComment);

    var commentsContainer = document.querySelector(".comments-list");
    commentsContainer.addEventListener("click", deleteCommentFromDB);
    commentsContainer.addEventListener("click", displayEditCommentDialog);

    //Variable that controls the image to be displayed in comment: if comment is added by existing member, use his photo recorded in DB.
    //Otherwise, use a default 'anonymous user' image.
    var imageSrc = 'styles/img/user.png';


    //=====================================================================================================
    //Add event listeners for comment filtering
    //=====================================================================================================
    var filterCommentsButton = document.querySelector(".js-filter-comments");
    filterCommentsButton.addEventListener("click", filterCommentsOnUI);

    var clearCommentsFilterButton = document.querySelector(".js-display-all-comments");
    clearCommentsFilterButton.addEventListener("click", clearCommentsFilteringOnUI);

    function filterCommentsOnUI() {
        var commentDropdownFilterByName = document.querySelector(".js-comment-filter-by-user"),
            commentDropdownFilterByYear = document.querySelector(".js-comment-filter-by-year"),
            commentDropdownFilterByMonth = document.querySelector(".js-comment-filter-by-month"),
            name = commentDropdownFilterByName.value,
            year = commentDropdownFilterByYear.value,
            month = parseInt(commentDropdownFilterByMonth.value);

        var comments = document.querySelectorAll(".commentContainer");

        for (var i = 0; i < comments.length; i++) {
            console.log(comments[i].getAttribute('data-comment-author'));
            if (comments[i].getAttribute('data-comment-author') != name && name != "Name") {
                //console.log("Name in filter does not match");
                comments[i].style.display = 'none';
            }
            if (comments[i].getAttribute('data-comment-year') != year && year != "Year") {
                //console.log("Year in filter does not match");
                comments[i].style.display = 'none';
            }
            if (comments[i].getAttribute('data-comment-month') != month && month != 0) {
                //console.log("Month in filter does not match", comments[i].getAttribute('data-comment-month'), month);
                comments[i].style.display = 'none';
            }

        }
    }

    function clearCommentsFilteringOnUI() {

        var comments = document.querySelectorAll(".commentContainer");

        for (var i = 0; i < comments.length; i++) {
            if (comments[i].hasAttribute("style")) {
                comments[i].removeAttribute("style");
            }
        }

        //Reset values for <select> elements
        var commentDropdownFilterByName = document.querySelector(".js-comment-filter-by-user"),
            commentDropdownFilterByYear = document.querySelector(".js-comment-filter-by-year");
        commentDropdownFilterByMonth = document.querySelector(".js-comment-filter-by-month");

        commentDropdownFilterByName.options[0].selected = true;
        commentDropdownFilterByYear.options[0].selected = true;
        commentDropdownFilterByMonth.options[0].selected = true;
        commentDropdownFilterByMonth.setAttribute("disabled", "disabled");
    }

    function generateOptionsForCommentFilters() {

        var websiteCreationTime = moment("2012-10-22");

        //Options for filtering comments by comment author
        var commentDropdownFilterByName = document.querySelector(".js-comment-filter-by-user");
        var commentFilterByMonth = document.querySelector(".js-comment-filter-by-month");

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var commentData = JSON.parse(xhr.responseText);
                    commentData.forEach(function (item) {
                        var option = document.createElement('option');
                        option.value = item.name;
                        option.innerHTML = item.name;
                        commentDropdownFilterByName.appendChild(option);
                    });
                }
                else {
                    console.log("Could not load options for filtering comments by name");
                }
            }
        };
        xhr.open('GET', '/comments', true);
        xhr.send();

        //Generate options for filtering comments by years: from site creation year to current year
        //Value undefined if I put it at the top of the file
        var commentDropdownFilterByYear = document.querySelector(".js-comment-filter-by-year"),
            minCommentYear = parseInt(websiteCreationTime.format('YYYY')),
            maxCommentYear = parseInt(moment().format('YYYY'));

        for (var i = minCommentYear; i <= maxCommentYear; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            commentDropdownFilterByYear.appendChild(option);
        }

        commentDropdownFilterByYear.addEventListener("click", function enableCommentFilteringByMonth() {
            if (commentDropdownFilterByYear.value != 'false') {
                commentFilterByMonth.disabled = false;
            }
            else {
                commentFilterByMonth.disabled = true;
            }
        });
    }

    function getExistingCommentsFromDB() {
        var request = new XMLHttpRequest();
        request.addEventListener("load", existingCommentsReceived);
        request.addEventListener("error", commentLoadingFailed);

        request.open('GET', '/comments');
        request.send();
    }

    function existingCommentsReceived() {
        if (this.status >= 200) {
            var comments = JSON.parse(this.responseText);
            comments.forEach(function (comment) {
                drawComment(comment);
            })
        }
        else {
            commentLoadingFailed();
        }
    }

    function commentLoadingFailed() {
        alert("Could not retrieve existing comments");
    }

    function commentSendingFailed() {
        alert("Could not send your data");
    }

    function drawComment(input) {
        var comment = document.createElement('article');

        if (input.image === 'undefined' || !input.image) {
            input.image = 'styles/img/user.png';
        }

        var commentDateFromDB = moment(input.creationTime),
            commentDate = commentDateFromDB.format('MMMM D, YYYY'),
            commentTime = commentDateFromDB.format('HH:mm'),
            commentYear = commentDateFromDB.format('YYYY'),
            commentMonth = commentDateFromDB.format('MM');

        comment.setAttribute("data-id", input.id);
        comment.setAttribute("data-comment-author", input.name);
        comment.setAttribute("data-comment-year", commentYear);
        comment.setAttribute("data-comment-month", commentMonth);
        comment.className = "commentContainer";
        comment.innerHTML = "<img class='img-fluid img-circle' src='" + input.image + "'><header>Added by " + "<span class='data-comment-author-name'>" + input.name + "</span>" + "<br>" + " on " + commentDate + " at " +
            commentTime + "</header><p>" +
            input.message + "</p>" +
            "<footer>" + "<button class='delete-comment-btn'>" +
            "<i class='fa fa-times js-remove' aria-hidden='true'>" +
            "</i></button>" + "<button class='edit-comment-btn'>" +
            "<i class='fa fa-pencil js-edit-comment' aria-hidden='true'>" +
            "</i></button></footer>";

        var commentsContainer = document.querySelector(".comments-list");
        commentsContainer.insertBefore(comment, commentsContainer.firstChild);
    }

    function createComment(event) {
        event.preventDefault();
        console.log(event);

        setCommentImage();
    }

    function setCommentImage() {
        //If the name from comment exists in DB, then use member image instead of the default image
        var xhr = new XMLHttpRequest();

        xhr.addEventListener("load", function checkIfNameExistsInDB() {
            console.log(this.responseText);
            var memberData = JSON.parse(this.responseText),
                memberNameInComment = commentSubmissionForm.name.value;
            console.log(memberNameInComment);

            for (var i = 0; i < memberData.length; i++) {
                console.log(memberData[i]);
                var memberName = memberData[i].firstName + " " + memberData[i].lastName;
                if (memberName == memberNameInComment) {
                    imageSrc = memberData[i].image;
                    console.log(memberName, imageSrc);
                    break;
                }
            }
            sendCommentDataToDB();
        });

        xhr.addEventListener("error", function () {
            sendCommentDataToDB();
        });

        xhr.open('GET', '/members');
        xhr.send();
    }

    function sendCommentDataToDB() {
        var xhr = new XMLHttpRequest(),
            commentData = {
                name: commentSubmissionForm.name.value,
                email: commentSubmissionForm.email.value,
                message: commentSubmissionForm.message.value,
                creationTime: moment(),
                image: imageSrc
            };
        commentData.message = commentData.message.trim().replace(/(<([^>]+)>)/ig, "");

        if (commentData.message == "") {
            alert("Add your message");
            return false;
        }

        commentData = JSON.stringify(commentData);

        xhr.addEventListener("load", commentSent);
        xhr.addEventListener("error", commentSendingFailed);

        xhr.open('POST', '/comments');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(commentData);
    }

    function commentSent() {
        var commentData = JSON.parse(this.responseText);
        drawComment(commentData);

        var commentDateFromDB = moment(commentData.creationTime);

        function sendEmailToAdmin() {
            var emailService = "gmail",
                emailTemplate = "new_comment_added",
                data = {
                    name: "James",
                    subject: "New comment added",
                    emailBody: "A new comment has been added to Cosmos page",
                    commentAuthorEmail: commentData.email,
                    time: commentDateFromDB
                };
            emailjs.send(emailService, emailTemplate, data);
        }

        sendEmailToAdmin();

        //Reset form values
        commentSubmissionForm.name.value = "";
        commentSubmissionForm.email.value = "";
        commentSubmissionForm.message.value = "";
    }


    function deleteCommentFromDB(event) {
        var target = event.target;

        if (target.classList.contains("js-remove")) {
            while (target != event.currentTarget) {
                target = target.parentNode;
                if (target.classList.contains("commentContainer")) break;
            }

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function () {
                deleteCommentOnUI(target);
            });
            xhr.addEventListener("error", commentDeletionFailed);

            xhr.open('DELETE', '/comments/' + target.getAttribute('data-id'));
            xhr.send();
        }
    }

    function deleteCommentOnUI(eventTarget) {
        commentsContainer.removeChild(eventTarget);
    }

    function commentDeletionFailed() {
        alert("Could not delete the comment");
    }

    function displayEditCommentDialog(event) {
        var editCommentDialog = document.getElementById("commentEditBox"),
            closeDialogBtn = document.querySelector(".closeDialogBtn"),
            sendNewCommentDataButton = document.querySelector(".js-send-new-cmnt-data");


        closeDialogBtn.addEventListener("click", function () {
            editCommentDialog.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target == editCommentDialog) {
                editCommentDialog.style.display = "none";
            }
        });

        var target = event.target;

        if (target.classList.contains("js-edit-comment")) {
            while (target != event.currentTarget) {
                target = target.parentNode;
                if (target.classList.contains("commentContainer")) {
                    break;
                }
            }
        }

        var message = target.childNodes[2];
        var name = target.childNodes[1].childNodes[1];

        var editCommentForm = document.querySelector("#commentEditBox form");
        editCommentForm.commentAuthor.value = name.innerHTML;
        editCommentForm.commentMessage.value = message.innerHTML;

        editCommentDialog.style.display = "block";

        sendNewCommentDataButton.onclick = function () {
            editCommentDialog.style.display = "none";
            var newCommentMessage = editCommentForm.commentMessage.value,
                newCommentData = {
                    message: newCommentMessage
                };

            newCommentData = JSON.stringify(newCommentData);

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function (response) {
                var input = JSON.parse(response.target.responseText),
                    commentID = input.id,
                    selector = "[data-id='" + commentID + "']",
                    comment = document.querySelectorAll(selector)[0],
                    message = comment.querySelector("p");
                message.innerHTML = input.message;
            });

            xhr.addEventListener("error", function () {
                alert("Could not send updated comment data");
            });
            //TODO: fix request so that we do not overwrite existing data
            xhr.open('PUT', '/comments/' + target.getAttribute('data-id'));
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(newCommentData);
        };
    }
}


