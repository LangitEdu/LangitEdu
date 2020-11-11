import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import {AuthProvider} from '../contexts/AuthContext'
import RouteName from '../config/Route'

// Component
import UserRoute from './Route/UserRoute'
import GuestOnlyRoute from './Route/GuestOnlyRoute'

// Pages
import Dashboard from '../Pages/Dashboard'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import ForgotPassword from '../Pages/ForgotPassword'
import EditProfile from "../Pages/EditProfile"
import Home from '../Pages/Home'
import ListKomunitas from "../Pages/listKomunitas"
import Admin from "../Pages/Admin"
import Kuis from "../Pages/Kuis"
import MultipleMenus from "../Pages/SimpleMenu"

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
          <UserRoute exact path={RouteName.gotoTopik} component={EditProfile} />
          <UserRoute exact path={RouteName.listKomunitas} component={ListKomunitas} />
          <UserRoute exact path={RouteName.admin} component={Admin} />
          <UserRoute exact path={RouteName.kuis} component={Kuis} />
          <Route exact path={RouteName.home} component={Home} />
          <Route exact path={RouteName.coba} component={MultipleMenus} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
