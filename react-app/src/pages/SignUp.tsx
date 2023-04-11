import { Container } from "react-bootstrap"
import AccountInfo from "../components/AccountInfo"

const SignUp = () => {
  return (
    <Container>
      <h1>Sign Up</h1>
      <AccountInfo isEmployee={false} />
    </Container>
  )
}

export default SignUp