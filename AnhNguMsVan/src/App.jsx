import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Home from './pages/Home/Home.jsx';
import Practice from './pages/Practice/Practice.jsx';
import Vocabulary from "./pages/Practice/Vocabulary/Vocabulary";
import VocabularyQuiz from "./pages/Practice/VocabularyQuiz/VocabularyQuiz";
import Listening from "./pages/Practice/Listening/Listening";
import Login from './pages/Login/Login.jsx';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />

                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/vocabulary/:topicId/:level" element={<VocabularyQuiz />} />
                <Route path="/listening" element={<Listening />} />

            </Routes>
        </Router>
    );
}

export default App;