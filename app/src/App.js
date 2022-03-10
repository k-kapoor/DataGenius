import React, {useEffect} from "react"
import { NavBar } from "./components/NavBar";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Error404 } from "./pages/Error404";
import { loginCookie } from "./APIClient.js";
import { DataGeniusContext } from "./DataGeniusContext";
import { CurateList } from "./pages/CurateList";
import { Curate } from "./pages/Curate";
import { Leaderboard } from "./pages/Leaderboard";
import { ViewDataset } from "./pages/ViewDataset";
import { FAQ } from "./pages/FAQ";

export default function App() {
  const {user, setUser} = React.useContext(DataGeniusContext);

  // Used for automatically logging in the user using cookies
  useEffect(() => {
    loginCookie().then(response => {
    setUser({ exists: true, username: response.data.name, avatar: response.data.avatar })
  }).catch(err => {
  });
  }, [])

  return (
    <Router>
      <div className="App">
          <NavBar />
          <div className="content">
            <Switch>
              <Route exact path="/">
                {user.exists ? <Redirect to={"/profile/"+user.username} /> : <Redirect to="/login" component={Login} /> }
              </Route>
              <Route path="/login" component={Login}>
                {user.exists && <Redirect to={"/profile/"+user.username} /> }
              </Route>
              <Route path="/register" component={Register}>
                {user.exists && <Redirect to={"/profile/"+user.username} />  }
              </Route>
              <Route path={"/profile/:username"} component={Profile} />
              {/* This routes "/profile" to the user's own account*/}
              <Route exact path={"/profile"}><Redirect to={"/profile/"+ user.username} /> </Route>
              <Route exact path={"/curate"} component={CurateList} />
              <Route path={"/curateItem"} component={Curate} />
              <Route exact path={"/leaderboard"} component={Leaderboard} />
              <Route path={"/view"} component={ViewDataset} />
              <Route path={"/faq"} component={FAQ} />
              <Route component={Error404} />
            </Switch>
          </div>
      </div>
    </Router>
  );
}
