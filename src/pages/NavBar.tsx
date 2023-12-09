import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Link from "next/link";
import { LogInWithAnonAadhaar } from "anon-aadhaar-react";

const NavbarComponent = () => {
    return (
        <Navbar
            expand="lg"
            className="bg-body-tertiary"
            data-bs-theme="light"
            style={{ marginBottom: "20px", height: "100px", fontSize: "22px" }}
        >
            <Container fluid>
                <Navbar.Brand href="#">
                    <Image
                        src="https://t4.ftcdn.net/jpg/05/84/26/61/360_F_584266196_lFkZt7CCgGrlhil83DsI0MyGvd8eSDoc.png"
                        width={100}
                        height={100}
                    ></Image>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                    >
                        <Nav.Link>
                            <Link
                                className="nlink"
                                href="/"
                            >
                                Home
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link
                                className="nlink"
                                href="/dashboard"
                            >
                                Dashboard
                            </Link>
                        </Nav.Link>


                        <Nav.Link>
                            <Link
                                className="nlink"
                                href="/resultpage"
                            >
                                Results
                            </Link>
                            </Nav.Link>
                    </Nav>

                    <LogInWithAnonAadhaar />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;