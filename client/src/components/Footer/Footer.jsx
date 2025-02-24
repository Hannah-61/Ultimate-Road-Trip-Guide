import "./Footer.scss";
import FacebookIcon from "../../assets/images/Facebook.svg";
import InstagramIcon from "../../assets/images/Instagram.svg";
import PinterestIcon from "../../assets/images/Pinterest.svg";
import TwitterIcon from "../../assets/images/X_twitter.svg";

function Footer() {
    return (
        <div className="footer">
            <div className="footer__logo">Route Buddy</div>


            <div className="footer__socials">
                <a href="#" className="footer__socials-icon">
                    <img src={FacebookIcon} alt="Facebook" />
                </a>
                <a href="#" className="footer__socials-icon">
                    <img src={TwitterIcon} alt="Twitter" />
                </a>
                <a href="#" className="footer__socials-icon">
                    <img src={InstagramIcon} alt="Instagram" />
                </a>
                <a href="#" className="footer__socials-icon">
                    <img src={PinterestIcon} alt="Pinterest" />
                </a>
            </div>

            <div className="footer__copyright">
                © 2025 Road Buddy <span>·</span> Terms <span>Privacy</span> <span>Cookies</span>
            </div>
        </div>
    );
}

export default Footer;
