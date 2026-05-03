import { useMemo, useState } from 'react';
import CharacterViewer from './components/CharacterViewer.jsx';
import PosePanel from './components/PosePanel.jsx';
import CharacterPanel from './components/CharacterPanel.jsx';
import { poses } from './lib/poses.js';
import { characters } from './lib/models.js';

export default function App() {
  const [selectedCharacterId] = useState(characters[0].id);
  const [selectedPoseId, setSelectedPoseId] = useState(poses[0].id);

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedCharacterId) ?? characters[0],
    [selectedCharacterId]
  );

  const selectedPose = useMemo(
    () => poses.find((pose) => pose.id === selectedPoseId) ?? poses[0],
    [selectedPoseId]
  );

  return (
    <div className="app-shell">
      <div className="boot-banner">APP BOOTED</div>
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">3D character viewer</p>
          <h1>Pose Preview Studio</h1>
          <p className="subtitle">Load a character and flip through preset poses fast.</p>
        </div>
        <CharacterPanel characters={characters} selectedCharacterId={selectedCharacter.id} />
        <div className="pose-meta">
          <span className="meta-label">Current pose</span>
          <strong>{selectedPose.name}</strong>
          <p>{selectedPose.description}</p>
        </div>
      </aside>

      <main className="viewer-column">
        <CharacterViewer character={selectedCharacter} pose={selectedPose} />
        <PosePanel poses={poses} selectedPoseId={selectedPose.id} onSelectPose={setSelectedPoseId} />
      </main>
    </div>
  );
}
