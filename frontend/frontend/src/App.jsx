import AirQuality from './AirQuality.jsx';

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenue sur AirCare</h1>
        <AirQuality />
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#eef2f3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Arial',
    maxWidth: '420px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
};

export default App;

