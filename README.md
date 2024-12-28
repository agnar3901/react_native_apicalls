# Jobfetch_App

A React Native application for browsing and interacting with job listings using data fetched from an external API. The app leverages modern libraries like Axios for HTTP requests, React Query for state management, and AsyncStorage for data persistence.

## Features
- Fetch job listings from an API endpoint.
- Display job details such as title, location, and salary.
- Bookmark jobs for later reference (locally stored using AsyncStorage).
- Smooth loading and error handling with React Query.

## Technologies Used
- **React Native**: For building the mobile application.
- **Axios**: For HTTP requests to fetch job data.
- **React Query**: For managing server state and caching.
- **AsyncStorage**: For local data storage and persistence.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/jobs-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd jobs-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the project:
   - For Android:
     ```bash
     npm run android
     ```
   - For iOS:
     ```bash
     npm run ios
     ```
   - For Web:
     ```bash
     npm run web
     ```

## Usage

1. Upon launching the app, the list of available jobs is displayed.
2. Tap on a job listing to view its details.
3. Bookmark jobs using the provided functionality (optional).

## API Integration
The application fetches data from the following endpoint:

```
https://testapi.getlokalapp.com/common/jobs?page=1
```

Ensure the API is accessible for the application to function correctly.

## Folder Structure
```
.
├── components          # Reusable UI components
├── screens             # Screens (e.g., JobsScreen, BookmarkScreen)
├── hooks               # Custom React hooks (e.g., API fetch hooks)
├── utils               # Utility functions
├── assets              # Images and other static assets
├── App.js              # Entry point of the app
└── package.json        # Dependencies and scripts
```

## Key Code Highlights

### Fetching Data

Data is fetched using Axios in combination with React Query:
```javascript
const fetchJobs = async () => {
  const response = await axios.get('https://testapi.getlokalapp.com/common/jobs?page=1');
  return response.data;
};

const { data, isLoading, error } = useQuery('jobs', fetchJobs);
```

### Bookmarking Jobs

Bookmarks are managed with AsyncStorage:
```javascript
const handleBookmark = async (job) => {
  try {
    const storedBookmarks = await AsyncStorage.getItem('bookmarks');
    const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    if (!bookmarks.some((item) => item.id === job.id)) {
      bookmarks.push(job);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } else {
      const updatedBookmarks = bookmarks.filter((item) => item.id !== job.id);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  } catch (error) {
    console.error('Error bookmarking job', error);
  }
};
```

## Troubleshooting

### Common Issues

1. **API Not Responding**:
   - Verify the API URL is correct.
   - Check your internet connection.

2. **React Query Errors**:
   - Ensure the `react-query` library is installed and properly configured.

3. **Web Build Errors**:
   - If you encounter a `crypto` module error, add the following to your `webpack.config.js`:
     ```javascript
     resolve: {
       fallback: {
         crypto: require.resolve('crypto-browserify')
       }
     }
     ```

Happy coding!

