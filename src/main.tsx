import Container from "@material-ui/core/Container";
import Nav from "./components/Nav";
import Body from "./components/Body";

const Main: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Nav />
      <Body />
    </Container>
  );
};

export default Main;
