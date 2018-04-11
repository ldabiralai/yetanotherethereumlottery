pragma solidity ^0.4.19;

contract Random {
  function rand(uint min, uint max) public view returns (uint) {
    uint256 lastBlockNumber = block.number - 1;
    uint256 hashValue = uint256(block.blockhash(lastBlockNumber));

    uint number = 5;
    return hashValue;
  }
}
