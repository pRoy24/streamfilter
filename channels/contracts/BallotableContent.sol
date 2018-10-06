pragma solidity ^0.4.24;

import "./Ballotable.sol";


contract BallotableContent is Ballotable {
    address creator;
    uint contentID;
    uint createdAt;
    uint updatedAt;

    constructor(
        address _creator,
        uint _contentID
    ) public {
        creator = _creator;
        contentID = _contentID;
        createdAt = now;
        updatedAt = now;
    }
}