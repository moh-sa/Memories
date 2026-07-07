//Hooks
import { useStyles } from "./styes";
//Components
import { Outlet } from "react-router-dom";
//UI Components
import Header from "layouts/Navigation/Header/Header";
import Footer from "layouts/Navigation/Footer/Footer";
import { FloatingButton } from "components";

const Main = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.parent}>
      <FloatingButton />
      <Header />
      <div className={classes.children}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
