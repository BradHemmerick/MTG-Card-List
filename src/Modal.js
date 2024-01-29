import React from 'react';

const manaSymbolMap = {
    '{W}': 'ms ms-w',
    '{U}': 'ms ms-u',
    '{B}': 'ms ms-b',
    '{R}': 'ms ms-r',
    '{G}': 'ms ms-g',
    '{C}': 'ms ms-c',
};
const oracleTextWithSymbols = (oracleText) => {
    if (!oracleText) return null;

    const replacedText = oracleText.replace(/{[^}]*}/g, (match) => {
        const symbolKey = match.substring(1, match.length - 1);
        const symbolMap = {
            'T': 'ms-tap',
            'C': 'ms-c',
            'R': 'ms-r',
            'G': 'ms-g',
            'U': 'ms-u',
            'B': 'ms-b',
        };

        const iconClass = symbolMap[symbolKey] || ''; 
        return ` <span class="ms ms-cost ${iconClass}"></span> `;
    });

    return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
};

const Modal = ({ isOpen, onClose, card }) => {
    if (!isOpen || !card) {
        return null;
    }

    const renderPowerToughness = (power, toughness) => {
        if (!power && !toughness) return null;

        const renderNumber = (number) => (
            <>
                <span className={`ms ms-${number} ms-cost-number`} /> {/* Display the number in words */}
                &nbsp;
            </>
        );

        return (
            <span>
                {power && renderNumber(power)}
                {toughness && '/'}
                {toughness && renderNumber(toughness)}
            </span>
        );
    };


    const renderManaCost = (manaCost) => {
        if (!manaCost) return null;

        const manaSymbols = manaCost.match(/{[^}]*}/g) || [];

        return manaSymbols.map((symbol, index) => {
            const symbolKey = symbol.substring(1, symbol.length - 1);
            const iconClass = manaSymbolMap[symbolKey] || '';
            const symbolParts = symbolKey.match(/^(\d+|[WUBRGC])$/);
            const numberPart = symbolParts[1];

            return (
                <span key={index} className="mana-cost-item">
                    {numberPart && (
                        <>
                            <span className={`ms ms-${numberPart.toLowerCase()} ms-cost-number ms-cost ms-shadow`}>&nbsp;</span>
                        </>
                    )}
                    <span className={iconClass} />
                </span>
            );
        });
    };

    const renderLegalities = () => {
        return (
            <div className="legalities">
                <h3>Legalities:</h3>
                {Object.entries(card.legalities).map(([format, legality]) => (
                    <p key={format}>
                        <strong>{format}:</strong> <span style={{ color: legality === 'legal' ? '#75986e' : '#aeaeae' }}>{legality === 'legal' ? 'Legal' : 'Not Legal'}</span>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-flex-container">
                    <div className="modal-image-container">
                        <img src={card.image_uris.large} alt={card.name} className="modal-image" />
                    </div>
                    <div className="card-details">
                        <h2>{card.name}</h2>
                        <p>
                            <strong>Mana Cost:</strong> {renderManaCost(card.mana_cost)}
                        </p>
                        <p>
                            <strong>Type:</strong> {card.type_line}
                        </p>
                        <p>
                            <strong>Oracle Text:</strong> {oracleTextWithSymbols(card.oracle_text)}
                        </p>
                        <p>
                            <strong>Power/Toughness:</strong> {renderPowerToughness(card.power, card.toughness)}                        </p>
                        <p>
                            <strong>Illustrated by:</strong> {card.artist}
                        </p>

                        {renderLegalities()}
                    </div>
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
