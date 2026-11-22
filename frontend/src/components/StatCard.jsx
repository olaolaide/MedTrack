const StatCard = ({icon: Icon, color, label, value, detail}) => {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}>
                <Icon size={19} aria-hidden="true"/>
            </div>

            <div className="stat-copy">
                <span className="eyebrow">{label}</span>

                <strong className="stat-value">{value}</strong>

                <span className="stat-detail">{detail}</span>
            </div>
        </div>
    );
};

export default StatCard;
