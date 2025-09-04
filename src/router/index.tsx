import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import NotFound from '../pages/404'
import Chat from '../pages/chat';
import ChatInterface from '../pages/chatNext/index'
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/chatNew" element={<ChatInterface/>} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}
export default AppRouter;