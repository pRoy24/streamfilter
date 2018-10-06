pragma solidity ^0.4.24;

import "./BallotableContent.sol";


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
        BallotableContent _contentContract = new BallotableContent(contentID);
        contentContracts.push(address(_contentContract));
        return address(_contentContract);
    }
}