import React from 'react';
import './Palette.css';


const Color = ({color, curColor, handleColor}) => 
  <div className={`color ${color === curColor && 'active'}`} style={{background: color}} onClick={() => handleColor(color)}/>
const Palette = ({colors, curColor, handleColor}) => {
  return (
    <section className="palette">
      {colors.map((color) => {
        return <Color key={color} color={color} curColor={curColor} handleColor={handleColor}/>
      })}
    </section>
  );
};

export default Palette;