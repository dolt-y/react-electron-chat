import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import NotFound from '../pages/404'
import ChatPage from '../pages/chat/index'
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
export default AppRouter;