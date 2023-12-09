import Link from "next/link";
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { Bar } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);



import { useAnonAadhaar, LogInWithAnonAadhaar } from "anon-aadhaar-react";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';

const contractAddress = '0x6aFDb4DB8FdE0527a558C0B705323D2C40367B65';
const abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "string", "name": "proof", "type": "string" }, { "internalType": "uint256[]", "name": "votesDistribution", "type": "uint256[]" }], "name": "voteParty", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "aadharProof", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "parties", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "string", "name": "url", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }], "stateMutability": "view", "type": "function" }]; // Replace with your actual ABI

const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

const contract = new ethers.Contract(contractAddress, abi, provider);

async function getPartyDetails() {
	try {
		// Get the total number of parties
		const partiesCount = 5;

		// Fetch details for each party
		const partyDetails = [];
		for (let i = 0; i < partiesCount; i++) {
			const party = await contract.parties(i);

			// Convert the BigNumber to a regular number
			const votes = party.votes.toNumber();

			// Add party details to the array
			partyDetails.push({
				id: party.id.toNumber(),
				name: party.name,
				symbol: party.symbol,
				url: party.url,
				votes: votes,
			});
		}

		console.log('Party Details:', partyDetails);
		return partyDetails;
	} catch (error) {
		console.error('Error fetching party details:', error);
		throw error; // Rethrow the error to be caught by the caller
	}
}

async function voteForParty(aadharProof: string, votesDistribution: number[]) {
	try {
		// Connect to the provider (MetaMask or other provider injected into the browser)
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		// Prompt the user to connect their wallet
		await provider.send('eth_requestAccounts', []);

		// Get the signer from the provider
		const signer = provider.getSigner();

		// Create a contract instance with the signer
		const contract = new ethers.Contract(contractAddress, abi, signer);

		// Call the voteParty function on the smart contract
		const transaction = await contract.voteParty(aadharProof, votesDistribution);

		// Wait for the transaction to be mined
		await transaction.wait();

		console.log('Vote successful!');
	} catch (error) {
		console.error('Error voting for the party:', error);
	}
}

// const wardCandidates = [
// 	{
// 		id: 0,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 1,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 2,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 3,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 4,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 5,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// 	{
// 		id: 6,
// 		photosrc:
// 			"https://static.wikia.nocookie.net/naruto/images/3/32/Shikamaru_Adulthood.png/",
// 		party: "Konohagakure",
// 		name: "Shikamaru Nara",
// 	},
// ];

// fetch ward candidates from smart contract


const DashboardPage = (props) => {
	const router = useRouter();
	const [voteState, setVoteState] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
	const [anonAadhaar] = useAnonAadhaar();
	const [wardCandidates, setPartyDetails] = useState([]);

	useEffect(() => {
		// Fetch party details and update the state
		getPartyDetails()
			.then((details) => setPartyDetails(details))
			.catch((error) => console.error('Error setting party details state:', error));
	}, []);

	useEffect(() => {
		console.log("Anon Aadhaar: ", anonAadhaar.status);
	}, [anonAadhaar]);

	const handleChange = (event, idx) => {
		const newVoteState = { ...voteState };
		// console.log(idx);
		// console.log(event.target.value);
		newVoteState[idx] = event.target.value;
		setVoteState(newVoteState);
		console.log(newVoteState);
	};

	const chartData = {
		labels: wardCandidates.map((party) => party.name),
		datasets: [
			{
				label: 'Votes',
				data: wardCandidates.map((party) => party.votes),
				backgroundColor: [
					'rgba(75,192,192,0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					],
					borderColor: [
						'rgba(75,192,192)',
						'rgba(255, 159, 64)',
						'rgba(255, 205, 86)',
						'rgba(75, 192, 192)',
						'rgba(54, 162, 235)',
						],
				borderWidth: 1,
			},
		],
	};

	console.log(chartData);


	if (anonAadhaar.status === "logged-out") {
		router.push("/")
	}


	return (
		<>
			{anonAadhaar?.status === "logged-in" && (
				<div className="body">
					<Navbar
						expand="lg"
						className="bg-body-tertiary"
						data-bs-theme="dark"
					>
						<Container fluid>
							<Navbar.Brand href="#">
								<Image
									src="https://as2.ftcdn.net/v2/jpg/05/84/26/61/1000_F_584266196_lFkZt7CCgGrlhil83DsI0MyGvd8eSDoc.jpg"
									width={50}
									height={20}
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
											href="/dashboard"
										>
											Dashboard
										</Link>
									</Nav.Link>
									<Nav.Link>
										<Link
											className="nlink"
											href="/"
										>
											Guidelines
										</Link>
									</Nav.Link>
								</Nav>

								<LogInWithAnonAadhaar />
							</Navbar.Collapse>
						</Container>
					</Navbar>

					<Container className="text-center">
						<br></br>
						<br></br>
						<br></br>

						<h1>Indian Decentralized Prime Ministrial Elections</h1>
						<br></br>
						<h2>Your Vote is Secure, Your Vote Counts</h2>
						<br></br>
						<p>You can vote for as many candidates till sum = 1</p>
						<br></br>

						

						<Row>
							{wardCandidates.map((candidate) => {
								return (
									<Col key={candidate.id} md={4}>
										<Card data-bs-theme="dark"
											key={candidate.id}
											style={{ width: "18rem" }}
										>
											<Card.Img
												variant="top"
												src={candidate.url}
											/>
											<Card.Body>
												<Card.Title>
													{candidate.name}
												</Card.Title>
												<Card.Text>
													Party: {candidate.symbol}
												</Card.Text>

												<Form.Control
													onChange={(event) =>
														handleChange(
															event,
															candidate.id
														)
													}
													type="number"
													placeholder="0"
													min={0}
													max={10}
													step={1}
												/>
												<br />
											</Card.Body>
											<br></br>
										</Card>
										<br></br>
									</Col>
								);
							})}
						</Row>

						<div className="text-center">
							<Button onClick={() => voteForParty(JSON.stringify(
								anonAadhaar.pcd,
								null,
								2
							), Object.values(voteState))}>Vote</Button>
						</div>

						<div>
        					<Bar data={chartData} />
      					</div>

						<br></br>
						<br></br>
						<br></br>
						<br></br>
					</Container>
				</div>
			)}
			;



		</>
	);
};
export default DashboardPage;
