/* eslint-disable no-undef */

require('../app')
const net = require('net')
const assert = require('chai').assert

const validDeviceId = '861510030796102'
const invalidDeviceId = '000000000000000'

describe('Gateway', function () {
  it('message prevalidation fails', (done) => {
    const client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      client.write('test')
    })

    client.on('data', function (data) {
      assert.equal(data, 'ko 001')
      client.destroy() // kill client after server's response
    })

    client.on('close', function () {
      done()
    })
  })

  it('parser fails', (done) => {
    const client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      client.write(validDeviceId + '|asdfasdjfasdfas dfas dfasdf asdf')
    })

    client.on('data', function (data) {
      data = data.toString()
      assert.equal(data, 'ko 002')
      client.destroy() // kill client after server's response
    })

    client.on('close', function () {
      done()
    })
  })
})

describe('Parser 2', () => {
  it('invalid position', (done) => {
    const client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      client.write(validDeviceId + '|2,111506.000,0000.0000,N')
    })

    client.on('data', function (data) {
      data = data.toString()
      assert.equal(data, 'ko 003')
      client.destroy() // kill client after server's response
    })

    client.on('close', function () {
      done()
    })
  })

  it('invalid location', (done) => {
    const client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      client.write(validDeviceId + '|2,111506.000,0000.0000,N,00000.0000,E,0,0,,0.0,M,0.,3829')
    })

    client.on('data', function (data) {
      data = data.toString()
      assert.equal(data, 'ko 004')
      client.destroy()
    })

    client.on('close', function () {
      done()
    })
  })

  it('valid position', (done) => {
    const client = new net.Socket()

    client.connect(9000, '127.0.0.1', function () {
      client.write(validDeviceId + '|2,101337.000,0039.5200,N,-0000.4541,W,1,8,1.43,94.0,3839')
    })

    client.on('data', function (data) {
      data = data.toString()
      assert.equal(data, 'okis')
      client.destroy() // kill client after server's response
    })

    client.on('close', function () {
      done()
    })
  })
})
