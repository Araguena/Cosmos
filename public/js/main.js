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



document.addEventListener("DOMContentLoaded", initialize);

function initialize() {

    var timeOut = 1000;

    setTimeout(function() {
        var myLatLng = {lat: 49.85, lng: 24.0166666667};

        var map = new google.maps.Map(document.querySelector('.map-container'), {
            zoom: 13,
            center: myLatLng,
            scrollwheel: false,
            mapTypeId: 'roadmap',
            styles: [
                {
                    "featureType": "water",
                    "stylers": [
                        {"color": "#193341"}
                    ]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        {"color": "#406D80"},
                        {"visibility": "on"}
                    ]
                }, {
                    "featureType": "road.highway",
                    "stylers": [
                        {"color": "#194A57"}
                    ]
                }, {
                    "featureType": "road.local",
                    "stylers": [
                        {"color": "#406D80"}
                    ]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {"color": "#2C5A71"}
                    ]
                }, {
                    "featureType": "landscape",
                    "stylers": [
                        {"color": "#2C5A71"}
                    ]
                }, {
                    "featureType": "landscape.man_made",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {"color": "#2C5A71"},
                        {"visibility": "off"}
                    ]
                }, {
                    "featureType": "poi",
                    "stylers": [
                        {"visibility": "off"}
                    ]
                }, {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {"visibility": "on"},
                        {"color": "#ffffff"}
                    ]
                }
            ]
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Main office in Lviv'
        });

    }, timeOut);
}

document.addEventListener("DOMContentLoaded", topMenu);

function topMenu() {
    var menuIcon = document.getElementById("js-toggle-menu-button");
    menuIcon.addEventListener("click", toggleMenu);

    var menu = document.getElementById("myTopnav");
    menu.addEventListener("click", hideMenuItems);

    function toggleMenu() {

        if (menu.className === "topnav") {
            menu.className += " responsive";
        } else {
            menu.className = "topnav";
        }
    }

    function hideMenuItems(event) {
        var target = event.target;
        console.log(target);
        if (target.classList.contains("js-hide-menu")) {
            menu.className = "topnav";
        }
    }
}
/*!
 * parallax.js v1.4.2 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2016 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */

;(function ( $, window, document, undefined ) {

  // Polyfill for requestAnimationFrame
  // via: https://gist.github.com/paulirish/1579671

  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());


  // Parallax Constructor

  function Parallax(element, options) {
    var self = this;

    if (typeof options == 'object') {
      delete options.refresh;
      delete options.render;
      $.extend(this, options);
    }

    this.$element = $(element);

    if (!this.imageSrc && this.$element.is('img')) {
      this.imageSrc = this.$element.attr('src');
    }

    var positions = (this.position + '').toLowerCase().match(/\S+/g) || [];

    if (positions.length < 1) {
      positions.push('center');
    }
    if (positions.length == 1) {
      positions.push(positions[0]);
    }

    if (positions[0] == 'top' || positions[0] == 'bottom' || positions[1] == 'left' || positions[1] == 'right') {
      positions = [positions[1], positions[0]];
    }

    if (this.positionX != undefined) positions[0] = this.positionX.toLowerCase();
    if (this.positionY != undefined) positions[1] = this.positionY.toLowerCase();

    self.positionX = positions[0];
    self.positionY = positions[1];

    if (this.positionX != 'left' && this.positionX != 'right') {
      if (isNaN(parseInt(this.positionX))) {
        this.positionX = 'center';
      } else {
        this.positionX = parseInt(this.positionX);
      }
    }

    if (this.positionY != 'top' && this.positionY != 'bottom') {
      if (isNaN(parseInt(this.positionY))) {
        this.positionY = 'center';
      } else {
        this.positionY = parseInt(this.positionY);
      }
    }

    this.position =
      this.positionX + (isNaN(this.positionX)? '' : 'px') + ' ' +
      this.positionY + (isNaN(this.positionY)? '' : 'px');

    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
      if (this.imageSrc && this.iosFix && !this.$element.is('img')) {
        this.$element.css({
          backgroundImage: 'url(' + this.imageSrc + ')',
          backgroundSize: 'cover',
          backgroundPosition: this.position
        });
      }
      return this;
    }

    if (navigator.userAgent.match(/(Android)/)) {
      if (this.imageSrc && this.androidFix && !this.$element.is('img')) {
        this.$element.css({
          backgroundImage: 'url(' + this.imageSrc + ')',
          backgroundSize: 'cover',
          backgroundPosition: this.position
        });
      }
      return this;
    }

    this.$mirror = $('<div />').prependTo('body');

    var slider = this.$element.find('>.parallax-slider');
    var sliderExisted = false;

    if (slider.length == 0)
      this.$slider = $('<img />').prependTo(this.$mirror);
    else {
      this.$slider = slider.prependTo(this.$mirror)
      sliderExisted = true;
    }

    this.$mirror.addClass('parallax-mirror').css({
      visibility: 'hidden',
      zIndex: this.zIndex,
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    });

    this.$slider.addClass('parallax-slider').one('load', function() {
      if (!self.naturalHeight || !self.naturalWidth) {
        self.naturalHeight = this.naturalHeight || this.height || 1;
        self.naturalWidth  = this.naturalWidth  || this.width  || 1;
      }
      self.aspectRatio = self.naturalWidth / self.naturalHeight;

      Parallax.isSetup || Parallax.setup();
      Parallax.sliders.push(self);
      Parallax.isFresh = false;
      Parallax.requestRender();
    });

    if (!sliderExisted)
      this.$slider[0].src = this.imageSrc;

    if (this.naturalHeight && this.naturalWidth || this.$slider[0].complete || slider.length > 0) {
      this.$slider.trigger('load');
    }

  };


  // Parallax Instance Methods

  $.extend(Parallax.prototype, {
    speed:    0.2,
    bleed:    0,
    zIndex:   -100,
    iosFix:   true,
    androidFix: true,
    position: 'center',
    overScrollFix: false,

    refresh: function() {
      this.boxWidth        = this.$element.outerWidth();
      this.boxHeight       = this.$element.outerHeight() + this.bleed * 2;
      this.boxOffsetTop    = this.$element.offset().top - this.bleed;
      this.boxOffsetLeft   = this.$element.offset().left;
      this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;

      var winHeight = Parallax.winHeight;
      var docHeight = Parallax.docHeight;
      var maxOffset = Math.min(this.boxOffsetTop, docHeight - winHeight);
      var minOffset = Math.max(this.boxOffsetTop + this.boxHeight - winHeight, 0);
      var imageHeightMin = this.boxHeight + (maxOffset - minOffset) * (1 - this.speed) | 0;
      var imageOffsetMin = (this.boxOffsetTop - maxOffset) * (1 - this.speed) | 0;

      if (imageHeightMin * this.aspectRatio >= this.boxWidth) {
        this.imageWidth    = imageHeightMin * this.aspectRatio | 0;
        this.imageHeight   = imageHeightMin;
        this.offsetBaseTop = imageOffsetMin;

        var margin = this.imageWidth - this.boxWidth;

        if (this.positionX == 'left') {
          this.offsetLeft = 0;
        } else if (this.positionX == 'right') {
          this.offsetLeft = - margin;
        } else if (!isNaN(this.positionX)) {
          this.offsetLeft = Math.max(this.positionX, - margin);
        } else {
          this.offsetLeft = - margin / 2 | 0;
        }
      } else {
        this.imageWidth    = this.boxWidth;
        this.imageHeight   = this.boxWidth / this.aspectRatio | 0;
        this.offsetLeft    = 0;

        var margin = this.imageHeight - imageHeightMin;

        if (this.positionY == 'top') {
          this.offsetBaseTop = imageOffsetMin;
        } else if (this.positionY == 'bottom') {
          this.offsetBaseTop = imageOffsetMin - margin;
        } else if (!isNaN(this.positionY)) {
          this.offsetBaseTop = imageOffsetMin + Math.max(this.positionY, - margin);
        } else {
          this.offsetBaseTop = imageOffsetMin - margin / 2 | 0;
        }
      }
    },

    render: function() {
      var scrollTop    = Parallax.scrollTop;
      var scrollLeft   = Parallax.scrollLeft;
      var overScroll   = this.overScrollFix ? Parallax.overScroll : 0;
      var scrollBottom = scrollTop + Parallax.winHeight;

      if (this.boxOffsetBottom > scrollTop && this.boxOffsetTop <= scrollBottom) {
        this.visibility = 'visible';
        this.mirrorTop = this.boxOffsetTop  - scrollTop;
        this.mirrorLeft = this.boxOffsetLeft - scrollLeft;
        this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed);
      } else {
        this.visibility = 'hidden';
      }

      this.$mirror.css({
        transform: 'translate3d(0px, 0px, 0px)',
        visibility: this.visibility,
        top: this.mirrorTop - overScroll,
        left: this.mirrorLeft,
        height: this.boxHeight,
        width: this.boxWidth
      });

      this.$slider.css({
        transform: 'translate3d(0px, 0px, 0px)',
        position: 'absolute',
        top: this.offsetTop,
        left: this.offsetLeft,
        height: this.imageHeight,
        width: this.imageWidth,
        maxWidth: 'none'
      });
    }
  });


  // Parallax Static Methods

  $.extend(Parallax, {
    scrollTop:    0,
    scrollLeft:   0,
    winHeight:    0,
    winWidth:     0,
    docHeight:    1 << 30,
    docWidth:     1 << 30,
    sliders:      [],
    isReady:      false,
    isFresh:      false,
    isBusy:       false,

    setup: function() {
      if (this.isReady) return;

      var $doc = $(document), $win = $(window);

      var loadDimensions = function() {
        Parallax.winHeight = $win.height();
        Parallax.winWidth  = $win.width();
        Parallax.docHeight = $doc.height();
        Parallax.docWidth  = $doc.width();
      };

      var loadScrollPosition = function() {
        var winScrollTop  = $win.scrollTop();
        var scrollTopMax  = Parallax.docHeight - Parallax.winHeight;
        var scrollLeftMax = Parallax.docWidth  - Parallax.winWidth;
        Parallax.scrollTop  = Math.max(0, Math.min(scrollTopMax,  winScrollTop));
        Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, $win.scrollLeft()));
        Parallax.overScroll = Math.max(winScrollTop - scrollTopMax, Math.min(winScrollTop, 0));
      };

      $win.on('resize.px.parallax load.px.parallax', function() {
          loadDimensions();
          Parallax.isFresh = false;
          Parallax.requestRender();
        })
        .on('scroll.px.parallax load.px.parallax', function() {
          loadScrollPosition();
          Parallax.requestRender();
        });

      loadDimensions();
      loadScrollPosition();

      this.isReady = true;
    },

    configure: function(options) {
      if (typeof options == 'object') {
        delete options.refresh;
        delete options.render;
        $.extend(this.prototype, options);
      }
    },

    refresh: function() {
      $.each(this.sliders, function(){ this.refresh() });
      this.isFresh = true;
    },

    render: function() {
      this.isFresh || this.refresh();
      $.each(this.sliders, function(){ this.render() });
    },

    requestRender: function() {
      var self = this;

      if (!this.isBusy) {
        this.isBusy = true;
        window.requestAnimationFrame(function() {
          self.render();
          self.isBusy = false;
        });
      }
    },
    destroy: function(el){
      var i,
          parallaxElement = $(el).data('px.parallax');
      parallaxElement.$mirror.remove();
      for(i=0; i < this.sliders.length; i+=1){
        if(this.sliders[i] == parallaxElement){
          this.sliders.splice(i, 1);
        }
      }
      $(el).data('px.parallax', false);
      if(this.sliders.length === 0){
        $(window).off('scroll.px.parallax resize.px.parallax load.px.parallax');
        this.isReady = false;
        Parallax.isSetup = false;
      }
    }
  });


  // Parallax Plugin Definition

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var options = typeof option == 'object' && option;

      if (this == window || this == document || $this.is('body')) {
        Parallax.configure(options);
      }
      else if (!$this.data('px.parallax')) {
        options = $.extend({}, $this.data(), options);
        $this.data('px.parallax', new Parallax(this, options));
      }
      else if (typeof option == 'object')
      {
        $.extend($this.data('px.parallax'), options);
      }
      if (typeof option == 'string') {
        if(option == 'destroy'){
            Parallax['destroy'](this);
        }else{
          Parallax[option]();
        }
      }
    })
  };

  var old = $.fn.parallax;

  $.fn.parallax             = Plugin;
  $.fn.parallax.Constructor = Parallax;


  // Parallax No Conflict

  $.fn.parallax.noConflict = function () {
    $.fn.parallax = old;
    return this;
  };


  // Parallax Data-API

  $(document).on('ready.px.parallax.data-api', function () {
    $('[data-parallax="scroll"]').parallax();
  });

}(jQuery, window, document));

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

        var target = event.target;

        if (target.classList.contains("js-send-mail-to-member")) {
            while (target != event.currentTarget) {
                target = target.parentNode;
                if (target.classList.contains("team__member")) {
                    var memberId = target.getAttribute('data-member-id');
                    break;
                }
            }

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

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var memberData = JSON.parse(xhr.responseText),
                            memberEmail = memberData.email,
                            sendToField = document.querySelector(".js-send-to-email");
                        sendToField.value = memberEmail;
                        sendToField.placeholder = memberEmail;
                    }
                    else {
                        alert("Could not load options for member email");
                    }
                }

            };
            xhr.open('GET', '/members/' + memberId, true);
            xhr.send();

            sendMailButton.onclick = function () {
                var emailForm = document.querySelector("#sendEmailToMember form");
                var emailService = "sendgrid",
                    emailTemplate = "member_contacted",
                    time = moment(),
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
            "</i></button>" + "<a class='link-to-fb' href='https://www.facebook.com' target='_blank'><i class='fa fa-facebook aria-hidden='true'></a>";
        member.setAttribute("data-member-id", input.id);

        var membersContainer = document.querySelector(".js-team");
        membersContainer.insertBefore(member, membersContainer.firstChild);

        //Reset form values
        memberSubmissionForm.memberFirstName.value = "";
        memberSubmissionForm.memberLastName.value = "";
        memberSubmissionForm.memberEmail.value = "";
        memberSubmissionForm.memberGender[0].selected = true;
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
        var userImage = JSON.parse(this.responseText),
            fallbackUserImageSrc = "styles/img/user.png",
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

                }
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