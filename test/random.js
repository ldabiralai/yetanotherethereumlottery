const Random = artifacts.require('Random');

contract('Random', ([owner, ...otherAccounts]) => {
  let random;

  beforeEach(async () => {
    random = await Random.new(owner);
  })

  contract('rand', () => {

    it.only('should return a random number within constraints', async () => {
      const randomNumber = await random.rand(0, 5);

      console.log(randomNumber)
    })

  })

})
