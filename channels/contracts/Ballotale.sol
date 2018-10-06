pragma solidity ^0.4.24;


contract Ballotable {
    event BallotStatusUpdated(BallotStatus status);
    event BallotRoundStarted(uint nextRoundAt);
    event BallotAdded(uint8 ballotLength);

    enum BallotStatus {
        Open,
        Closed
    }

    enum ClassifiedStatus {
        None,
        Good,
        Bad
    }

    struct Ballot {
        int8 evaluation;
        string message;
        uint createdAt;
    }
    
    uint public nextRoundAt;
    int8 public evaluatedScore;
    int8[] public evaluations;
    mapping (address => bool) private players;
    mapping (address => Ballot) private ballots;
    BallotStatus public ballotStatus;
    ClassifiedStatus public classifiedStatus;

    modifier onetimeOnly {
        require(
            !players[msg.sender],
            "Only one-time to to call this function."
        );
        _;
    }

    constructor() public {
        classifiedStatus = ClassifiedStatus.None;
        nextRoundAt = 0;    // TODO
        emit BallotRoundStarted(nextRoundAt);
    }

    // -5 <= evaluation <= 5
    function ballot(int8 evaluation, string message) public onetimeOnly payable {
        require(
            evaluation <= 5 && evaluation >= -5,
            "The value of evaluation must be between -5 and 5."
        );

        evaluations.push(evaluation);

        Ballot memory _ballot = Ballot({
            evaluation: evaluation,
            message: message,
            createdAt: now
        });
        ballots[msg.sender] = _ballot;

        finalizationIfNeeded();  // TODO execute this by event driven.

        emit BallotAdded(uint8(evaluations.length));
    }

    function finalizationIfNeeded() public payable {
        if (now > nextRoundAt) {
            evaluatedScore = calculateEvaluatedScore(evaluations);

            if (evaluatedScore > 0) {
                classifiedStatus = ClassifiedStatus.Good;
            } else {
                classifiedStatus = ClassifiedStatus.Bad;
            }

            ballotStatus = BallotStatus.Closed;
            emit BallotStatusUpdated(ballotStatus);
        }
    }

    function calculateEvaluatedScore(int8[] _evaluations) internal pure returns (int8) {
        int16 total = 0;
        uint16 length = uint16(_evaluations.length);
        for (uint16 i=0; i < length; i++) {
            total += _evaluations[i];
        }
        int8 score = int8(total / int16(length));
        return score;
    }
}
