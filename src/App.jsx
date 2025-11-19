import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Paractice from './pages/Practice/Practice.jsx';
import Vocabulary from "./pages/Practice/Vocabulary/Vocabulary";
import VocabularyQuiz from "./pages/Practice/VocabularyQuiz/VocabularyQuiz";
import Listening from "./pages/Practice/Listening/Listening";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<Paractice />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/vocabulary/:topicId/:level" element={<VocabularyQuiz />} />
                <Route path="/listening" element={<Listening />} />
            </Routes>
        </Router>
    );
}

export default App;