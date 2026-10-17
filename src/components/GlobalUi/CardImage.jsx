import '../../assets/styles/villa.css';

export function GlobalCardImage({
    image = 'https://avatar.vercel.sh/shadcn1',
    title = 'Design systems meetup',
    description = 'A practical talk on component APIs, accessibility, and shipping faster.',
    badge = 'Featured',
    actionLabel = [
        'Edit', 'Delete'
    ],
    onAction,
    is_image = false
}) {
    console.log(image)
    return (
        <article className="va-adm-card" style={{ maxWidth: '24rem' }}>
            <div className="va-adm-card__img">
                <img src={image} alt={title} />
                {
                    !is_image ? <span className="va-adm-chip">{badge}</span> : null
                }
            </div>
            <div className="va-adm-card__body">
                {
                    !is_image ? (
                        <>
                            <h3 className="va-h3">{title}</h3>
                            <p className="va-text">{description}</p>
                        </>
                    ) : null
                }
            </div>
            <div className="va-adm-card__foot">
                {
                    actionLabel?.map(item => (
                        <button type="button" className="va-btn va-btn--block va-btn--sm" onClick={onAction}>
                            {item}
                        </button>
                    ))
                }
            </div>
        </article>
    );
}