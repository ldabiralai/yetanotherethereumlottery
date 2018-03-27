const Lottery = artifacts.require('Lottery');

contract('Lottery', ([owner, ...otherAccounts]) => {
  let lottery;

  beforeEach(async () => {
    lottery = await Lottery.new(owner);
  })

  describe('stakeAmount', () => {
    const defaultStakeAmount = global.web3.toWei(0.001, 'ether');
    const newStakeAmount = global.web3.toWei(1, 'ether');

    it('should have a default stake amount of 0.001', async () => {
      assert.equal(await lottery.stakeAmount(), defaultStakeAmount);
    });

    it('should be able to update stake amount', async () => {
      await lottery.setStakeAmount(newStakeAmount);

      assert.equal(await lottery.stakeAmount(), newStakeAmount);
    });

    it('should not update stake amount if not the owner', async () => {
      try {
        await lottery.setStakeAmount(newStakeAmount, {from: otherAccounts[0]});
      } catch (e) {
        assert.equal(await lottery.stakeAmount(), defaultStakeAmount);
      }
    })
  })

  describe('playerCount', () => {
    it('should have a default player count of 5', async () => {
      const expectedPlayerCount = 5;

      assert.equal(await lottery.playerCount(), expectedPlayerCount);
    });

    it('should be able to update player count', async () => {
      const newPlayerCount = 10;
      await lottery.setPlayerCount(newPlayerCount);

      assert.equal(await lottery.playerCount(), newPlayerCount);
    });

    it('should not update player count if not the owner', async () => {
      const newPlayerCount = 10;

      try {
        await lottery.setPlayerCount(newPlayerCount, {from: otherAccounts[0]});
      } catch (e) {
        assert.equal(await lottery.playerCount(), 5);
      }
    })
  })

})
