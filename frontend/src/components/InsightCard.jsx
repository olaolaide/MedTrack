const InsightCard = ({title, value, description}) => {
    return (
        <div className="insight-card">
            <span className="eyebrow">{title}</span>

            <strong>{value}</strong>

            <p>{description}</p>
        </div>
    );
};

export default InsightCard;
