// Function to convert image to Base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function fetchUserBlogs() {
    try {
        const response = await fetch(`http://localhost:8000/blog/`);
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }

        const blogs = await response.json();
        const blogList =Array.isArray(blogs)? blogs :  blogs.blogs || []; // Adjust this line based on the actual structure
       // console.log('Blog List:', blogList.map(blog => blog.imageUrl)); // Log the image URLs here
        displayUserBlogs(blogList);
    } catch (error) {
        console.error("Error fetching user blogs:", error);
    }
}

// Display user blogs
function displayUserBlogs(blogs) {
    const blogListContainer = document.getElementById('blog-list');
    blogListContainer.innerHTML = ''; 

    blogs.forEach(blog => {
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-item';
        blogElement.innerHTML = `
            <h2>${blog.title}</h2>
            <img src="/backend/${blog.image}" alt="${blog.title}" style="max-width: 100%;">
            <p>${blog.bio}</p>
        `;
        blogListContainer.appendChild(blogElement);
    })
}
document.addEventListener('DOMContentLoaded', fetchUserBlogs);






