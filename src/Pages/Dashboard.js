import React from "react";
import loadingImage from "../images/preloader.gif";
import { Info, Repos, User, Search, Navbar } from "../components/Index";
import {GitContext} from '../context/context'
const Dashboard = () => {
  let { isLoading } = React.useContext(GitContext);
  if (isLoading) {
    return (
      <main>
        <Navbar />
        <Search />
        <img src={loadingImage} className="loading-img" />
      </main>
    );
  }
  return (
    <React.Fragment>
      <Navbar />
      <Search />
      <Info />
      <User />
      <Repos />
    </React.Fragment>
  );
};

export default Dashboard;
