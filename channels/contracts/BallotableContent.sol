pragma solidity ^0.4.24;

import "./Ballotable.sol";


contract BallotableContent is Ballotable(1 minutes) {
    uint public contentID;
    uint public createdAt;
    uint public updatedAt;

    constructor(
        uint _contentID
    ) public {
        contentID = _contentID;
        createdAt = now;
        updatedAt = now;
    }
}
