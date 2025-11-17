import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Paractice from './pages/Practice/Practice.jsx';
import Vocabulary from "./pages/Practice/Vocabulary/Vocabulary";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<Paractice />} />
                <Route path="/vocabulary" element={<Vocabulary />} />

            </Routes>
        </Router>
    );
}

export default App;