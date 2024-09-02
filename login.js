document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.submit-button');

    loginButton.addEventListener('click', async function () {
        const email = document.querySelector('input[placeholder="Email"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        if (!email || !password) {
            alert("Please fill out all fields.");
            return;
        }

        const credentials = { email, password };

        try {
            const response = await fetch('http://localhost:8000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // Store the user's name in localStorage
                localStorage.setItem('userId', data.userId);
                console.log(data.userId)
                localStorage.setItem('name', data.name);
                console.log(data.name)
                localStorage.setItem('authToken', data.token);

                // Redirect to the profile page
                window.location.href = 'http://127.0.0.1:5500/UserProfile.html';
            } else {
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error logging in user.');
        }
    });
});
