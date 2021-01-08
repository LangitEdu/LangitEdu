import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import RouteName from "../config/Route";

// Component
import UserRoute from "./Route/UserRoute";
import GuestOnlyRoute from "./Route/GuestOnlyRoute";
import AdminRoute from "./Route/AdminRoute";
// Pages
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import ForgotPassword from "../Pages/ForgotPassword";

import Dashboard from "../Pages/Dashboard";
import EditProfile from "../Pages/EditProfile";
import Home from "../Pages/Home";
import RekomendasiJurusan from "../Pages/RekomendasiJurusan";
import ListKomunitas from "../Pages/listKomunitas";
import Topik from "../Pages/Topik";
import GoToTopik from "../Pages/Topik/Topik";
import Journey from "../Pages/Topik/Journey";
import Kuis from "../Pages/Kuis";
import KuisResult from "../Pages/Kuis/Result";
import HasilRekomendasi from "../Pages/HasilRekomendasi";

import Admin from "../Pages/Admin";
import AdminJourney from "../Pages/Admin/AdminJourney";
import TambahSoal from "../Pages/Admin/TambahSoal";
import EmailActionHandle from "../Pages/EmailActionHandle";
import HasilKuis from "../Pages/Admin/HasilKuis";
import Error404 from "../Pages/Error404";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <GuestOnlyRoute path={RouteName.register} component={Register} />
          <GuestOnlyRoute path={RouteName.login} component={Login} />
          <GuestOnlyRoute
            path={RouteName.forgetPassword}
            component={ForgotPassword}
          />

          <AdminRoute exact path={RouteName.admin} component={Admin} />
          <AdminRoute
            exact
            path={RouteName.liatJourney}
            component={AdminJourney}
          />
          <AdminRoute
            exact
            path={RouteName.tambahSoal}
            component={TambahSoal}
          />
          <AdminRoute
            exact
            path={RouteName.lihatHasilKuis}
            component={HasilKuis}
          />

          <UserRoute exact path={RouteName.dashboard} component={Dashboard} />
          <UserRoute
            exact
            path={RouteName.editProfile}
            component={EditProfile}
          />
          <UserRoute exact path={RouteName.journey} component={Journey} />
          <UserRoute exact path={RouteName.topik} component={Topik} />
          <UserRoute exact path={RouteName.gotoTopik} component={GoToTopik} />
          <UserRoute
            exact
            path={RouteName.listKomunitas}
            component={ListKomunitas}
          />
          <UserRoute exact path={RouteName.kuis} component={Kuis} />
          <UserRoute exact path={RouteName.kuisresult} component={KuisResult} />
          <UserRoute
            exact
            path={RouteName.RekomendasiJurusan}
            component={RekomendasiJurusan}
          />
          <UserRoute
            exact
            path={RouteName.HasilJurusan}
            component={HasilRekomendasi}
          />
          <Route path={RouteName.authAction} component={EmailActionHandle} />
          <Route exact path={RouteName.home} component={Home} />
          <Route path={RouteName.Error404} component={Error404} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
