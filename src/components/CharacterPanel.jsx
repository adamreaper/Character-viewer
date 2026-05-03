export default function CharacterPanel({ characters, selectedCharacterId }) {
  return (
    <section className="panel-section">
      <div className="panel-title-row">
        <h2>Character</h2>
      </div>
      <div className="character-list">
        {characters.map((character) => (
          <button key={character.id} type="button" className={character.id === selectedCharacterId ? 'character-chip active' : 'character-chip'}>
            {character.name}
          </button>
        ))}
      </div>
    </section>
  );
}
