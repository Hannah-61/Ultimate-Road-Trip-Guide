import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlaceDetails.scss";

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ username: "", comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchPlaceDetails();
    fetchComments();
  }, [id]);


  const fetchPlaceDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8080/places/${id}`);
      if (!res.ok) throw new Error("Failed to fetch place details");
      const data = await res.json();

      let images = [];
      if (data.image_url) {
        try {
          images = JSON.parse(data.image_url); 
        } catch (e) {
          images = [data.image_url]; 
        }
      }
      setPlace({ ...data, images });
      setLikes(data.likes || 0);
    } catch (err) {
      console.error("Error fetching place details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/comments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };


  const handleAddComment = async () => {
    if (!newComment.username.trim() || !newComment.comment.trim()) {
      alert("Please enter your name and comment.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: id, ...newComment }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const addedComment = await res.json();
      setComments((prev) => [...prev, { id: addedComment.id, place_id: id, ...newComment }]);
      setNewComment({ username: "", comment: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment. Please try again.");
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:8080/places/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeId: id }),
      });
  
      if (!res.ok) throw new Error("Failed to like place");
  
      const data = await res.json();
      setLikes(data.likes);
    } catch (err) {
      console.error("Error liking place:", err);
      alert("Error liking place. Please try again.");
    }
  };
  

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;
  if (!place) return <h2>Place not found</h2>;

  return (
    <div className="place-details-container">
      <h2>{place.name}</h2>


      <div className="image-gallery">
        {place.images.length > 0 ? (
          place.images.map((image, index) => (
            <img
              key={index}
              src={image.startsWith("/uploads") ? `http://localhost:8080${image}` : image}
              alt={place.name}
              className="place-image"
              onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
            />
          ))
        ) : (
          <img src="https://via.placeholder.com/300" alt="Placeholder" className="place-image" />
        )}
      </div>


      <div className="buttons-container">
        <button className="like-button" onClick={handleLike}>
          ❤️ Like ({likes})
        </button>
      </div>

      <p><strong>Address:</strong> {place.address}</p>
      <p><strong>Description:</strong> {place.description}</p>

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <p><strong>{c.username}:</strong> {c.comment}</p>
            <button className="delete-button" onClick={() => handleDeleteComment(c.id)}>🗑 Delete</button>
          </div>
        ))
      )}


      <h3>Add a Comment</h3>
      <div className="comment-form">
        <input
          type="text"
          placeholder="Your Name"
          value={newComment.username}
          onChange={(e) => setNewComment({ ...newComment, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Your Comment"
          value={newComment.comment}
          onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
        />
        <button onClick={handleAddComment}>Submit Comment</button>
      </div>
    </div>
  );
};

export default PlaceDetails;
