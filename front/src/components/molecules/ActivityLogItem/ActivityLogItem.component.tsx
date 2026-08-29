import "./ActivityLogItem.css";

export interface ActivityLogItemProps {
  text: string;
  datetime: string;
}

/**
 * ActivityLogItem - Molecule
 *
 * Activity log entry (text + datetime).
 */
export const ActivityLogItem = ({ text, datetime }: ActivityLogItemProps) => (
  <div className="activity-log-item">
    <span className="activity-log-item__text">{text}</span>
    <span className="activity-log-item__datetime"> - {datetime}</span>
  </div>
);
