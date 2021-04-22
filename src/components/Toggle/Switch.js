import React from 'react'
import './Switch.css'

const Switch = ({ isOn, handleToggle, onColor  }) => {
  console.log(isOn)
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ onColor }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
      <div style={{ marginLeft: `1rem` }}>
        { !isOn ?
            <span aria-label="moon" role="img">🌙</span>
          :
            <span aria-label="sun" role="img">☀️</span>
        }
        </div>
        {/* <span className={`react-switch-button`} /> */}
      </label>
    </>
  );
};

export default Switch;