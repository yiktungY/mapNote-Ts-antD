import { Layout } from "antd";

import "./App.css";
import Home from "./components/Home";

const { Header, Footer, Content } = Layout;
function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>
        <Home />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
export default App;
