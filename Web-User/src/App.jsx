import { useEffect, useState} from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Balance from "components/Balance";
import Market from "components/Market";
import NativeBalance from "components/NativeBalance";
import { Menu, Layout} from "antd";
import SearchEvent from "components/SearchEvent";
import "antd/dist/antd.css";

import "./style.css";


const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "flex",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "flex",
    fontWeight: "600",
    width : "20%"
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <SearchEvent setInputValue={setInputValue}/>
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              marginLeft: "50px",
              width: "100%",
            }}
            triggerSubMenuAction={"click"}
            defaultSelectedKeys={["Market"]}
          >
            <Menu.Item style = {{display: "flex", width: "30%", position: "auto"}} key="Market" >
              <NavLink to="/market">Market</NavLink>
            </Menu.Item>
            <Menu.Item style = {{display: "flex",width: "30%", position: "auto"}} key="Ticket">
              <NavLink to="/ticket">Your Tickets</NavLink>
            </Menu.Item>
          </Menu>
          <div style={styles.headerRight}>
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/ticket">
              <Balance />
            </Route>
            <Route path="/market">
              <Market/>
            </Route>
          </Switch>
          <Redirect to="/market" />
        </div>
      </Router>
    </Layout>
  );
};



export default App;
