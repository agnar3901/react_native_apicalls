import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const JobDetailsScreen = ({ route, navigation }) => {
  const { resultsId } = route.params;
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs=${resultsId}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error('Error fetching job details', error);
      }
    };

    fetchJobDetails();
  }, [resultsId]);

  if (!jobDetails) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 10 }}>
      <Text>{jobDetails.title}</Text>
      <Text>{jobDetails.fee_details}</Text>
      <Text>{jobDetails.job_tags}</Text>
      <Text>{jobDetails.job_type}</Text>
      {/* Add more details here */}
    </View>
  );
};

export default JobDetailsScreen;
