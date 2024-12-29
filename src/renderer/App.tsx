import { Routes, Route, Link, HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootStore from '../utils/store/rootStore';
import '../style/App.css';
import Home from '../pages/Home';
import SegmentAdder from '../pages/SegmentAdder';

export default function App() {
  return (
    <Provider store={rootStore}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add_segment" element={<SegmentAdder />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}
