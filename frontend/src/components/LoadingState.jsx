function LoadingState() {
    return (
        <div className="page-stack">
            <div className="stats-grid">
                {[0, 1, 2, 3].map((idx) => (
                    <div
                        key={idx}
                        className="skeleton-box"
                        style={{height: '112px'}}
                    />
                ))}
            </div>
            <div className="charts-grid">
                <div className="skeleton-box" style={{height: '310px'}}/>
                <div className="skeleton-box" style={{height: '310px'}}/>
            </div>
        </div>
    );
}

export default LoadingState;