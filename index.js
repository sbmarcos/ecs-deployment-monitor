'use strict'

const AWS = require('aws-sdk');
const _ = require('lodash');

const Service = require('./lib/service');
const Deployment = require('./lib/deployment');

module.exports = function(options) {
  _.defaults(options, {
    continueService: false
  });

  // Set the default region to 'us-east-1' if not already set
  if (!AWS.config.region) {
    AWS.config.update({
      region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
    });
  }

  let service = new Service({
    serviceName: options.serviceName,
    clusterArn: options.clusterArn
  });

  let deployment = new Deployment({
    taskDefinitionArn: options.taskDefinitionArn,
    failureThreshold: options.failureThreshold,
    service: service
  });

  deployment.on('end', (state) => {
    service.destroy();
    deployment.destroy();
  });

  return deployment;
}
