import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import {AuthProvider} from '../contexts/AuthContext'
import RouteName from '../config/Route'

// Component
import UserRoute from './Route/UserRoute'
import GuestOnlyRoute from './Route/GuestOnlyRoute'
import AdminRoute from './Route/AdminRoute'
// Pages
import Dashboard from '../Pages/Dashboard'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import ForgotPassword from '../Pages/ForgotPassword'
import EditProfile from "../Pages/EditProfile"
import Home from '../Pages/Home'
import ListKomunitas from "../Pages/listKomunitas"
import Topik from '../Pages/Topik'
import Admin from "../Pages/Admin"
import Kuis from "../Pages/Kuis"
import KuisResult from "../Pages/Kuis/Result"
import MultipleMenus from "../Pages/SimpleMenu"
import Journey from "../Pages/Journey"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <GuestOnlyRoute path={RouteName.register} component={Register} />
          <GuestOnlyRoute path={RouteName.login} component={Login} />
          <GuestOnlyRoute path={RouteName.forgetPassword} component={ForgotPassword} />
          <UserRoute exact path={RouteName.dashboard} component={Dashboard} />
          <UserRoute exact path={RouteName.editProfile} component={EditProfile} />
          <UserRoute exact path={RouteName.topik} component={Topik} />
          <UserRoute exact path={RouteName.gotoTopik} component={Topik} />
          <UserRoute exact path={RouteName.listKomunitas} component={ListKomunitas} />
          <AdminRoute exact path={RouteName.admin} component={Admin} />
          <AdminRoute exact path={RouteName.liatJourney} component={Journey} />
          <UserRoute exact path={RouteName.kuis} component={Kuis} />
          <UserRoute exact path={RouteName.kuisresult} component={KuisResult} />
          <Route exact path={RouteName.home} component={Home} />
          <Route exact path={RouteName.coba} component={MultipleMenus} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
