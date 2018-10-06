pragma solidity ^0.4.24;

import "./Ballotable.sol";


contract BallotableContent is Ballotable {
    address public creator;
    uint public contentID;
    uint public createdAt;
    uint public updatedAt;

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