import { useState, useEffect, CSSProperties } from "react";
import { Bar } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./NavBar";
import Container from "react-bootstrap/Container";
import { SyncLoader } from "react-spinners";


import { ethers } from 'ethers';

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


Chart.register(CategoryScale);

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

const resultpage = () => {
    const [wardCandidates, setPartyDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const cachedPartyDetails = localStorage.getItem('cachedPartyDetails');
        const cachedTimestamp = localStorage.getItem('cachedTimestamp');

        if (
            cachedPartyDetails &&
            cachedTimestamp &&
            Date.now() - parseInt(cachedTimestamp, 10) < 2 * 30 * 1000 // 2 minutes
        ) {
            // Use the cached data if it's still valid
            setPartyDetails(JSON.parse(cachedPartyDetails));
            setLoading(false);
        } else {
            // Fetch party details and update the state
            getPartyDetails()
                .then((details:any) => {
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

    const chartData = {
        labels: wardCandidates.map((party:any) => party.name),
        datasets: [
            {
                label: 'Votes',
                data: wardCandidates.map((party:any) => party.votes),
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


    return (
        <div className="body">
            <NavbarComponent />
            <br />
            <div style={{paddingTop:"7vw"}}> 
            {
                loading ? (
                    <SyncLoader
                        color="#000000"
                        loading={loading}
                        cssOverride={override_spinner}
                        size={20}
                        aria-label="Loading Spinner"
                        data-testid="loader"
					/>
                ): 
                (
                    
                    <Container style={{width: "75%"}}>
                        <Bar data={chartData} />
                    </Container>
                    
                )
            }
            </div>
        </div>
    )
}


export default resultpage;