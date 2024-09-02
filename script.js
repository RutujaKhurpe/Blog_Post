// Toggle between login and logout
function toggleAuth() {
    const authButton = document.getElementById('authButton');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
  
    if (isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      authButton.innerText = 'Login';
      alert('Logged out successfully!');
    } else {
      localStorage.setItem('isLoggedIn', true);
      authButton.innerText = 'Logout';
      alert('Logged in successfully!');
    }
  }
  
  // Check the login state on page load
  document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn) {
      authButton.innerText = 'Logout';
    } else {
      authButton.innerText = 'Login';
    }
  });
  