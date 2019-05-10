import { expect } from 'chai';
import { jwtApp } from '../../src/jwt';

describe('test session', () => {

    it('test jwtApp', () => {
        console.log(jwtApp)
        expect(!!jwtApp).to.be.eq(true);
    });

});