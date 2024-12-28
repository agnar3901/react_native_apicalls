import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useQuery } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchJobs = async () => {
  const response = await axios.get('https://testapi.getlokalapp.com/common/jobs?page=1');  // Always fetching page 1
  console.log(response.data);  // check
  return response.data; // Assuming the API returns data in a { jobs: [], ... } structure

};

const JobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data, isLoading, isError } = useQuery('jobs', fetchJobs, {
    onSuccess: (newData) => {
      if (newData && newData.jobs) {
        setJobs(newData.jobs);  // Set jobs when the data is fetched
      }
    },
  });

  const handleBookmark = async (job) => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

      // Check if the job is already bookmarked
      if (!bookmarks.some((item) => item.id === job.id)) {
        bookmarks.push(job);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(true); // Update the bookmark status for UI
      } else {
        // Optional: Remove from bookmarks if it's already bookmarked
        const updatedBookmarks = bookmarks.filter((item) => item.id !== job.id);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error bookmarking job', error);
    }
  };

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
        
        // Ensure jobs is an array before checking bookmark status
        jobs.forEach((job) => {
          if (bookmarks.some((item) => item.id === job.id)) {
            setIsBookmarked(true);
          }
        });
      } catch (error) {
        console.error('Error checking bookmark status', error);
      }
    };

    if (jobs.length > 0) {  // Only run check if there are jobs
      checkBookmarkStatus();
    }
  }, [jobs]);

  // Handle loading and error states
  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (isError) return <Text>Error fetching jobs</Text>;

  // Handle case when no jobs data is available
  if (!data || !data.jobs || data.jobs.length === 0) {
    return <Text>No jobs data available</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
<FlatList
  data={data.data} 
  keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Fallback to index if id is missing
  renderItem={({ item }) => {
    const place = item.primary_details?.Place || 'No Place Available';
    const salary = item.primary_details?.Salary || 'No Salary Information';
    return (
      <View style={{ padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        <Text>{place}</Text>
        <Text>{salary}</Text>
        
      </View>
    );
  }}
/>

    </View>
  );
};

export default JobsScreen;


// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
// import axios from 'axios';
// import { useQuery } from 'react-query';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const fetchJobs = async () => {
//   const response = await axios.get('https://testapi.getlokalapp.com/common/jobs?page=1');  // Always fetching page 1
//   // console.log(data.results);
//   console.log(response.data);  // Log the data to inspect the format
//   return response.data; // Assuming the API returns data in a { jobs: [], ... } structure
// };

// const JobsScreen = ({ navigation }) => {
//   const [jobs, setJobs] = useState([]);
//   const [isBookmarked, setIsBookmarked] = useState(false);

//   const { data, isLoading, isError } = useQuery('jobs', fetchJobs, {
//     onSuccess: (newData) => {
//       if (newData && newData.jobs) {
//         setJobs(newData.jobs);  // Set jobs when the data is fetched
//       }
//     },
//   });

//   const handleBookmark = async (job) => {
//     try {
//       const storedBookmarks = await AsyncStorage.getItem('bookmarks');
//       const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

//       // Check if the job is already bookmarked
//       if (!bookmarks.some((item) => item.id === job.id)) {
//         bookmarks.push(job);
//         await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
//         setIsBookmarked(true); // Update the bookmark status for UI
//       } else {
//         // Optional: Remove from bookmarks if it's already bookmarked
//         const updatedBookmarks = bookmarks.filter((item) => item.id !== job.id);
//         await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
//         setIsBookmarked(false);
//       }
//     } catch (error) {
//       console.error('Error bookmarking job', error);
//     }
//   };

//   useEffect(() => {
//     const checkBookmarkStatus = async () => {
//       try {
//         const storedBookmarks = await AsyncStorage.getItem('bookmarks');
//         const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
        
//         // Ensure jobs is an array before checking bookmark status
//         jobs.forEach((job) => {
//           if (bookmarks.some((item) => item.id === job.id)) {
//             setIsBookmarked(true);
//           }
//         });
//       } catch (error) {
//         console.error('Error checking bookmark status', error);
//       }
//     };

//     if (jobs.length > 0) {  // Only run check if there are jobs
//       checkBookmarkStatus();
//     }
//   }, [jobs]);

//   // Handle loading and error states
//   if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
//   if (isError) return <Text>Error fetching jobs</Text>;

//   // Handle case when no jobs data is available
//   if (!data || !data.jobs || data.jobs.length === 0) {
//     return <Text>No jobs data available</Text>;
//   }

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <FlatList
//         data={data.jobs} // Use the jobs data returned from the API
//         renderItem={({ item }) => (
//           <View style={{ padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 }}>
//             <Text>{item.title}</Text>
//             <Text>{item.location}</Text>
//             <Text>{item.salary}</Text>
//             <Text>{item.phone}</Text>

//             {/* Bookmark Button */}
//             <Button
//               title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
//               onPress={() => handleBookmark(item)}
//             />
//             <TouchableOpacity
//               onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
//               style={{ marginTop: 10, padding: 10, backgroundColor: '#DDDDDD' }}
//             >
//               <Text>View Details</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//       />
//     </View>
//   );
// };

// export default JobsScreen;


