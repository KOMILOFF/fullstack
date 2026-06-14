import React from 'react'
import "../../src/index.css"
import secons from "../assets/secons.png";
import lightmid from "../assets/Step5.png"
import payst from "../assets/payst.png";

const Step3 = () => {
  return (
    <div className='step-wrapp'>
            <div className="levels">
              <img src={secons} alt="" />
              <img src={lightmid} alt="" />
              <img src={payst} alt="" />
            </div>
            
          <div className="last-mon">
            
          </div>
    </div>
  )
}

export default Step3