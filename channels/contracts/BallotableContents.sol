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
        // for math
        uint8 population;
        uint accuracyDifferencesSquaredSum;
        uint accuracyVariance;
        uint standardDeviation;
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
    mapping (uint => mapping (address => bool)) private playersForExists;
    mapping (uint => address[]) private rewardCandidatePlayers;
    mapping (uint => address[]) private rewardWonPlayers;
    mapping (uint => EvaluationScore[]) private contentsWithEvaluationScore;
    mapping (uint => bool) public contentsFinalizedStatus;
    mapping (uint => Content) public contents;
    uint public sharedRewardPoolAmount;    // Jackpot

    modifier isOpen(uint contentID) {
        require(
            !contentsFinalizedStatus[contentID],
            "This content is already finalized."
        );
        _;
    }

    modifier onetimeOnly(uint contentID) {
        require(
            !playersForExists[contentID][msg.sender],
            "Only one-time to to call this function."
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

    function getStakedAmount(uint contentID) public view returns(uint) {
        return contents[contentID].stakedAmount;
    }

    function getBallotCount(uint contentID) public view returns(uint) {
        return contents[contentID].ballotCount;
    }
    
    function getRewardWonPlayers(uint contentID) public view returns(address[]) {
        return rewardWonPlayers[contentID];
    }

    function getCloseAt(uint contentID) public view returns(uint) {
        return contents[contentID].closeAt;
    }

    function isClosed(uint contentID) public view returns(bool) {
        if (contentsFinalizedStatus[contentID]) {
            return true;
        } else {
            Content memory _content = contents[contentID];
            return now > _content.closeAt;
        }
    }

    function ballot(
        uint contentID, uint8 accuracy, uint8 relevant, uint timestamp
        ) public payable 
        isOpen(contentID)
        onetimeOnly(contentID)
        {

        playersForExists[contentID][msg.sender] = true;

        EvaluationScore memory _score = EvaluationScore({
            accuracy: accuracy,
            relevant: relevant,
            population: 0,
            accuracyDifferencesSquaredSum: 0,
            accuracyVariance: 0,
            standardDeviation: 0
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
            // 2+ time
            Content storage _content = contents[contentID];
            _content.ballotCount += 1;
            _content.stakedAmount += msg.value;
            

            if (!isClosed(contentID)) {
                rewardCandidatePlayers[contentID].push(msg.sender);
            }
        } else {
            // First time
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

        if ((isClosed(contentID) && _content.ballotCount >= 3) || _content.ballotCount >= 10) {
            address[] memory _rewardCandidatePlayers = rewardCandidatePlayers[contentID];
            rewardWonPlayers[contentID] = electContributors(
                contentID,
                _evaluatedScore, 
                _rewardCandidatePlayers);
            calcRewardsAndSend(contentID, _evaluatedScore);
            closeContent(contentID);
        } else {
            // TODO extend time?
        }
    }

    function closeContent(uint contentID) internal {
        contentsFinalizedStatus[contentID] = true;
    }

    function electContributors(
        uint contentID,
        EvaluationScore _evaluatedScore,
        address[] _candidatePlayers
        ) internal view returns(address[]) {
        
        uint16 _candidatePlayerslength = uint16(_candidatePlayers.length);
        address[] memory _rewardWonPlayers = new address[](_candidatePlayerslength);

        bool isEveryoneFaithful = _evaluatedScore.standardDeviation < 1;

        if (isEveryoneFaithful) {
            _rewardWonPlayers = _candidatePlayers;
        } else {
            uint16 _rewardWonPlayersIndex = 0;
            for (uint i=0; i < _candidatePlayerslength; i++) {
                address _player = _candidatePlayers[i];
                Ballot memory _ballot = contents[contentID].ballots[_player];
                uint8 _accuracy = _ballot.evaluationScore.accuracy;

                int8 diff = int8(_evaluatedScore.accuracy) - int8(_accuracy);
                if (diff >= -1 && diff <= 1) {
                    _rewardWonPlayers[_rewardWonPlayersIndex] = _player;
                    _rewardWonPlayersIndex++;
                }
            }
        }
        
        return _rewardWonPlayers;
    }

    function calcRewardsAndSend(uint contentID, EvaluationScore _evaluatedScore) internal isOpen(contentID) {
        Content storage _content = contents[contentID];
        address[] memory _rewardWonPlayers = rewardWonPlayers[contentID];

        bool isEveryoneFaithful = _evaluatedScore.standardDeviation < 1;

        uint16 _rewardWonPlayerslength = uint16(_rewardWonPlayers.length);
        if (_rewardWonPlayerslength > 0) {
            uint rewardAmountForEach = _content.stakedAmount / _rewardWonPlayerslength;
            uint addToSharedRewardPoolAmount = 0;
            uint subFromSharedRewardPoolAmount = 0;

            if (isEveryoneFaithful) {
                uint fromSharedRewardPoolForEach = sharedRewardPoolAmount / _rewardWonPlayerslength;
                rewardAmountForEach += fromSharedRewardPoolForEach;
                subFromSharedRewardPoolAmount = sharedRewardPoolAmount;
            } else {
                uint togoSharedRewardPoolForEach = rewardAmountForEach / 10; // 10% goes to shared pool!!!;
                rewardAmountForEach -= togoSharedRewardPoolForEach;
                addToSharedRewardPoolAmount = togoSharedRewardPoolForEach * _rewardWonPlayerslength;
            }

            for (uint j=0; j < _rewardWonPlayerslength; j++) {
                // Send reward.
                _rewardWonPlayers[j].transfer(rewardAmountForEach);
            }

            sharedRewardPoolAmount += addToSharedRewardPoolAmount - subFromSharedRewardPoolAmount;
        }
    }

    function calculateEvaluatedScore(
        EvaluationScore[] _evaluations) 
        internal pure returns(EvaluationScore) 
        {
        int16 totalOfAccuracyScore = 0;
        int16 totalOfRelevantScore = 0;
        uint accuracyDifferencesSquaredSum = 0;
        uint16 length = uint16(_evaluations.length);
        require(length != 0);

        for (uint16 i=0; i < length; i++) {
            totalOfAccuracyScore += _evaluations[i].accuracy;
            totalOfRelevantScore += _evaluations[i].relevant;
        }
        uint8 averageAccuracyScore = uint8(totalOfAccuracyScore / int16(length));
        uint8 averageRelevantScore = uint8(totalOfRelevantScore / int16(length));

        for (uint16 j=0; j < length; j++) {
            accuracyDifferencesSquaredSum += (averageAccuracyScore - _evaluations[j].accuracy)^2;
        }
        uint accuracyVariance = accuracyDifferencesSquaredSum / length;
        uint standardDeviation = sqrt(accuracyVariance);
        
        EvaluationScore memory _evaluatedScore = EvaluationScore({
            accuracy: averageAccuracyScore,
            relevant: averageRelevantScore,
            population: uint8(length),
            accuracyDifferencesSquaredSum: accuracyDifferencesSquaredSum,
            accuracyVariance: accuracyVariance,
            standardDeviation: standardDeviation
        });
        return _evaluatedScore;
    }

    function sqrt(uint x) internal pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
 
