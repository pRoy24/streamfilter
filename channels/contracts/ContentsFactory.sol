pragma solidity ^0.4.24;


// interface
contract BallotableContent {
    constructor(address creator, uint contentID) public {}
}


contract ContentsFactory {
    address[] public contentContracts;
    mapping (uint => address) public contentContractWithContentID;

    function getContents(uint limit, uint offset) public view returns(address[]) {
        // TODO use limit, offset.
        return contentContracts;
    }

    function getContent(uint contentID) public view returns(address) {
        return contentContractWithContentID[contentID];
    }

    function getContentsCount() public constant returns(uint) {
        return contentContracts.length;
    }

    function addContent(uint contentID) public returns(address) {
        BallotableContent _contentContract = new BallotableContent(msg.sender, contentID);
        contentContracts.push(address(_contentContract));
        return address(_contentContract);
    }
}