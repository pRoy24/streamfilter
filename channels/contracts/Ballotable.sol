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
        EvaluationScore evaluationScore;
        uint stakingAmount;     // [wei]
        string message;
        uint createdAt;
    }

    struct EvaluationScore {
        uint8 accuracyScore;
        uint8 relevantScore;
    }
    
    uint public nextRoundAt;
    address[] private players;
    address[] public electedPlayers;
    mapping (address => bool) private playersForExists;
    mapping (address => Ballot) private ballots;
    mapping (address => uint) public rewards;
    EvaluationScore[] private evaluations;
    EvaluationScore public evaluatedScore;
    BallotStatus public ballotStatus;
    ClassifiedStatus public classifiedStatus;

    modifier onetimeOnly {
        require(
            !playersForExists[msg.sender],
            "Only one-time to to call this function."
        );
        _;
    }

    constructor(uint16 roundPeriodSeconds) public {
        require(
            roundPeriodSeconds > 1 minutes,
            "roundPeriodSeconds must be larger than 60."
        );

        classifiedStatus = ClassifiedStatus.None;
        ballotStatus = BallotStatus.Open;
        nextRoundAt = now + roundPeriodSeconds;
        emit BallotRoundStarted(nextRoundAt);
    }

    function ballot(uint8 accuracyScore, uint8 relevantScore, string message) public onetimeOnly payable {
        require(
            accuracyScore <= 10 && relevantScore <= 10,
            "The value of each score must be lower than 10."
        );

        players.push(msg.sender);
        playersForExists[msg.sender] = true;

        EvaluationScore memory _evaluationScore = EvaluationScore({
            accuracyScore: accuracyScore,
            relevantScore: relevantScore
        });
        evaluations.push(_evaluationScore);

        Ballot memory _ballot = Ballot({
            evaluationScore: _evaluationScore,
            stakingAmount: msg.value,
            message: message,
            createdAt: now
        });
        ballots[msg.sender] = _ballot;

        finalizationIfNeeded();  // TODO execute this by event driven.

        emit BallotAdded(uint8(evaluations.length));
    }

    function finalizationIfNeeded() public {
        // TODO finalization condition.
        if (now > nextRoundAt && evaluations.length > 3) {
            evaluatedScore = calculateEvaluatedScore(evaluations);

            electContributorsAndSendIfNeeded(evaluatedScore, players);

            // TODO classification algo.
            if (evaluatedScore.accuracyScore > 2 && evaluatedScore.relevantScore > 2) {
                classifiedStatus = ClassifiedStatus.Good;
            } else {
                classifiedStatus = ClassifiedStatus.Bad;
            }

            ballotStatus = BallotStatus.Closed;
            emit BallotStatusUpdated(ballotStatus);
        }
    }

    function electContributorsAndSendIfNeeded(
        EvaluationScore _evaluatedScore,
        address[] _candidatePlayers
        ) internal {

        uint16 _candidatePlayerslength = uint16(_candidatePlayers.length);
        for (uint i=0; i < _candidatePlayerslength; i++) {
            address _player = _candidatePlayers[i];
            Ballot memory _ballot = ballots[_player];
            if (
                _ballot.evaluationScore.accuracyScore >= _evaluatedScore.accuracyScore &&
                _ballot.evaluationScore.relevantScore >= _evaluatedScore.relevantScore
            ) {
                electedPlayers.push(_player);
            }
        }

        uint totalStakedAmount = address(this).balance;
        uint16 _electedPlayerslength = uint16(electedPlayers.length);
        if (_electedPlayerslength > 0) {
            uint rewardAmountForEach = totalStakedAmount / _electedPlayerslength;
            for (uint j=0; j < _electedPlayerslength; j++) {
                rewards[electedPlayers[j]] = rewardAmountForEach;
                electedPlayers[j].transfer(rewardAmountForEach);
            }
        }
    }

    function calculateEvaluatedScore(EvaluationScore[] _evaluations) internal pure returns (EvaluationScore) {
        int16 totalOfAccuracyScore = 0;
        int16 totalOfRelevantScore = 0;
        uint16 length = uint16(_evaluations.length);
        for (uint16 i=0; i < length; i++) {
            totalOfAccuracyScore += _evaluations[i].accuracyScore;
            totalOfRelevantScore += _evaluations[i].relevantScore;
        }
        uint8 averageAccuracyScore = uint8(totalOfAccuracyScore / int16(length));
        uint8 averageRelevantScore = uint8(totalOfRelevantScore / int16(length));
        
        EvaluationScore memory _evaluatedScore = EvaluationScore({
            accuracyScore: averageAccuracyScore,
            relevantScore: averageRelevantScore
        });
        return _evaluatedScore;
    }
}
