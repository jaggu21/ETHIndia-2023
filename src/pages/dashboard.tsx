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
import { useAnonAadhaar, LogInWithAnonAadhaar,  } from "anon-aadhaar-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, CSSProperties } from "react";
import { ethers } from 'ethers';
import { SyncLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarComponent from "./Navbar";
import { groth16, Groth16Proof, ZKArtifact } from 'snarkjs'

// https://scroll-sepolia.l2scan.co/address/0xDF62dBB5DE7ab392e64A5Bc5B86E5Dd723afacc4

Chart.register(CategoryScale);

// const contractAddress = '0x6aFDb4DB8FdE0527a558C0B705323D2C40367B65'; // polygon mumbai testnet address
const contractAddress = '0xDF62dBB5DE7ab392e64A5Bc5B86E5Dd723afacc4';
const abi = [{"inputs":[{"internalType":"address","name":"_verifierAddr","type":"address"},{"internalType":"uint256","name":"_appId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"},{"internalType":"uint256[34]","name":"input","type":"uint256[34]"},{"internalType":"string","name":"proof","type":"string"},{"internalType":"uint256[]","name":"votesDistribution","type":"uint256[]"}],"name":"voteParty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"aadharProof","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"appId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ISSUER_MODULUS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"parties","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"url","type":"string"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SNARK_SCALAR_FIELD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"verifierAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"},{"internalType":"uint256[34]","name":"input","type":"uint256[34]"}],"name":"verifyProof","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
const provider = new ethers.providers.JsonRpcProvider('https://scroll-sepolia.blockpi.network/v1/rpc/public');
const contract = new ethers.Contract(contractAddress, abi, provider);

const override_spinner: CSSProperties = {
	display: "flex",
	// margin: "10 auto",
	justifyContent: "center",
	alignItems: "center",
	height: "100vh",
};

function splitToWords(
	number: bigint,
	wordsize: bigint,
	numberElement: bigint
  ) {
	let t = number
	const words: string[] = []
	for (let i = BigInt(0); i < numberElement; ++i) {
	  const baseTwo = BigInt(2)
  
	  words.push(`${t % BigInt(Math.pow(Number(baseTwo), Number(wordsize)))}`)
	  t = BigInt(t / BigInt(Math.pow(Number(BigInt(2)), Number(wordsize))))
	}
	if (!(t == BigInt(0))) {
	  throw `Number ${number} does not fit in ${(
		wordsize * numberElement
	  ).toString()} bits`
	}
	return words
  }

async function exportCallDataGroth16FromPCD(
	_pcd: any
  ): Promise<{
	a: [any, any]
	b: [[any, any], [any, any]]
	c: [any, any]
	Input: any[]
  }> {
	const calldata = await groth16.exportSolidityCallData(_pcd.proof.proof, [
	  _pcd.proof.nullifier.toString(),
	  ...splitToWords(BigInt(_pcd.proof.modulus), BigInt(64), BigInt(32)),
	  _pcd.proof.app_id.toString(),
	])
  
	const argv = calldata
	  .replace(/["[\]\s]/g, '')
	  .split(',')
	  .map((x: string) => BigInt(x).toString())
  
	const a: [any, any] = [argv[0], argv[1]]
	const b: [[any, any], [any, any]] = [
	  [argv[2], argv[3]],
	  [argv[4], argv[5]],
	]
	const c: [any, any] = [argv[6], argv[7]]
	const Input = []
  
	for (let i = 8; i < argv.length; i++) {
	  Input.push(argv[i])
	}
	return { a, b, c, Input }
  }

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

async function voteForParty(anonAadhaar: any, votesDistribution: number[]) {
	try {
		// Connect to the provider (MetaMask or other provider injected into the browser)
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		// Prompt the user to connect their wallet
		await provider.send('eth_requestAccounts', []);

		// Get the signer from the provider
		const signer = provider.getSigner();

		// Create a contract instance with the signer
		const contract = new ethers.Contract(contractAddress, abi, signer);

		const { a, b, c, Input } = await exportCallDataGroth16FromPCD(
			anonAadhaar.pcd
		);

		var aadharProof = JSON.stringify(
			anonAadhaar.pcd,
			null,
			2
		);

		// console.log(a, b, c, Input, aadharProof, votesDistribution);

		// Call the voteParty function on the smart contract
		const transaction = await contract.voteParty(a, b, c, Input, aadharProof, votesDistribution);

		// Wait for the transaction to be mined
		await transaction.wait();

		toast.success("Voting was successful! Thank you");
		console.log('Vote successful!');
	} catch (error) {
		toast.error(`Error while voting, please try again`);
		console.log('Error voting for the party:', error);
	}
}

const DashboardPage = (props) => {
	const router = useRouter();
	const [voteState, setVoteState] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
	const [anonAadhaar] = useAnonAadhaar();
	const [wardCandidates, setPartyDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [voteCount, setVoteCount] = useState(0);

	useEffect(() => {

		const cachedPartyDetails = localStorage.getItem('cachedPartyDetails');
		const cachedTimestamp = localStorage.getItem('cachedTimestamp');

		if (
			cachedPartyDetails &&
			cachedTimestamp &&
			Date.now() - parseInt(cachedTimestamp, 10) < 1 * 30 * 1000 // 2 minutes
		) {
			// Use the cached data if it's still valid
			setPartyDetails(JSON.parse(cachedPartyDetails));
			setLoading(false);
		} else {
			// Fetch party details and update the state
			getPartyDetails()
				.then((details) => {
					// Cache the new data
					localStorage.setItem('cachedPartyDetails', JSON.stringify(details));
					localStorage.setItem('cachedTimestamp', Date.now().toString());

					// Update the state
					setPartyDetails(details);
					setLoading(false);
				})
				.catch((error) => console.error('Error fetching party details:', error));
		}
	}, []);

	useEffect(() => {
		console.log("Anon Aadhaar: ", anonAadhaar.status);
	}, [anonAadhaar]);

	const handleChange = (event, idx) => {
		const newVoteState = { ...voteState };
		// console.log(idx);
		// console.log(event.target.value);
		var oldVote = parseInt(newVoteState[idx]);
		var newVote = parseInt(event.target.value);

		if(newVote >= oldVote) {
			if (voteCount === 10) {
				toast.info("You have already assigned 10 votes");
				return;
			}
			newVoteState[idx] = event.target.value;
			setVoteCount(voteCount + newVote - oldVote);
			setVoteState(newVoteState);
		}

		else{
			setVoteCount(voteCount - oldVote + newVote);
			newVoteState[idx] = event.target.value;
			setVoteState(newVoteState);
		}
		// console.log(newVoteState);
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
					<div>
					<NavbarComponent />
						{
							loading ?

								<SyncLoader
									color="#000000"
									loading={loading}
									cssOverride={override_spinner}
									size={20}
									aria-label="Loading Spinner"
									data-testid="loader"
								/>

								: (

									<div>
										<Container className="text-center container">
											<h1>Indian Decentralized Prime Ministrial Elections</h1>
											<br/>
											<h2>Your Vote is Secure 🔐, Your Vote Counts ➕</h2>
											<br/>
											<div style={{background: "#eee", alignSelf: "center", width: "400px", height: "50px", display: "inline-block", borderRadius: "10px"}}>
												<h2>Votes assigned {voteCount}/10</h2>
											</div>
											<Row>
												{wardCandidates.map((candidate) => {
													return (
														<Col key={candidate.id} md={4}>
															<Card data-bs-theme="light"
																key={candidate.id}
																style={{ width: "20rem", height: "30rem", border: "1px solid black", margin: "20px" }}
															>
																<Card.Img
																	variant="top"
																	src={candidate.url}
																	style={{ height: "20rem", width: "20rem", padding: "10px" }}
																/>
																<Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
																		max={11}
																		step={1}
																		style={{
																			borderRadius: '8px',
																			border: '1px solid #000000',
																			padding: '10px',
																			fontSize: '24px',
																			width: '100%', // or any other width
																		}}
																		value={voteState[candidate.id]}
																	/>
																</Card.Body>
															</Card>
														</Col>
													);
												})}
											</Row>

											<Button onClick={() => voteForParty(anonAadhaar, Object.values(voteState))}
											style = {{width: "100px", marginTop: "20px", marginBottom: "20px", padding: "10px", fontSize: "20px"}}	
											>
											Vote 🗳
											</Button>

											{/* <div>
												<Bar data={chartData} />
											</div> */}
										</Container>
									</div>
								)}
						<ToastContainer />
					</div>
				</div>
			)}
			;
		</>
	);
};
export default DashboardPage;
