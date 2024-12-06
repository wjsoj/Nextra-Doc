"use client"

import React from 'react';

interface Props {
  problemId: string;
  problemName: string;
}

const ProblemButton: React.FC<Props> = ({ problemId, problemName }) => {
  const handleClick = async () => {
    try {
      const response = await fetch(`https://data.educoder.net/api/practices/${problemId}/start`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 0 && data.identifier) {
        const url = `https://www.educoder.net/problems/${data.identifier}/oj/${problemId}`;
        window.open(url, '_blank');
      } else {
        console.error('请求失败:', data.message);
      }
    } catch (error) {
      console.error('Error starting practice:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      {problemName}
    </button>
  );
};

export default ProblemButton;