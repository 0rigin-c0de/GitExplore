# GitExplore

GitExplore is a web application that allows you to explore GitHub user profiles and their repositories easily. It provides a user-friendly interface to view a user's basic information, repositories, and paginate through them. The application also supports searching for specific repositories based on their names.

## Features

- **User Profile Display:** Enter a GitHub username, and GitExplore will fetch and display the user's profile information, including their name, bio, location, and a link to their GitHub profile.

- **Repository Overview:** View a user's repositories, including repository names, descriptions, and topics. Each repository card also supports a brief description and displays relevant topics associated with the repository.

- **Pagination:** Easily navigate through a user's repositories with a simple and intuitive pagination system. You can specify the number of repositories to display per page.

- **Search Functionality:** Quickly find repositories using the search bar. GitExplore filters repositories based on their names, helping you find the information you need.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/GitExplore.git

   ```

2. **Get Personal Access Token:**

   - Obtain a personal access token from your GitHub account. Follow [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) for instructions on how to generate a token.

3. **Replace Token in Code:**

   - Open `index.js` and replace the `accessToken` variable's value with your generated personal access token.

   ```javascript
   const accessToken = "YOUR_PERSONAL_ACCESS_TOKEN";
   ```

4. **Open the Application:**

   - Open the `index.html` file in your preferred web browser.

5. **Enter GitHub Username:**

   - Type a GitHub username in the input field and press "Get User" or press Enter.

6. **Explore Repositories:**
   - Once the user's information is loaded, explore their repositories, paginate through them, and use the search bar to filter repositories.

## Contributing

If you'd like to contribute to GitExplore, feel free to fork the repository and submit a pull request. We welcome any enhancements, bug fixes, or new features.

## Issues and Support

If you encounter any issues or have suggestions for improvement, please open an issue. We appreciate your feedback!
