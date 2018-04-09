const Lottery = artifacts.require('Lottery');

contract('Lottery', ([owner, ...otherAccounts]) => {
  let lottery;

  beforeEach(async () => {
    lottery = await Lottery.new(owner);
  })

  contract('stakeAmount', () => {
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

  contract('playerCount', () => {
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

  contract('fallback function (when ether is sent directly to contract)', () => {
    const buyer = otherAccounts[0];

    it('should start with no tickets', async () => {
      assert.deepEqual(await lottery.getTickets(), []);
    })

    it('should not be able to buy a ticket for less than the amount', async () => {
      const amount = global.web3.toWei(0.0001, 'ether');

      try {
        await lottery.sendTransaction({from: buyer, value: amount});
      } catch (e) {
        assert.deepEqual(await lottery.getTickets(), []);
      }
    })

    it('should be able to buy a ticket for the exact amount', async () => {
      const amount = global.web3.toWei(0.001, 'ether');

      await lottery.sendTransaction({from: buyer, value: amount});

      assert.deepEqual(await lottery.getTickets(), [buyer]);
    })

    it('should not be able to buy a ticket for an amount over the ticket cost', async () => {
      const amount = global.web3.toWei(0.01, 'ether');

      try {
        await lottery.sendTransaction({from: buyer, value: amount});
      } catch (e) {
        assert.deepEqual(await lottery.getTickets(), []);
      }
    })

    it.only('should send 4/5th of stakeAmount ether to an address once the playerCount is met', async () => {
      const playerCount = await lottery.playerCount();
      const stakeAmount = await lottery.stakeAmount();

      await Promise.all(Array(playerCount - 1).fill().map((_, index) =>
        lottery.sendTransaction({from: otherAccounts[index], value: stakeAmount})
      ));

      assert.deepEqual(global.web3.eth.getBalance(lottery.address).toString(), global.web3.toWei(0.004, 'ether'));

      const ownerBalanceBeforeTransaction = global.web3.eth.getBalance(owner);
      await lottery.sendTransaction({from: otherAccounts[playerCount], value: stakeAmount});

      const ownerBalanceAfterTransaction = global.web3.eth.getBalance(owner);
      assert.deepEqual(`${ownerBalanceAfterTransaction - ownerBalanceBeforeTransaction}`, global.web3.toWei(0.005, 'ether'));
    })
  })

})
