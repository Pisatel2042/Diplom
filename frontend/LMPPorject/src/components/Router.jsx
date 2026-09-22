import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import Registration from "../pages/RegistrationForm.jsx";
import Login from "../pages/Login.jsx";
import PersonalAccount from "../pages/PersonalAccount.jsx";
import TeacherPanel from "../pages/TeacherPanel.jsx";
import ScheduleSelection from "../pages/ScheduleSelection.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyCode from "../pages/VerifyCode.jsx";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/account" element={<PersonalAccount />} />
      <Route path="/teacher" element={<TeacherPanel />} />
      <Route path="/schedule" element={<ScheduleSelection />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
    
    </Routes>
  );
}
