pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


contract BallotableContents {

    struct Ballot {
        EvaluationScore evaluationScore;
        uint stakingAmount;     // [wei]
        address player;
        uint createdAt;
    }

    struct EvaluationScore {
        uint8 accuracy;
        uint8 relevant;
    }

    enum ContentStatus {
        Live,
        Closed
    }

    struct Content {
        uint8 accuracyScore;
        ContentStatus status;
        uint16 ballotCount;
        uint stakedAmount;   // [wei]
        uint closeAt;
        mapping ( address => Ballot) ballots;
    }

    struct Reward {
        address targetPlayer;
        uint amount;    // [wei]
    }

    mapping (uint => Ballot[]) private contentsWithBallot;
    mapping (uint => address[]) private rewardCandidatePlayers;
    mapping (uint => EvaluationScore[]) private contentsWithEvaluationScore;
    mapping (uint => bool) public contentsFinalizedStatus;
    mapping (uint => Content) public contents;

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

    function getAccuracyScore(uint contentID) public view returns(uint8) {
        return contents[contentID].accuracyScore;
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
            player: msg.sender,
            createdAt: timestamp
        });

        contentsWithBallot[contentID].push(_ballot);
        contentsWithEvaluationScore[contentID].push(_score);
        
        if (contents[contentID].ballotCount != 0) {
            Content storage _content = contents[contentID];
            _content.ballotCount += 1;
            _content.stakedAmount += msg.value;
            

            if (!isClosed(contentID)) {
                rewardCandidatePlayers[contentID].push(msg.sender);
            }
        } else {
            Content memory _contentNew = Content({
                accuracyScore: 0,
                status: ContentStatus.Live,
                ballotCount: 1,
                stakedAmount: msg.value,
                closeAt: now + 20 minutes
            });
            contents[contentID] = _contentNew;
            rewardCandidatePlayers[contentID].push(msg.sender);
        }
        
        Content storage __content = contents[contentID];
        __content.ballots[msg.sender] = _ballot;

        calcScoreAndSendRewardsIfNeeded(contentID);
    }

    function calcScoreAndSendRewardsIfNeeded(uint contentID) public isOpen(contentID) {
        EvaluationScore[] memory _evaluations = contentsWithEvaluationScore[contentID];
        EvaluationScore memory _evaluatedScore = calculateEvaluatedScore(_evaluations);

        Content storage _content = contents[contentID];
        _content.accuracyScore = _evaluatedScore.accuracy;

        if (isClosed(contentID) && _content.ballotCount >= 3) {
            address[] memory _rewardCandidatePlayers = rewardCandidatePlayers[contentID];
            electContributorsAndCalcRewardsAndSend(
                contentID,
                _evaluatedScore, 
                _rewardCandidatePlayers);
            
            closeContent(contentID);
        } else {
            // TODO extend time?
        }
    }

    function isClosed(uint contentID) public view returns(bool) {
        Content memory _content = contents[contentID];
        return now > _content.closeAt;
    }

    function closeContent(uint contentID) internal {
        contentsFinalizedStatus[contentID] = true;
    }

    function electContributorsAndCalcRewardsAndSend(
        uint contentID,
        EvaluationScore _evaluatedScore,
        address[] _candidatePlayers
        ) internal {
        
        Content storage _content = contents[contentID];
        address[] storage _electedPlayers;

        uint16 _candidatePlayerslength = uint16(_candidatePlayers.length);
        for (uint i=0; i < _candidatePlayerslength; i++) {
            address _player = _candidatePlayers[i];
            Ballot memory _ballot = _content.ballots[_player];
            if (_ballot.evaluationScore.accuracy >= _evaluatedScore.accuracy) {
                _electedPlayers.push(_player);
            }
        }

        uint16 _electedPlayerslength = uint16(_electedPlayers.length);
        if (_electedPlayerslength > 0) {
            uint rewardAmountForEach = _content.stakedAmount / _electedPlayerslength;
            for (uint j=0; j < _electedPlayerslength; j++) {
                // Send reward.
                _electedPlayers[j].transfer(rewardAmountForEach);
            }
        }
    }

    function calculateEvaluatedScore(EvaluationScore[] _evaluations) internal pure returns (EvaluationScore) {
        int16 totalOfAccuracyScore = 0;
        int16 totalOfRelevantScore = 0;
        uint16 length = uint16(_evaluations.length);
        for (uint16 i=0; i < length; i++) {
            totalOfAccuracyScore += _evaluations[i].accuracy;
            totalOfRelevantScore += _evaluations[i].relevant;
        }
        uint8 averageAccuracyScore = uint8(totalOfAccuracyScore / int16(length));
        uint8 averageRelevantScore = uint8(totalOfRelevantScore / int16(length));
        
        EvaluationScore memory _evaluatedScore = EvaluationScore({
            accuracy: averageAccuracyScore,
            relevant: averageRelevantScore
        });
        return _evaluatedScore;
    }
}
 
