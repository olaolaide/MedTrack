import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AddPatientPage from './pages/AddPatientPage.jsx';
import AvgCostPage from './pages/AvgCostPage.jsx';
import DeletePatientsPage from './pages/DeletePatientsPage.jsx';
import DeptStatsPage from './pages/DeptStatsPage.jsx';
import LongStayPage from './pages/LongStayPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import UpdatePatientPage from './pages/UpdatePatientPage.jsx';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="add" element={<AddPatientPage />} />
            <Route path="update" element={<UpdatePatientPage />} />
            <Route path="delete" element={<DeletePatientsPage />} />
            <Route path="dept-stats" element={<DeptStatsPage />} />
            <Route path="long-stay" element={<LongStayPage />} />
            <Route path="avg-cost" element={<AvgCostPage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
