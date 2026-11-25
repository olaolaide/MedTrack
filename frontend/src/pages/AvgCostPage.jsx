export default function AvgCostPage() {
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PatientTable from "../components/PatientTable.jsx";
import { DEPARTMENTS, deptStats, getAllPatients, gbp } from "../utils/patientData.js";
import "./analytics.css";

export default function AvgCostPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dept, setDept] = useState("Oncology");
  const [threshold, setThreshold] = useState("5000");
  const [result, setResult] = useState(null);

  useEffect(() => {
    getAllPatients()
      .then(setPatients)
      .catch(() => setError("Could not load patient records."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (patients.length === 0) return <EmptyState />;

  const check = () => {
    const limit = Number(threshold) || 0;
    const stats = deptStats(patients, dept);
    setResult({
      dept,
      limit,
      avg: stats.avgCost,
      met: stats.avgCost > limit,
      rows: patients.filter((p) => p.department === dept),
    });
  };

  return (
    <div className="mt-page">
      <h1 className="mt-title">Department average cost filter</h1>
      <p className="mt-subtitle">
        Display all patient records (all 12 columns) when the department's average treatment cost exceeds your
        specified threshold.
      </p>

      <div className="mt-card">
        <div className="mt-filter">
          <div className="mt-field">
            <label htmlFor="dept">Department</label>
            <select id="dept" className="mt-select" value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPARTMENTS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="mt-field">
            <label htmlFor="limit">Average Treatment Cost greater than (£)</label>
            <input
              id="limit"
              className="mt-input"
              type="number"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <button className="mt-btn" onClick={check}>
            Check &amp; Display Records
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className={`mt-banner ${result.met ? "ok" : "no"}`}>
            <span>
              {result.met ? "Condition met: " : "Condition not met: "}
              <strong>{result.dept}</strong> average treatment cost is <strong>{gbp(result.avg)}</strong> (
              {result.met ? ">" : "≤"} {gbp(result.limit)}).
            </span>
            {result.met && <strong className="right">{result.rows.length} patient records shown</strong>}
          </div>
          {result.met && <PatientTable patients={result.rows} />}
        </>
      )}
    </div>
  );
}

}
