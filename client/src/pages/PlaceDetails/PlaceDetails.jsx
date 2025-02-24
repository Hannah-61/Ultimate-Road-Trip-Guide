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

  useEffect(() => {
    fetchPlaceDetails();
    fetchComments();
  }, [id]);

  const fetchPlaceDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8080/places/${id}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setPlace(data);
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
    if (!newComment.username || !newComment.comment) {
      alert("Please enter your name and comment.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: id, ...newComment }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments((prevComments) => [...prevComments, { id: addedComment.id, place_id: id, ...newComment }]);
        setNewComment({ username: "", comment: "" });
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("Error: Trying to delete a comment with an undefined ID.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please try again.");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;
  if (!place) return <h2>Place not found</h2>;

  return (
    <div className="place-details-container">
      <h2>{place.name}</h2>
      
      <img
        src={
          place.image_url
            ? place.image_url.startsWith("/images") || place.image_url.startsWith("/uploads")
              ? `http://localhost:8080${place.image_url}`
              : place.image_url
            : "/fallback-image.jpg"
        }
        alt={place.name}
        className="place-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/fallback-image.jpg";
        }}
      />

      <p><strong>Address:</strong> {place.address}</p>
      <p><strong>Description:</strong> {place.description}</p>

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <p><strong>{c.username}:</strong> {c.comment}</p>
            <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
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
