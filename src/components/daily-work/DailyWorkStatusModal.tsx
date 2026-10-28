import { useEffect, useState } from "react";
import type {
  DailyWorkStatus,
  DailyWorkStatusRequest,
} from "../../types/dailyWorkStatus";
interface DailyWorkStatusModalProps {
  open: boolean;
  date: string;
  status: DailyWorkStatus | null;
  saving: boolean;
  onClose: () => void;
  onSave: (request: DailyWorkStatusRequest) => Promise<void>;
}
const DailyWorkStatusModal = ({
  open,
  date,
  status,
  saving,
  onClose,
  onSave,
}: DailyWorkStatusModalProps) => {
  const [workDescription, setWorkDescription] = useState("");
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [remarks, setRemarks] = useState("");
  useEffect(() => {
    if (!open) {
      return;
    }
    setWorkDescription(status?.workDescription ?? "");
    setAchievements(status?.achievements ?? "");
    setChallenges(status?.challenges ?? "");
    setRemarks(status?.remarks ?? "");
  }, [open, status]);
  if (!open) {
    return null;
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!workDescription.trim()) {
      return;
    }
    await onSave({
      workDate: date,
      workDescription: workDescription.trim(),
      achievements: achievements.trim(),
      challenges: challenges.trim(),
      remarks: remarks.trim(),
    });
  };
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "long", year: "numeric" },
  );
  return (
    <div
      className="daily-work-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {" "}
      <div className="daily-work-modal">
        {" "}
        <div className="daily-work-modal-header">
          {" "}
          <div>
            {" "}
            <h2>Daily Work Status</h2> <p> {formattedDate} </p>{" "}
          </div>{" "}
          <button
            type="button"
            className="daily-work-close-button"
            onClick={onClose}
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        {status && (
          <div className="daily-work-hours-info">
            {" "}
            <div>
              {" "}
              <span>Worked</span>{" "}
              <strong> {status.totalHours.toFixed(2)} hrs </strong>{" "}
            </div>{" "}
            <div>
              {" "}
              <span>Required</span>{" "}
              <strong> {status.dailyWorkingHours.toFixed(2)} hrs </strong>{" "}
            </div>{" "}
            <div>
              {" "}
              <span>Status</span>{" "}
              <strong
                className={`daily-work-status-text ` + status.attendanceStatus}
              >
                {" "}
                {status.attendanceStatus.charAt(0).toUpperCase() +
                  status.attendanceStatus.slice(1)}{" "}
              </strong>{" "}
            </div>{" "}
          </div>
        )}{" "}
        <form className="daily-work-form" onSubmit={handleSubmit}>
          {" "}
          <div className="daily-work-form-group">
            {" "}
            <label>
              {" "}
              Work Description <span>*</span>{" "}
            </label>{" "}
            <textarea
              value={workDescription}
              onChange={(event) => setWorkDescription(event.target.value)}
              placeholder="Describe the work completed today..."
              rows={5}
              required
            />{" "}
          </div>{" "}
          <div className="daily-work-form-group">
            {" "}
            <label> Achievements </label>{" "}
            <textarea
              value={achievements}
              onChange={(event) => setAchievements(event.target.value)}
              placeholder="Mention your achievements..."
              rows={4}
            />{" "}
          </div>{" "}
          <div className="daily-work-form-group">
            {" "}
            <label> Challenges </label>{" "}
            <textarea
              value={challenges}
              onChange={(event) => setChallenges(event.target.value)}
              placeholder="Mention any blockers or challenges..."
              rows={4}
            />{" "}
          </div>{" "}
          <div className="daily-work-form-group">
            {" "}
            <label> Remarks </label>{" "}
            <textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="Additional remarks..."
              rows={3}
            />{" "}
          </div>{" "}
          <div className="daily-work-modal-actions">
            {" "}
            <button
              type="button"
              className="daily-work-cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              {" "}
              Cancel{" "}
            </button>{" "}
            <button
              type="submit"
              className="daily-work-save-button"
              disabled={saving || !workDescription.trim()}
            >
              {" "}
              {saving
                ? "Saving..."
                : status?.id
                  ? "Update Status"
                  : "Submit Status"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
export default DailyWorkStatusModal;
