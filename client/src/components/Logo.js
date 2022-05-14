import react from "react";
import logo from '../img/BugTracker-Dashboard-Logo.png';
import { Link} from "react-router-dom";

const Logo = () => {

    return(
        <Link to={'/dashboard'}><div className="dashboard-logo"><img src={logo} /></div></Link>
    )
}

export default Logo