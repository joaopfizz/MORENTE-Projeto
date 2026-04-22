import Dashboard from './pages/Dashboard';
import Academy from './pages/Academy';
import Course from './pages/Course';
import Scanner from './pages/Scanner';
import AssessmentPlayer from './pages/AssessmentPlayer';
import AdminPanel from './pages/AdminPanel';
import Lidherar from './pages/Lidherar';
import Athivar from './pages/Athivar';
import Evoluthion from './pages/Evoluthion';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Academy": Academy,
    "Course": Course,
    "Scanner": Scanner,
    "AssessmentPlayer": AssessmentPlayer,
    "AdminPanel": AdminPanel,
    "Lidherar": Lidherar,
    "Athivar": Athivar,
    "Evoluthion": Evoluthion,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};