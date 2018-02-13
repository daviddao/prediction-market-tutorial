# Tutorial: AI-powered Prediction Markets

How to build your own predictive market with deep learning on the blockchain #MAXhype

## Prerequisites

#### Download this DApp!

```bash
git clone https://github.com/daviddao/prediction-market-tutorial
```

#### Install [homebrew](https://brew.sh/index_de.html)

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
#### Install [parity](https://www.parity.io/)

```bash
brew tap paritytech/paritytech
brew install parity --stable
```

#### Install [npm](https://nodejs.org/en/)

```bash
brew install node
```

#### Install [webpack](https://webpack.js.org/)

```bash
npm i -g webpack
```

## How to create a DApp

#### Go inside your downloaded repository

```
cd path/to/prediction-market-tutorial
```

#### Download all dependencies

```bash
./init.sh
```

#### Build it

```bash
webpack --watch # will update everytime you change something
```

#### Make it visible for parity

Inside the DApp folder, run:
```bash
# For Mac systems
ln -s $PWD/dist $HOME/Library/Application\ Support/io.parity.ethereum/dapps/mydapp
```

#### Start parity in terminal

```bash
parity --jsonrpc-cors all # removes annoying access control allow origin issues
```
go to `http://127.0.0.1:8180` and switch to your local development chain (otherwise your computer will download ethereum)

## Smart Contract

#### Create some dummy accounts

#### Copy contract into parity contracts, compile and deploy it

```solidity
pragma solidity^0.4.19;

contract PredictionMarket {
    
    uint chosen;
	event Voted(address indexed who, uint indexed option);

	function bet(uint _option) payable {
		require(!hasVoted[msg.sender]);
		bets[_option] += msg.value;
		chose[msg.sender] = _option;
		hasVoted[msg.sender] = true;
		Voted(msg.sender, _option);
	}
	
	function release() public {
	    require(chose[msg.sender] == chosen);
	    msg.sender.transfer(bets[chosen] * 10);
	}
	
	function choose(uint _option) {
	    chosen = _option;
	}
	
	mapping (uint => uint) public bets;
	mapping (address => bool) public hasVoted;
	mapping (address => uint) public chose;
	
	function die() {
	    selfdestruct(msg.sender);
	}
}
```

#### Add ABI and address into app.jsx

Edit these lines with your uploaded address and abi

```javascript
const address = '<contract address>';
const ABI = '<abi json>';
```

## DeepLearnJS

DeepLearnJS is a GPU accelerated library for deep learning in the front-end. 

#### Import dependencies

Import in React inside `src/client/scripts/app.jsx`

```javascript
// Deep Learn utilities
import { Array3D, gpgpu_util, GPGPUContext, NDArrayMathCPU, NDArrayMathGPU } from 'deeplearn';
import { SqueezeNet } from 'deeplearn-squeezenet';
```

#### Initialize SqueezeNet

Inside App constructor, add following lines

```javascript
// derp learning
this.gl = gpgpu_util.createWebGLContext(inferenceCanvas);
this.gpgpu = new GPGPUContext(this.gl);
this.math = new NDArrayMathGPU(this.gpgpu);

//this.math = new NDArrayMathCPU(); //try uncomment to see what happens
this.squeezeNet = new SqueezeNet(this.math);
```

#### Load pretrained model

Load the model inside the derplearn predict attribute

```javascript
<DerpLearn
  predict={
    () => {
      this.randomGenerator();
      this.squeezeNet.load().then(() => {
        const y = this.inference()
      });
    }}
/>
```

#### Add inference method

```javascript
async inference() {
  // Preprocessing
  randomCatOrDog.width = 227; randomCatOrDog.height = 227;
  randomCatOrDog.style.width = '227px'; randomCatOrDog.style.height = '227px';

  // Prediction
  const logits = this.squeezeNet.predict(Array3D.fromPixels(randomCatOrDog));
  const topClassesToProbs = await this.squeezeNet.getTopKClasses(logits, 5);

  for (const className in topClassesToProbs) {
    console.log(
      `${topClassesToProbs[className].toFixed(5)}: ${className}`);
      console.log(className);
      this.resolve(className);
      break;
  }
}
```

#### Finish prediction market by paying back

```javascript
resolve(className) {
  if (className == "Siberian husky") {
    this.predictionMarket.choose(0);
  } else {
    this.predictionMarket.choose(1);
  }
}
```


