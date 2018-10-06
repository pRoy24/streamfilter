pragma solidity ^0.4.24;

import "./BallotableContent.sol";


contract ContentsFactory {
    address[] public contentContracts;
    mapping (uint => address) public contentContractWithContentID;

    function getContents(uint limit, uint offset) public view returns(address[] _contentContracts) {
        // TODO use limit, offset.
        return contentContracts;
    }

    function getContent(uint contentID) public view returns(address contentContract) {
        return contentContractWithContentID[contentID];
    }

    function getContentsCount() public constant returns(uint contentsCount) {
        return contentContracts.length;
    }

    function addContent(uint contentID) public payable returns(address contentContract) {
        BallotableContent _contentContract = new BallotableContent(msg.sender, contentID);
        contentContracts.push(address(_contentContract));
        return address(_contentContract);
    }
}