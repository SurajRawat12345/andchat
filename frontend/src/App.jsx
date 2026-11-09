import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
// import Register from './pages/Register';
import Home from './pages/Home';
// import Chat from './pages/Chat';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                {/* <Route path="/register" element={<Register />} />

                <Route path="/home" element={<Home />} />

                <Route path="/chat/:chatId" element={<Chat />} /> */}

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;