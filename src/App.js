import logo from './logo.svg';
import './App.css';
import ParentContainer from './components/ParentContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <ParentContainer />
    </div>
  );
}

export default App;
