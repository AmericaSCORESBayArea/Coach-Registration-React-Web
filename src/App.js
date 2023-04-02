import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HashRouter } from "react-router-dom";
import Route from "./Routes";

const baseTheme = createTheme();
if (`${process.env.REACT_APP_NODE_ENV}` === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}
const App = () => (
  <HashRouter>
    <ThemeProvider theme={baseTheme}>
      <div className="App">
        <Route />
      </div>
    </ThemeProvider>
  </HashRouter>
);

export default App;
