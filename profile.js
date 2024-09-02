document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('authToken')
    if (!token) {
        window.location.href = 'login.html'
    } else {
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("name");
        const welcomeMessage = document.getElementById("welcome-message");
        const blogListContainer = document.getElementById("blog-list");

        welcomeMessage.querySelector("#user-name").textContent = userName;
        // Fetch and display user profile data
        async function fetchUserProfile() {
            try {
                const response = await fetch(`http://localhost:8000/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                const user = await response.json();
                fetchUserBlogs(); // Fetch blogs after getting user profile
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }

        // Fetch user blogs
        async function fetchUserBlogs() {
            try {
                const response = await fetch(`http://localhost:8000/blog/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blogs");
                }
                const blogs = await response.json();
                const blogList = blogs.blogs || []; // Adjust this line based on the actual structure
                displayUserBlogs(blogList);
            } catch (error) {
                console.error("Error fetching user blogs:", error);
            }
        }

        // Display user blogs
        function displayUserBlogs(blogs) {
            blogListContainer.innerHTML = '';
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-item';
                blogElement.innerHTML = `
                <h2>${blog.title}</h2>
                <img src="/backend/${blog.image}" alt="${blog.title}" style="max-width: 100%;">
                <p>${blog.bio}</p>
                <div>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
                blogListContainer.appendChild(blogElement);

                // Add event listener for edit button
                blogElement.querySelector(".edit-btn").addEventListener("click", () => {
                    showEditModal(blog._id, blog.title, blog.category, blog.bio);
                });

                // Add event listener for delete button
                blogElement.querySelector(".delete-btn").addEventListener("click", () => {
                    deleteBlog(blog._id);
                });
            });
        }

        //code to open modal
        // Show modal function
        function showModal() {
            document.getElementById('blogModal').style.display = 'block';
        }
        //code to close function
        // Close modal function
        function closeModal() {
            document.getElementById('blogModal').style.display = 'none';
            document.querySelector('#addBlogForm').reset();
            document.querySelector('#addBlogForm').removeAttribute('data-blog-id');
        }
        //if clicked outside, then close the modal
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('blogModal');
            if (event.target == modal) {
                closeModal();
            }
        });
        // Event listener for "Add Blog" button
        document.querySelector('.add-blog-btn').addEventListener('click', showModal);

        // Handle form submission for adding blogs
        document.querySelector("#addBlogForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken")
            console.log("token line 100", token)


            try {
                const response = await fetch(`http://localhost:8000/blog/${userId}/addblog`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}` // Add the Authorization header
                    }
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("Server responded with status:", response.status);
                    console.error("Response body:", errorBody);
                    throw new Error(`Failed to add blog: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Blog added successfully:", result);

                // Close the modal and refresh the blog list
                closeModal();
                fetchUserBlogs();
            } catch (error) {
                console.error("Error adding blog:", error);
                alert("Failed to add blog. Please check the console for more details.");
            }
        });

        function showEditModal(blogId, title, category, bio) {
            const editModal = document.getElementById('editModal');
            const editBlogForm = document.getElementById('editBlogForm');

            // Set the form's data-blog-id attribute to the blog's ID
            editBlogForm.setAttribute('data-blog-id', blogId);

            // Populate the form fields with the blog's current data
            editBlogForm.querySelector('#title').value = title;
            editBlogForm.querySelector('#category').value = category;
            editBlogForm.querySelector('#bio').value = bio;

            // Display the modal
            editModal.style.display = 'block';
        }

        // Event listener for closing the modal
        document.querySelector('.close').addEventListener('click', closeModal);

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            const editModal = document.getElementById('editModal');
            if (event.target == editModal) {
                closeModal();
            }
        });

        document.getElementById('editBlogForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(this);
            const blogId = this.getAttribute('data-blog-id');
            const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

            if (!blogId || !userId) {
                console.error('Blog ID or User ID is missing');
                alert('Error: Blog ID or User ID is missing');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/blog/${userId}/${blogId}/update`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}` // Add the Authorization header
                    }

                })
                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("Server responded with status:", response.status);
                    console.error("Response body:", errorBody);
                    throw new Error(`Failed to add blog: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Blog added successfully:", result);

                // Close the modal and refresh the blog list
                closeModal();
                fetchUserBlogs();

                //     if (!response.ok) {
                //         throw new Error('Failed to update blog');
                //     }
                //     return response.json();
                // })
                // .then(data => {
                //     if (data.success) {
                //         alert('Blog updated successfully!');
                //         closeModal();
                //         fetchUserBlogs(); // Refresh the blog list
                //     } else {
                //         alert('Error updating blog: ' + data.message);
                //     }
                // })
            } catch (error) {
                console.error('Error updating blog:', error);
                alert('Error updating blog: ' + error.message);
            }
        });


        function closeModal() {
            const editModal = document.getElementById('editModal');
            editModal.style.display = 'none';
        }
        // Delete blog function
        function deleteBlog(blogId) {
            if (confirm('Are you sure you want to delete this blog?')) {
                fetch(`http://localhost:8000/blog/${blogId}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Add the Authorization header
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Failed to delete blog");
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('Blog deleted successfully!');
                        fetchUserBlogs(); // Refresh the blog list
                    })
                    .catch(error => console.error('Error deleting blog:', error));
            }
        }


        fetchUserProfile();

        function logoutUser() {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html'; // Redirect to login page
        }

        document.querySelector('#logoutButton').addEventListener('click', logoutUser);
    }
})


