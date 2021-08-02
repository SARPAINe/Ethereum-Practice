import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

function Header() {
  return (
    <div>
      <Menu style={{ marginTop: "10px" }}>
        {/* one brace for saying we want to use js expression another for object */}
        <Link route="/">
          <a className="item">CrowCoin</a>
        </Link>
        <Menu.Menu position="right">
          <Link route="/">
            <a className="item">Campaigns</a>
          </Link>
          <Link route="/campaigns/new">
            <a className="item">+</a>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default Header;
