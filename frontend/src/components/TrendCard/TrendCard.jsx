import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import './TrendCard.css'; 


const TrendCard = ({ setSelectedHashtag, handleHashId }) => {
  const [hashtags, setHashtags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get('/post/trendingHashtags');
        setHashtags(response.data);
      } catch (error) {
        console.error("Failed to fetch trending hashtags", error);
      }
    };
    fetchHashtags();
  }, []);

  const handleHashtagClick = (hashtag) => {
    handleHashId(hashtag)
  };

  return (
    <div className="TrendCard">
      <h3>Trends for you</h3>
      {hashtags.length === 0 ? (
        <div>No trending hashtags found</div>
      ) : (
        hashtags.map((hashtag) => (
          <div
            className="trend"
            key={hashtag._id}
            onClick={() => handleHashtagClick(hashtag._id)}
            style={{ cursor: "pointer" }}
          >
            <span>#{hashtag._id}</span>
            <span>{hashtag.shares} shares</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TrendCard;
