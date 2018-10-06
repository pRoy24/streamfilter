pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


contract BallotableContents {

    struct Ballot {
        EvaluationScore evaluationScore;
        uint stakingAmount;     // [wei]
        address user;
        uint createdAt;
    }

    struct EvaluationScore {
        uint8 accuracy;
        uint8 relevant;
    }

    struct Reward {
        address targetUser;
        uint amount;    // [wei]
    }

    mapping (uint => Ballot[]) private contentsWithBallot;
    mapping (uint => bool) public contentsFinalizedStatus;

    modifier isOpen(uint contentID) {
        require(
            !contentsFinalizedStatus[contentID],
            "This content is already finalized."
        );
        _;
    }

    function getBallots(
        uint contentID
        ) public view returns(Ballot[]) {
        return contentsWithBallot[contentID];
    }

    function ballot(
        uint contentID, uint8 accuracy, uint8 relevant, uint timestamp
        ) public payable isOpen(contentID) {

        EvaluationScore memory _score = EvaluationScore({
            accuracy: accuracy,
            relevant: relevant
        });

        Ballot memory _ballot = Ballot({
            evaluationScore: _score,
            stakingAmount: msg.value,
            user: msg.sender,
            createdAt: timestamp
        });

        contentsWithBallot[contentID].push(_ballot);
    }

    function sendRewards(uint contentID, Reward[] rewards) public isOpen(contentID) {
        contentsFinalizedStatus[contentID] = true;

        for (uint i=0; i < rewards.length; i++) {
            Reward memory _reward = rewards[i];
            _reward.targetUser.transfer(_reward.amount);
        }
    }
}
 
