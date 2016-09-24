/*Khrystia: we have border/border-top 2px solid dark/light + 1px solid dark/light - should make them as 2 mixins?*/
/* =====================================================================================================================
   Change default padding for Bootstrap's .container-fluid
   ===================================================================================================================*/
.container-fluid {
  padding-left: 0;
  padding-right: 0; }

/* =====================================================================================================================
   Basic styles
   ===================================================================================================================*/
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0; }

body {
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 16px; }

p {
  line-height: 1.5; }

h1, h2, h3 {
  font-family: "Montserrat", Arial, sans-serif;
  text-transform: uppercase;
  color: #03587f; }

h1 {
  font-size: 50px;
  font-weight: 700;
  line-height: 1.05;
  position: relative; }
  h1 .page-title {
    font-size: 60px;
    font-weight: bold; }
  h1:after {
    content: '';
    position: absolute;
    width: 50px;
    border-top: 2px solid #03587f;
    bottom: 10px;
    margin-left: 10px; }

h1.white-on-blue-background:after {
  border-top-color: white; }

#team h1 {
  margin-bottom: 1em; }

#current-section {
  text-decoration: underline; }

.map-container {
  width: 100%;
  height: 350px; }

.section-number {
  font-family: "Montserrat", Arial, sans-serif;
  font-size: 120px;
  color: #03587f;
  line-height: 1; }

.white-on-blue-background {
  color: white; }

.contact-details {
  display: block;
  color: white;
  line-height: 1.5;
  margin-top: 2em;
  margin-bottom: 1em;
  float: right;
  text-align: right; }

footer {
  background-color: #03587f;
  text-align: left; }
  footer .contact-details {
    float: none;
    text-align: left; }
  footer a {
    text-decoration: none;
    color: white; }
    footer a:hover {
      color: white; }

.phone-number {
  font-family: "Montserrat", Arial, sans-serif;
  font-size: 32px;
  font-weight: 400;
  text-transform: uppercase; }

address {
  font-size: 14px;
  font-style: normal; }

#home {
  position: relative;
  color: white; }
  #home h1, #home h2, #home .section-number {
    color: white; }
  #home h1 {
    margin-top: 1.5em;
    font-size: 50px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 400;
    margin-bottom: 0.5em;
    position: relative; }
    #home h1:after {
      border-top: 2px solid white; }
  #home h2 {
    font-family: 'Raleway', Arial, sans-serif;
    font-size: 40px;
    font-weight: 300;
    margin-top: 0.25em;
    margin-bottom: 2em; }
  #home p {
    font-size: 20px;
    line-height: 30px; }
  #home .section-number {
    text-align: right; }

.bordered-box {
  border: 2px solid #03587f;
  padding: 30px 20px;
  margin-bottom: 1em; }
  .bordered-box p {
    font-size: 16px;
    line-height: 1.5; }

section.map {
  padding: 0; }

h3 {
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 30px;
  font-weight: 300;
  line-height: 1.3;
  margin-top: 0.5em;
  margin-bottom: 0.5em; }

.team__member {
  margin-bottom: 2em;
  /*Make the padding screen-dependent*/
  padding-right: 75px; }
  .team__member img {
    margin-bottom: 1em; }
  .team__member .send-mail-btn {
    border: none;
    background: none;
    color: #03587f;
    width: 15px;
    height: 15px; }
    .team__member .send-mail-btn:hover {
      visibility: visible;
      border: 1px solid #03587f; }

.team__stats {
  display: inline-block; }
  .team__stats p {
    font-size: 30px;
    text-transform: uppercase;
    font-weight: 300;
    color: #03587f; }
  .team__stats .h1 {
    color: #03587f;
    font-size: 50px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: 400;
    margin-bottom: 0.5em;
    position: relative; }
    .team__stats .h1:after {
      content: '';
      position: absolute;
      width: 50px;
      border-top: 2px solid #03587f;
      bottom: 10px;
      margin-left: 10px; }

#news article {
  margin-bottom: 2em; }

.social-media {
  margin-top: 2em; }
  .social-media a {
    color: white;
    font-size: 12px; }
  .social-media div {
    display: inline-block;
    margin-left: 15px; }
    .social-media div:first-child {
      margin-left: 0px; }

.opening-hours {
  margin-top: 2em; }

/*=============================================================================
  Form styling
=============================================================================*/
.form-on-dark-bgr {
  margin-bottom: 2em; }
  .form-on-dark-bgr form > * {
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    font-size: 16px;
    outline: none; }
  .form-on-dark-bgr input, .form-on-dark-bgr textarea {
    background-color: transparent;
    color: white;
    margin-bottom: 20px;
    padding: 10px 20px;
    border: none;
    border: 1px solid white; }
  .form-on-dark-bgr button {
    color: white;
    text-transform: uppercase;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    padding: 10px 20px;
    border: 2px solid #03587f;
    background-color: transparent;
    transition: background-color 0.75s;
    margin: 0 auto; }
  .form-on-dark-bgr:hover {
    background-color: #03587f;
    transition: background-color 0.75s; }

.logo-bottom__row {
  position: relative; }

.logo-bottom__container {
  position: absolute;
  bottom: 0;
  right: 0; }
  .logo-bottom__container img {
    max-width: 200px;
    margin-top: 1em; }
  .logo-bottom__container p {
    text-align: right;
    margin-top: 1em;
    margin-bottom: 0; }

/*=============================================================================
  Disable scrolling on the Google Map
=============================================================================*/
.menu-btn {
  color: white; }

.section-image {
  margin-top: 10px;
  margin-bottom: 20px; }

/*=============================================================================
  Comments styling
=============================================================================*/
.comments-list {
  font-family: 'Raleway', sans-serif;
  font-weight: 400; }
  .comments-list article {
    position: relative;
    padding-left: 90px; }
    .comments-list article img {
      position: absolute;
      left: 10px;
      top: 15px;
      width: 60px; }

.commentContainer {
  border: 1px solid #03587f;
  width: 450px;
  padding: 10px 20px;
  margin-bottom: 10px;
  position: relative; }
  .commentContainer header {
    color: #03587f;
    font-weight: 500;
    font-variant: small-caps;
    margin-bottom: 1em; }
  .commentContainer footer {
    background-color: transparent;
    padding: 0;
    margin: 0;
    line-height: 0; }

.delete-comment-btn {
  border: none;
  background: none;
  color: #03587f;
  position: absolute;
  top: 10px;
  right: 5px;
  height: 20px;
  width: 20px; }

.edit-comment-btn {
  border: none;
  background: none;
  color: #03587f;
  position: absolute;
  top: 10px;
  right: 30px;
  height: 20px;
  width: 20px; }

/*=============================================================================
  Styling of the comment and member edit boxes
=============================================================================*/
/* Background for modal dialog box */
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.4); }

/* Styling for modal dialog box*/
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 100px auto;
  padding: 0 0 15px 0;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s; }
  .modal-content input, .modal-content textarea {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 10px; }
    .modal-content input:focus, .modal-content textarea:focus {
      outline: none;
      outline: 1px solid #03587f; }
  .modal-content button {
    color: white;
    text-transform: uppercase;
    font-size: 16px;
    font-family: 'Raleway', Arial, sans-serif;
    padding: 10px 20px;
    border: none;
    background-color: #03587f;
    margin: 0 auto;
    font-weight: 300; }

/* Add Animation */
@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0; }
  to {
    top: 0;
    opacity: 1; } }
@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0; }
  to {
    top: 0;
    opacity: 1; } }
/*Styling for Close button in the dialog box */
.close-btn {
  color: white;
  float: right;
  font-size: 16px;
  padding-top: 5px; }

.close-btn:hover,
.close-btn:focus {
  color: black;
  text-decoration: none;
  cursor: pointer; }

/* Modal box header */
.modal-header {
  padding: 10px 25px;
  background-color: #03587f;
  color: white;
  font-family: 'Raleway', sans-serif; }
  .modal-header h3 {
    color: white;
    font-size: 16px; }

.modal-body {
  padding: 15px 25px; }

/*=============================================================================
  Screen-dependent sizes
=============================================================================*/
@media (max-width: 768px) {
  section, footer {
    padding: 10px 15px; }

  h1:after {
    content: none; }

  h1, h2, .section-number, #home .section-number, footer, footer .contact-details, #home .logo, #home .contact-details {
    text-align: center; }

  #home .contact-details {
    float: none; }

  .logo-bottom__container {
    display: block;
    width: 100%;
    position: static; }
    .logo-bottom__container p {
      text-align: center; }
    .logo-bottom__container img {
      text-align: center; }

  .send-mail-btn {
    visibility: visible; } }
@media (min-width: 768px) and (max-width: 992px) {
  section, footer {
    padding: 30px 40px; } }
@media (min-width: 992px) {
  section, footer {
    padding: 50px 80px; }

  .send-mail-btn {
    visibility: hidden; } }

/*# sourceMappingURL=main.cs.map */
