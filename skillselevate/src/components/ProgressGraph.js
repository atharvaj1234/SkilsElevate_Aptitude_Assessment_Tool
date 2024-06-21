import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// Register the required components with Chart.js
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const ProgressGraph = () => {
  const [user, loading] = useAuthState(auth);
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        if (loading) return;
        if (!user) return;

        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.warn('No user data found');
          return;
        }

        const userData = querySnapshot.docs[0].data();
        if (!userData.userdata || !userData.userdata.testdata) {
          console.warn('No test data found in userData');
          return;
        }

        const testdata = userData.userdata.testdata;
        const categories = Array.from(new Set(testdata.flatMap((test) => test.categoryData.map((d) => d.category))));
        const chartLabels = [...Array(testdata.length).keys()].map(i => `Test ${i + 1}`);

        const categoryProgress = categories.reduce((acc, category) => {
          acc[category] = testdata.map((test, index) => {
            const categoryData = test.categoryData.find((d) => d.category === category);
            return categoryData ? { x: index + 1, y: (1 - categoryData.attentionRequired / 100) * 100 } : { x: index + 1, y: null };
          });
          return acc;
        }, {});

        const overallProgress = testdata.map((test, index) => ({
          x: index + 1,
          y: (1 - test.categoryData.reduce((sum, d) => sum + parseFloat(d.attentionRequired), 0) / (100 * test.categoryData.length)) * 100,
        }));

        setChartData({
          labels: chartLabels,
          datasets: [
            ...categories.map((category) => ({
              label: category,
              data: categoryProgress[category],
              borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return null;
                }
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
                return gradient;
              },
              fill: true,
              cubicInterpolationMode: 'monotone',
              spanGaps: true, // Enable spanning of gaps
            })),
            {
              label: 'Overall Progress',
              data: overallProgress,
              borderColor: 'rgba(0, 0, 0, 1)',
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return null;
                }
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
                return gradient;
              },
              fill: true,
              cubicInterpolationMode: 'monotone',
              spanGaps: true, // Enable spanning of gaps
            },
          ],
        });
        setChartLoaded(true);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData();
  }, [user, loading]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance?.destroy();
    }
  }, [chartData]);

  return (
   (chartLoaded) &&( <div>
      <h2>Progress Graph</h2>
      <Line ref={chartRef} data={chartData} options={{
        elements: {
          line: {
            tension: 0.4, // This property makes the line smooth and wavey
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Test Index',
              color: '#666',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Progress (%)',
              color: '#666',
            },
            beginAtZero: true,
            min: 0,
            max: 100,
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#666',
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw.y.toFixed(2)}%`;
              },
            },
          },
        },
      }} />
    </div>)
  );
};

export default ProgressGraph;
