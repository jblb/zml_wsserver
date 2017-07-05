#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

var cfg = {
    masks: ["foxynico", "jofox"],
    
    dependancies: ["leds_layout.h"  "router_config.h", "wifi_host_config.h"]
    
    mainInoSrc: "zmlserver.ino",
    
    common_dir: path.join('.', 'common'),
    
    masks_dir: path.join('.', 'masks'),
    
    target_dir: path.join('.', 'www'),
    
    mainInoPrefix: "zml_ws_"
};

fse.ensureDirSync(cfg.target_dir);

var mainInoSrcPath = path.join(cfg.common_dir, cfg.mainInoSrc);
var curDepFile = null;
var curMaskName, curMaskDirname, curMaskDir, curIno, curDep, curDepSrc,
    curDepDest;
for (var i = 0, l = cfg.masks.length; i < l; i++) {
    curMaskName = cfg.masks[i];
    curMaskDirname = cfg.mainInoPrefix + curMaskName;
    curMaskDir = path.join(target_dir, curMaskDirname);
    fs.ensureDirSync(curMaskDir);
    curIno =  = path.join(curMaskDir, curMaskDirname + ".ino");
    fse.copySync(mainInoSrcPath, curIno);
    for (var j = 0, m = cfg.dependancies.length; j < m; j++) {
        curDep = cfg.dependancies[i];
        curDepDest = path.join(curMaskDir, curDep);
        curDepSrc = path.join(cfg.masks_dir, curMaskName, curDep);
        if (fs.existsSync(curDepSrc)) {
            curDepFile = curDepSrc;
        } else {
            curDepSrc = path.join(cfg.common_dir, curDep);
            if (fs.existsSync(curDepSrc)) {
                curDepFile = curDepSrc;
            }
        }
        if (curDepFile === null) {
            console.log('error: missing file dependency "' + curDep + '"!');
        } else {
            fse.copySync(curDepFile, curDepDest);
            curDepFile = null;
        }
    }
    console.log("sources for the mask '" + curMaskName + "' generated.");
}

console.log("done: sources for all masks generated.");