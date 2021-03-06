pragma solidity ^0.4.19;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Lottery is Ownable {
  uint public stakeAmount = 0.001 ether;
  uint public playerCount = 5;
  address[] public tickets;

  function setStakeAmount(uint newStakeAmount) external onlyOwner {
    stakeAmount = newStakeAmount;
  }

  function setPlayerCount(uint newPlayerCount) external onlyOwner {
    playerCount = newPlayerCount;
  }

  function getTickets() public view returns (address[]) {
    return tickets;
  }

  function() external payable {
    require(msg.value == stakeAmount);
    tickets.push(msg.sender);
  }
}
