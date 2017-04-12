import { expect } from 'chai';
import test from 'ava';
import autodiscover from '../src/index';

test('get auto discover url', async () => {
  const emailAddress: string = 'mark.bradley@crosslead.com';
  const password: string = 'PASSWORD';

  const url: string | null = await autodiscover({
    username : emailAddress,
    emailAddress,
    password,
    debug: true
  });

  expect(url, 'should find correct active sync url').to.equal('https://outlook.office365.com/Microsoft-Server-ActiveSync');
});