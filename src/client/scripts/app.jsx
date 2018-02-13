// React
import React from 'react';

// Parity native libraries
import { bonds, formatBalance } from 'oo7-parity';
import { Rspan, ReactiveComponent } from 'oo7-react';
import { TransactionProgressLabel, AccountIcon } from 'parity-reactive-ui';

// Deep Learn utilities
// import { Array3D, gpgpu_util, GPGPUContext, NDArrayMathCPU, NDArrayMathGPU } from 'deeplearn';
// import { SqueezeNet } from 'deeplearn-squeezenet';

const randomCatOrDog = document.getElementById('secret');
const inferenceCanvas = document.getElementById('inference-canvas');
const Options = ['Dog', 'Cat'];

const address = '<contract address>';
const ABI = '<abi json>';

class VoteOption extends ReactiveComponent {
	constructor() {
		super(['votes', 'already']);
	}
	readyRender() {
		return (<span style={{
			borderLeft:
				`${1 + this.state.votes / 1e15}px black solid`
		}}>
			<a
				style={{ float: 'left', minWidth: '3em' }}
				href='#'
				onClick={this.props.vote}>
				{this.props.label}
			</a>
			{this.state.already.map(a => (<AccountIcon
				style={{ width: '1.2em', verticalAlign: 'bottom', marginLeft: '1ex' }}
				key={a}
				address={a}
			/>))}
		</span>);
	}
}

// class DerpLearn extends ReactiveComponent {
// 	constructor() {
// 		super(['predict']);
// 	}
// 	readyRender() {
// 		return (
// 			<div>
// 				<a
// 					href='#'
// 					onClick={this.state.predict}>
// 					Deep Net Alchemy!
// 				</a>
// 			</div>)
// 	}
// }

export class App extends React.Component {
	// Constructor
	constructor() {
		super();
		// connect to the contract
		this.predictionMarket = bonds.makeContract(address, ABI);

		// initialize our transaction state
		this.state = { tx: null };

		// fetch up who voted
		this.prevVotes = this.predictionMarket.Voted({ who: bonds.accounts });

		// // derp learning
		// this.gl = gpgpu_util.createWebGLContext(inferenceCanvas);
		// this.gpgpu = new GPGPUContext(this.gl);
		// this.math = new NDArrayMathGPU(this.gpgpu);

		// //this.math = new NDArrayMathCPU();
		// this.squeezeNet = new SqueezeNet(this.math);
	}

	// async inference() {
	// 	// Preprocessing
	// 	randomCatOrDog.width = 227; randomCatOrDog.height = 227;
	// 	randomCatOrDog.style.width = '227px'; randomCatOrDog.style.height = '227px';

	// 	// Prediction
	// 	const logits = this.squeezeNet.predict(Array3D.fromPixels(randomCatOrDog));
	// 	const topClassesToProbs = await this.squeezeNet.getTopKClasses(logits, 5);

	// 	for (const className in topClassesToProbs) {
	// 		console.log(
	// 			`${topClassesToProbs[className].toFixed(5)}: ${className}`);
	// 			console.log(className);
	// 			this.resolve(className);
	// 			break;
	// 	}
	// }

	// resolve(className) {
	// 	if (className == "Siberian husky") {
	// 		this.predictionMarket.choose(0);
	// 	} else {
	// 		this.predictionMarket.choose(1);
	// 	}
	// }
	
	// Random Cat or Dog?
	randomGenerator() {
		const number = Math.floor((Math.random() * 2));
		if (number == 0) {
			randomCatOrDog.src = "./images/dog.jpg";
		} else {
			randomCatOrDog.src = "./images/cat.jpg";
		}
	}

	render() {
		return (<div>
			{Options.map((n, i) => (<div key={i}><VoteOption
				label={n}
				votes={this.predictionMarket.bets(i)}
				vote={() => this.setState({ tx: this.predictionMarket.bet(i, { value: 100 * 1e15 }) })}
				already={this.prevVotes.map(a => a.filter(x => x.option == i).map(x => x.who))}
			/></div>))}
			<div style={{ marginTop: '1em' }}>
				<TransactionProgressLabel value={this.state.tx} />
			</div>

			My balance: <Rspan>
				{bonds.balance(bonds.me).map(formatBalance)}
			</Rspan>

			<DerpLearn
				predict={
					() => {
						this.randomGenerator();
						this.squeezeNet.load().then(() => {
							const y = this.inference()
						});
					}}
			/>
		</div>);
	}
}


// pragma solidity^0.4.19;

// contract PredictionMarket {
    
//     uint chosen;
// 	event Voted(address indexed who, uint indexed option);

// 	function bet(uint _option) payable {
// 		//require(!hasVoted[msg.sender]);
// 		bets[_option] += msg.value;
// 		chose[msg.sender] = _option;
// 		hasVoted[msg.sender] = true;
// 		Voted(msg.sender, _option);
// 	}
	
// 	function release() public {
// 	    require(chose[msg.sender] == chosen);
// 	    msg.sender.transfer(bets[chosen] * 10);
// 		bets[chosen] -= 0.1 * 10e18;
// 	}
	
// 	function choose(uint _option) {
// 	    chosen = _option;
// 	}
	
// 	mapping (uint => uint) public bets;
// 	mapping (address => bool) public hasVoted;
// 	mapping (address => uint) public chose;
	
// 	function die() {
// 	    selfdestruct(msg.sender);
// 	}
// }