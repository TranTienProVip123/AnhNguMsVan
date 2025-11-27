import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Home from './pages/Home/Home.jsx';
import Practice from './pages/Practice/Practice.jsx';
import Vocabulary from "./pages/Practice/Vocabulary/Vocabulary";
import VocabularyQuiz from "./pages/Practice/VocabularyQuiz/VocabularyQuiz";
import Listening from "./pages/Practice/Listening/Listening";
import Login from './pages/Login/Login.jsx';
import RoadmapGiaoTiep from "./pages/Course/RoadmapGiaoTiep";
import AdminDashboard from './components/admin/layout/AdminDashboard.jsx';
import UserList from './components/admin/pages/UserList.jsx';
import ConsultationList from './components/admin/pages/ConsultationList.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/vocabulary/:topicId/:level" element={<VocabularyQuiz />} />
                <Route path="/listening" element={<Listening />} />
                <Route path="/roadmap/giao-tiep" element={<RoadmapGiaoTiep />} />

                <Route path="/admin" element={<AdminDashboard />}>
                    <Route path="users" element={<UserList />} />
                    <Route path="consultations" element={<ConsultationList />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;