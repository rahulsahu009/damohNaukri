// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Get references to the necessary HTML elements
    const jobListingsContainer = document.getElementById('job-listings');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button'); // We keep this for users who prefer clicking

    // This array will store all the job data after fetching it once.
    let allJobsData = [];

    // --- Function to create the HTML for a single job card ---
    const createJobCard = (job) => {
        const card = document.createElement('div');
        card.className = 'job-card'; // This class is styled by your CSS

        // Use a template literal to build the card's inner HTML
        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><i class="fas fa-building"></i> ${job.company}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
            <p>${job.description}</p>
            <a href="${job.applyLink}" class="apply-btn" target="_blank" rel="noopener noreferrer">Apply Now</a>
        `;
        return card;
    };

    // --- Function to display an array of jobs on the webpage ---
    const displayJobs = (jobs) => {
        jobListingsContainer.innerHTML = ''; // Clear any previous listings
        
        // If no jobs match, show a message
        if (jobs.length === 0) {
            jobListingsContainer.innerHTML = '<p style="text-align: center;">No jobs found matching your search.</p>';
            return;
        }

        // Create and append a card for each job in the array
        jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobListingsContainer.appendChild(jobCard);
        });
    };

    // --- Function to fetch job data from the jobs.json file ---
    const fetchJobs = async () => {
        try {
            const response = await fetch('jobs.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jobs = await response.json();
            
            allJobsData = jobs; // Store the fetched data in our global array
            displayJobs(allJobsData); // Display all jobs initially
        } catch (error) {
            console.error('Error fetching job data:', error);
            jobListingsContainer.innerHTML = '<p style="text-align: center; color: red;">Could not load job listings. Please try again later.</p>';
        }
    };

    // --- Function to filter jobs based on the search input ---
    const filterJobs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        // Filter the 'allJobsData' array
        const filteredJobs = allJobsData.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm)
        );

        // Display only the filtered jobs
        displayJobs(filteredJobs);
    };

    // --- Add Event Listeners ---
    
    // DELETED: The old event listeners for the button and "Enter" key are no longer the primary way to search.
    // searchButton.addEventListener('click', filterJobs);
    // searchInput.addEventListener('keyup', (event) => { ... });

    // NEW: This is the new event listener for live searching.
    // The 'input' event fires every time the text in the input box changes.
    searchInput.addEventListener('input', filterJobs);
    

    // --- Initial Action ---
    // Fetch and display all jobs when the page first loads
    fetchJobs();
});