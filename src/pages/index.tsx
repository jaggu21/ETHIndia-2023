import Head from "next/head";
import Link from "next/link";

import { AnonAadhaarProof, LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import ImageGallery from "react-image-gallery";
import NavbarComponent from "./NavBar";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
	{
		original:
			"https://i.imgur.com/7fJ98QD.png",
		thumbnail:
			"https://i.imgur.com/7fJ98QD.png",
	},
	{
		original:
			"https://i.imgur.com/sVVnAy8.png",
		thumbnail:
			"https://i.imgur.com/sVVnAy8.png",
	},
];

export default function Home() {
	// Use the Country Identity hook to get the status of the user.
	const [anonAadhaar] = useAnonAadhaar();

	useEffect(() => {
		console.log("Anon Aadhaar: ", anonAadhaar.status);
	}, [anonAadhaar]);

	return (
		<div className="body">
			<div>
				<NavbarComponent />

				<div style={{paddingTop:"7vw"}}>
					<div className="tickermarq">
						<marquee>
							Change of Schedule for General Election to the
							Legislative Assembly of Mizoram Reg. Friday at 20:22
							Festival of democracy in full splendour in Telangana
							as voting for the States Legislative Assembly takes
							place smoothly November 30 Violation of
							MCC-Advertisement by Government of Karnataka in
							Telangana -Legislative Assembly of Telangana
							Election-2023 November 27 Commissions withdrawal of
							Permission -Rythu Bandhu Scheme-Violation of MCC and
							Allied Conditions-General Election to Legislative
							Assembly Election Telangana 2023 November 27
							Commission's Show Cause Notice to Sh. K. T. Rama
							Rao, Star Campaigner for BRS November 25
						</marquee>
					</div>

					<Container>
						<div className="imgg">
							<ImageGallery
								items={images}
								showThumbnails={true}
							/>
						</div>

						<br></br>
						<br></br>
						<br></br>

						<Image
							src="https://www.ncbar.org/wp-content/uploads/2022/02/Timeline-Visual.png"
							className="timeline"
						></Image>

						<br></br>
						<br></br>


						<div className="text-center">
							{/* Render the proof if generated and valid */}
							{anonAadhaar?.status === "logged-in" && (
								<>
									<p>✅ Proof is valid</p>
									<p>Got your Aadhaar Identity Proof</p>
									<p>Welcome anon!</p>
									<br></br>
									<AnonAadhaarProof
										code={JSON.stringify(
											anonAadhaar.pcd,
											null,
											2
										)}
									/>
								</>
							)}
						</div>

						<div className="text-center">
							<br></br>
							<br></br>
							<h1 className="center-text" id="guidelines">
								Voting Guidelines
							</h1>
							<p>
								India is the largest democracy in the world. The
								right to vote and more importantly the exercise
								of franchise by the eligible citizens is at the
								heart of every democracy. We, the people,
								through this exercise of our right to vote have
								the ultimate power to shape the destiny of
								country by electing our representatives who run
								the Government and take decisions for the
								growth, development and benefit of all the
								citizens. All citizens of India who are 18 years
								of age as on 1 st January of the year for which
								the electoral roll is prepared are entitled to
								be registered as a voter in the constituency
								where he or she ordinarily resides. Only persons
								who are of unsound mind and have been declared
								so by a competent court or disqualified due to
								Corrupt Practices or offences relating to
								elections are not entitled to be registered in
								the electoral rolls.
							</p>
						</div>
					</Container>
				</div>
			</div>
		</div>
	);
}
