'use strict';

var express = require('express');  
var bodyParser = require('body-parser');
var app = express();  

const fs = require('fs');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
const { Gateway, Wallets } = require('fabric-network');  
const path = require('path');  
const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

app.get('/api/queryallcars', async function (req, res) {  
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

app.get('/api/query/:car_index', async function (req, res) {  
    try {
         // load the network configuration
         const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
 
         // Create a new file system based wallet for managing identities.
         const walletPath = path.join(process.cwd(), 'wallet');
         const wallet = await Wallets.newFileSystemWallet(walletPath);
         console.log(`Wallet path: ${walletPath}`);
 
         // Check to see if we've already enrolled the user.
         const identity = await wallet.get('appUser');
         if (!identity) {
             console.log('An identity for the user "appUser" does not exist in the wallet');
             console.log('Run the registerUser.js application before retrying');
             return;
         }
 
         // Create a new gateway for connecting to our peer node.
         const gateway = new Gateway();
         await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
 
         // Get the network (channel) our contract is deployed to.
         const network = await gateway.getNetwork('mychannel');
 
         // Get the contract from the network.
         const contract = network.getContract('fabcar');
 
        const result = await contract.evaluateTransaction('queryCar', req.params.car_index);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
	} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.post('/api/addcar/', async function (req, res) {  
    try {
         // load the network configuration
         const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
 
         // Create a new file system based wallet for managing identities.
         const walletPath = path.join(process.cwd(), 'wallet');
         const wallet = await Wallets.newFileSystemWallet(walletPath);
         console.log(`Wallet path: ${walletPath}`);
 
         // Check to see if we've already enrolled the user.
         const identity = await wallet.get('appUser');
         if (!identity) {
             console.log('An identity for the user "appUser" does not exist in the wallet');
             console.log('Run the registerUser.js application before retrying');
             return;
         }
 
         // Create a new gateway for connecting to our peer node.
         const gateway = new Gateway();
         await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
 
         // Get the network (channel) our contract is deployed to.
         const network = await gateway.getNetwork('mychannel');
 
         // Get the contract from the network.
         const contract = network.getContract('fabcar');
 
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        console.log(req.body);
        await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');
        await gateway.disconnect();
	} catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})

app.put('/api/changeowner/:car_index', async function (req, res) {  
    try {
         // load the network configuration
         const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
 
         // Create a new file system based wallet for managing identities.
         const walletPath = path.join(process.cwd(), 'wallet');
         const wallet = await Wallets.newFileSystemWallet(walletPath);
         console.log(`Wallet path: ${walletPath}`);
 
         // Check to see if we've already enrolled the user.
         const identity = await wallet.get('appUser');
         if (!identity) {
             console.log('An identity for the user "appUser" does not exist in the wallet');
             console.log('Run the registerUser.js application before retrying');
             return;
         }
 
         // Create a new gateway for connecting to our peer node.
         const gateway = new Gateway();
         await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
 
         // Get the network (channel) our contract is deployed to.
         const network = await gateway.getNetwork('mychannel');
 
         // Get the contract from the network.
         const contract = network.getContract('fabcar');
 
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('changeCarOwner', req.params.car_index, req.body.owner);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    } 
})

app.listen(3000, () => {
    console.log('Server is running port 3000');
});