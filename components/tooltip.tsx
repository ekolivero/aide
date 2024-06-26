import React from 'react';

const Tooltip = ({ visible, text, position }: { visible: any, text: any, position: any }) => {
    if (!visible) return null;

    return (
        <div className="tooltip" style={{ top: position.y, left: position.x }}>
            {text}
        </div>
    );
};

export default Tooltip;