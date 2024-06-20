import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const PerformanceGraph = () => {
  const [user, loading] = useAuthState(auth);
  const [chartData, setChartData] = useState({});
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        if (loading) return;
        if (!user) return;

        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();

        if (userData.userdata && userData.userdata.testdata) {
          const testdata = userData.userdata.testdata;
          const categories = Array.from(new Set(testdata.flatMap((test) => test.categoryData.map((d) => d.category))));
          const categoryData = categories.map((category) => ({
            category,
            attentionNeededSum: testdata.reduce((sum, test) => {
              const categoryData = test.categoryData.find((d) => d.category === category);
              return (categoryData ? parseFloat(categoryData.attentionRequired) : 0);
            }, 0),
            avgTimeSum: testdata.reduce((sum, test) => {
              const categoryData = test.categoryData.find((d) => d.category === category);
              return (categoryData ? parseFloat(categoryData.avgTime) : 0);
            }, 0),
          }));

          const chartLabels = categories;
          const attentionNeededData = categoryData.map((d) => d.attentionNeededSum);
          const avgTimeData = categoryData.map((d) => d.avgTimeSum);

          setChartData({
            labels: chartLabels,
            datasets: [
              {
                label: 'Attention Needed',
                data: attentionNeededData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
              {
                label: 'Average Time',
                data: avgTimeData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
        setChartLoaded(true);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData();
  }, [user, loading]);

  return (
    (chartLoaded) && (
    <div>
      <h2>Performance Graph</h2>
      <Bar data={chartData} />
    </div>)
  );
};

export default PerformanceGraph;