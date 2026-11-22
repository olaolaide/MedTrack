import {Link} from 'react-router-dom';

function ErrorState({error}) {
    return (
        <div className="empty-panel">
            <h2>Could not load page</h2>
            <p>{error}</p>

            <div
                style={{
                    marginTop: '16px',
                }}
            >
                <Link to="/" className="button">
                    Go to Home
                </Link>
            </div>
        </div>
    );
}

export default ErrorState;