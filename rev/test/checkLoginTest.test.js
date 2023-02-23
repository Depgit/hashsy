const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Server status', function () {
  it('responds with status 200', function (done) {
    chai.request('http://localhost:5000')
      .post('/v1/user/login')
      .send({ email: "3@6.com", password: "1234" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
