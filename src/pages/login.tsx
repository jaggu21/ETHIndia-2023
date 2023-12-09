import Head from "next/head";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "anon-aadhaar-react";
import { useEffect } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import ImageGallery from "react-image-gallery";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
	{
		original:
			"https://media.ptcnews.tv/wp-content/uploads/2023/09/Election-2_697b9153e37b1aa721a8aa5b9d577eac_1280X720.webp",
		thumbnail:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRdJ_YktsYqty4ui6xzCcX9btxLgduKoJ5SA&usqp=CAU",
	},
	{
		original:
			"https://media.ptcnews.tv/wp-content/uploads/2023/09/Election-2_697b9153e37b1aa721a8aa5b9d577eac_1280X720.webp",
		thumbnail:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRdJ_YktsYqty4ui6xzCcX9btxLgduKoJ5SA&usqp=CAU",
	},
	{
		original:
			"https://media.ptcnews.tv/wp-content/uploads/2023/09/Election-2_697b9153e37b1aa721a8aa5b9d577eac_1280X720.webp",
		thumbnail:
			"https://wallpapers.com/images/hd/naruto-characters-five-kage-in-battlefield-r7b1n3bxou26bo1t.jpg",
	},
];

export default function Home() {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
              <Navbar.Brand href="#">
                <Image src="https://as2.ftcdn.net/v2/jpg/05/84/26/61/1000_F_584266196_lFkZt7CCgGrlhil83DsI0MyGvd8eSDoc.jpg" width={100} height={100}></Image>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <Nav.Link href="#action1">Dashboard</Nav.Link>
                  <Nav.Link href="#action2">Guidelines</Nav.Link>
                </Nav>
                
                <LogInWithAnonAadhaar />
                {/* <Button variant="outline-success">Login</Button> */}

              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
            {/* Render the proof if generated and valid */}
            {anonAadhaar?.status === "logged-in" && (
              <>
                <p>✅ Proof is valid</p>
                <p>Got your Aadhaar Identity Proof</p>
                <>Welcome anon!</>
                <AnonAadhaarProof code={JSON.stringify(anonAadhaar.pcd, null, 2)} />
              </>
            )}
          </div>

          <div className="ticker">
            <marquee>
              Change of Schedule for General Election to the Legislative
              Assembly of Mizoram Reg. Friday at 20:22 Festival of
              democracy in full splendour in Telangana as voting for the
              States Legislative Assembly takes place smoothly November 30
              Violation of MCC-Advertisement by Government of Karnataka in
              Telangana -Legislative Assembly of Telangana Election-2023
              November 27 Commissions withdrawal of Permission -Rythu
              Bandhu Scheme-Violation of MCC and Allied Conditions-General
              Election to Legislative Assembly Election Telangana 2023
              November 27 Commission's Show Cause Notice to Sh. K. T. Rama
              Rao, Star Campaigner for BRS November 25
            </marquee>
          </div>

          <Container>
            <ImageGallery items={images} showThumbnails={false} />
            <Image src="https://www.ncbar.org/wp-content/uploads/2022/02/Timeline-Visual.png" className="timeline"></Image>

            <div className="text-center">
              <br></br>
              <br></br>
              <h1 className="center-text">Voting Guidelines</h1>
              <p>
                India is the largest democracy in the world. The right
                to vote and more importantly the exercise of franchise
                by the eligible citizens is at the heart of every
                democracy. We, the people, through this exercise of our
                right to vote have the ultimate power to shape the
                destiny of country by electing our representatives who
                run the Government and take decisions for the growth,
                development and benefit of all the citizens. All
                citizens of India who are 18 years of age as on 1 st
                January of the year for which the electoral roll is
                prepared are entitled to be registered as a voter in the
                constituency where he or she ordinarily resides. Only
                persons who are of unsound mind and have been declared
                so by a competent court or disqualified due to Corrupt
                Practices or offences relating to elections are not
                entitled to be registered in the electoral rolls.
              </p>
            </div>
          </Container>
      </div>



      {/* <main className="flex flex-col items-center gap-8 bg-white rounded-2xl max-w-screen-sm mx-auto h-[24rem] md:h-[20rem] p-8">
        <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
        <p>Prove your Identity anonymously using your Aadhaar card.</p>

        
        <LogInWithAnonAadhaar />
      </main> */}

      
      
    </div>
  );
}
