'use strict';

/**
 * affiche router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::affiche.affiche');
