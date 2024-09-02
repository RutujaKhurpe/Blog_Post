document.addEventListener('DOMContentLoaded', function () {
    const signupButton = document.querySelector('.submit-button');

    signupButton.addEventListener('click', async function () {
        const name = document.querySelector('input[placeholder="Enter Name"]').value;
        const email = document.querySelector('input[placeholder="Email"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        if (!name || !email || !password) {
            alert("Please fill out all fields.");
            return;
        }

        const user = { name, email, password };

        try {
            const response = await fetch('http://localhost:8000/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (response.ok) {
                alert('User signed up successfully! Redirecting to login...');
                window.location.href = 'http://127.0.0.1:5500/login.html'; // Redirect to login page after signup
            } else {
                alert(data.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error signing up user.');
        }
    });
});
