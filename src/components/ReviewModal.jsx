import { useState } from "react";

const ReviewModal = ({ open, onClose, onSubmit, carModel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }
    setError("");
    onSubmit({ rating, comment });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h3>Leave a Review for {carModel}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>
              Rating:{" "}
              <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <textarea
              rows={3}
              placeholder="Your review"
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: "100%", borderRadius: 4, border: "1px solid #ccc", padding: 8 }}
              required
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" style={{ padding: "6px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>Submit</button>
            <button type="button" onClick={onClose} style={{ padding: "6px 16px", background: "#eee", border: "none", borderRadius: 4 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;