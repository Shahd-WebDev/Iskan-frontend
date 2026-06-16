import { useState, useEffect } from "react";

export default function ContactModal({
  isOpen,
  onClose,
  message,
  onCreateReply,
  onUpdateReply,
  onDeleteReply,
}) {
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (message?.reply) {
      setReplyText(message.reply.replyText);
    } else {
      setReplyText("");
    }
  }, [message]);

  if (!isOpen || !message) return null;

  const hasReply = !!message.reply;

  return (
    <div className="cm-overlay">

      <div className="cm-modal">

        <div className="cm-header">
          <h3>Message Details</h3>

          <button
            onClick={onClose}
            className="cm-close"
          >
            ✕
          </button>
        </div>

        <div className="cm-info">

          <p>
            <strong>Name:</strong> {message.name}
          </p>

          <p>
            <strong>Email:</strong> {message.email}
          </p>

          <p>
            <strong>Subject:</strong> {message.subject}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(message.createdAt).toLocaleString()}
          </p>

          <div className="cm-message-box">
            {message.message}
          </div>

        </div>

        {!hasReply && (
          <>
            <textarea
              className="cm-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
            />

            <div className="cm-actions">

              <button
                onClick={onClose}
                className="cm-btn-cancel"
              >
                Cancel
              </button>

              <button
                className="cm-btn-save"
                onClick={() =>
                  onCreateReply(replyText)
                }
              >
                Send Reply
              </button>

            </div>
          </>
        )}

        {hasReply && !editing && (
          <>
            <div className="cm-reply-box">
              <h4>Current Reply</h4>

              <p>{message.reply.replyText}</p>
            </div>

            <div className="cm-actions">

              <button
                className="cm-btn-edit"
                onClick={() =>
                  setEditing(true)
                }
              >
                Edit Reply
              </button>

              <button
                className="cm-btn-delete"
                onClick={() =>
                  onDeleteReply(message.reply.id)
                }
              >
                Delete Reply
              </button>

            </div>
          </>
        )}

        {hasReply && editing && (
          <>
            <textarea
              className="cm-textarea"
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
            />

            <div className="cm-actions">

              <button
                className="cm-btn-cancel"
                onClick={() =>
                  setEditing(false)
                }
              >
                Cancel
              </button>

              <button
                className="cm-btn-save"
                onClick={() =>
                  onUpdateReply(
                    message.reply.id,
                    replyText
                  )
                }
              >
                Update Reply
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}