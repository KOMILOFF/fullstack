import React from 'react'
import "../footer/footer.css"
const Footer = () => {
  return (
    <div>
        <footer className="site-footer">
        <div className="footer-div">

      <div className="foot-first">
        <h3 className="first-title">cyber</h3>
        <p>We are a residential interior design firm located in Portland. Our boutique-studio offers more than</p>
      </div>

      <div className="foot-second">
        <h3 className="second-title">Services</h3>
        <p className="second-opt">Bonus program</p>
        <p className="second-opt">Gift cards</p>
        <p className="second-opt">Credit and payment</p>
        <p className="second-opt">Service contracts</p>
        <p className="second-opt">Non-cash account</p>
        <p className="second-opt">Payment</p>
      </div>

      <div className="foot-third">
        <h3 className="third-title">Assistance to the buyer</h3>
        <p className="third-opt">Find an order</p>
        <p className="third-opt">Terms of delivery</p>
        <p className="third-opt">Exchange and terurn of goods</p>
        <p className="third-opt">Guarante</p>
        <p className="third-opt">Frequently asked questions</p>
        <p className="third-opt">Terms of use of the site</p>
      </div>

        </div>
      </footer>
    </div>
  )
}

export default Footer