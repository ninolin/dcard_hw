const { expect } = require('chai');
const supertest = require('supertest');
const api = supertest('http://localhost:8545');

//測試同個ip在60秒進來超過60次的話，頁面會回傳Error
describe('Test Same IP Request Over 60sec In one mins will show error page', async () => {
    //連續發60個訪問頁面的請求都不是Error
    new Array(60).fill('0').map(() => {
        it('send 60 time requests in same time', (done) => {
            api.get('/')
                .expect(200)
                .end((err, res) => {
                    if (err) console.log(err);
                    expect(res.text).to.not.equal("Error");
                    done();
                });
        });
    });
    //發送第61個請求時頁面會顯示Error
    it('send 1 request expect error', (done) => {
        api.get('/')
            .expect(200)
            .end((err, res) => {
                if (err) console.log(err);
                expect(res.text).to.equal("Error");
                done();
            });
    })
    //等待60秒再發送第62個請求時頁面不是Error
    it('sleep 60 sec and send 1 request expect not error', (done) => {
        setTimeout(function () {
            api.get('/')
                .expect(200)
                .end((err, res) => {
                    if (err) console.log(err);
                    expect(res.text).to.not.equal("Error");
                    done();
                });
        }, 61000);
    }).timeout(63000);
});