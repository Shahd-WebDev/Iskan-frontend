import { Eye } from "lucide-react";

export default function ContactTable({
  messages,
  onView,
}) {
  return (
    <div className="ct-wrap">
      <table className="ct-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.name}</td>

              <td>{message.email}</td>

              <td>{message.subject}</td>

              <td>
                {new Date(
                  message.createdAt
                ).toLocaleDateString()}
              </td>

              <td>
                <span
                  className={
                    message.reply
                      ? "ct-status ct-r"
                      : "ct-status ct-u"
                  }
                >
                  {message.reply
                    ? "Replied"
                    : "Unreplied"}
                </span>
              </td>

              <td>
                <button
                  className="ct-view"
                  onClick={() =>
                    onView(message)
                  }
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}