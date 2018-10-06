pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


contract BallotableContents {

    struct Ballot {
        EvaluationScore evaluationScore;
        address user;
        uint createdAt;
    }

    struct EvaluationScore {
        uint8 accuracy;
        uint8 relevant;
    }

    mapping (uint => Ballot[]) contentsWithBallot;

    function getBallots(
        uint contentID
        ) public view returns(Ballot[]) {
        return contentsWithBallot[contentID];
    }

    function ballot(uint contentID, uint8 accuracy, uint8 relevant, uint timestamp) public {
        EvaluationScore memory _score = EvaluationScore({
            accuracy: accuracy,
            relevant: relevant
        });

        Ballot memory _ballot = Ballot({
            evaluationScore: _score,
            user: msg.sender,
            createdAt: timestamp
        });

        contentsWithBallot[contentID].push(_ballot);
    }
}