'use strict';

var merge = require('merge-util');
var utils = require('./lib/utils');



// resolve_configs :: String, { <ENV>: {} } -> {}
function resolve_configs(env, confs){
  return merge_confs(filter_confs(env, confs));
}



// merge_confs :: [{}] -> {}
function merge_confs(confs){
  var merged = {};
  for (var i = confs.length - 1; i >= 0; i--) {
    merged = merge(merged, confs[i]);
  }
  return merged;
}



// filter_confs :: String, { <ENV>: {} } -> {}
function filter_confs(env, confs){
  function parse_key(key){
    return key.split(',').map.bind(null, utils.trim);
  }

  function is_applicable_key(key){
    return parse_key(key).filter(utils.contains.bind(null, ['all', env]));
  }

  // for each conf in confs
  // if given env is found in
  // respective conf's env then
  // retain it [the conf].
  var picked = [];
  for (var conf_env in confs) {
    if (!confs.hasOwnProperty(conf_env)) continue;
    if (is_applicable_key(conf_env)) picked.push(confs[conf_env]);
  }
  return picked;
}



module.exports = resolve_configs;