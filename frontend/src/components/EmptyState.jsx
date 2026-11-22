import {Link} from "react-router-dom";

function EmptyState() {
    return (
        <div className="empty-panel">
            <h2>No patient records available</h2>
            <p>
                Add a new patient admission record to populate department metrics and
                charts.
            </p>
            <div style={{marginTop: '16px'}}>
                <Link to="/add" className="button">
                    Add First Patient
                </Link>
            </div>
        </div>
    );
}

export default EmptyState;