import Navbar from "./components/layout/Navbar";
import Container from "react-bootstrap/esm/Container";
import ProposalList from "./components/ui/ProposalList";
import Header from "./components/layout/Header";

function App() {
  return (
    <div>
      <Navbar />
      <Container>
        <Header />
        <ProposalList />
      </Container>
    </div>
  );
}

export default App;
