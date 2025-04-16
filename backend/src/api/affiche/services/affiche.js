'use strict';

/**
 * affiche service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::affiche.affiche');
