I have used backend tools - Nodejs, express, mongodb, restful api, have implemented authentication, authorization for the user after login.
Frontend tools - HTML, CSS, Javascript

LandingPage.html - this is landing page where users can view the blog and i have added signin button for the users to login.
Login.html - this page is the user login page, new user link is where the page is directed to the singup .
after succesful login the user is assigned a token which is decoded on the server side for verification.
the user is then directed to the profile page, where the blogs are seen, added, updated and deleted.
I have added logout button, after clicking the token is removed from the localstorage.
