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
            style={{ 
                marginBottom: "20px", height: "100px", fontSize: "22px",top: "0",
            display: "inline-flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "5vw",
            width: "100%",
            position: "fixed",
            zIndex: "1",
            background: "white",
            boxShadow: "0px 1px 2px rgba(255, 172, 28, 0.5), 0px 2px 4px rgba(255, 172, 28, 0.5), 0px 4px 8px rgba(255, 172, 28, 0.5), 0px 8px 16px rgba(255, 172, 28, 0.5)",
        }}
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