"use strict";

const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/:param', function (req, res) {
    let param = req.params.param;

    res.render(param, {});
  });

  return router;
}
