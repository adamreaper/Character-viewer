export default function PosePanel({ poses, selectedPoseId, onSelectPose }) {
  return (
    <section className="pose-panel">
      {poses.map((pose) => (
        <button
          key={pose.id}
          type="button"
          className={pose.id === selectedPoseId ? 'pose-card active' : 'pose-card'}
          onClick={() => onSelectPose(pose.id)}
        >
          <span className="pose-name">{pose.name}</span>
          <span className="pose-description">{pose.description}</span>
        </button>
      ))}
    </section>
  );
}
