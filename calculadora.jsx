// No-build CDN setup (see index.html): React is a global, not a module import.
// If moving this into a bundler (Vite, Next.js, etc.), reverse both:
//   1. this line -> import React, { useState, useMemo, useRef } from "react";
//   2. "function ComptadorCastells()" below -> "export default function ComptadorCastells()"
const { useState, useMemo, useRef, useEffect } = React;

// Taules de puntuacions del Concurs de Castells (Ajuntament de Tarragona).
// Cada taula: clau = nom canonic del castell, valor = [punts carregat, punts descarregat].
// Les taules canvien per temporada; afegeix-ne de noves a TAULES.
const CASTELLS_ACTUAL = {
  "2de6": [250, 300], "Pde5": [260, 315], "9de6": [295, 355], "4de7": [325, 395], "3de7": [345, 415],
  "4de7a": [465, 515], "3de7a": [485, 545], "7de7": [460, 555], "5de7": [470, 565], "7de7a": [570, 640], "5de7a": [605, 670],
  "3de7s": [635, 705], "9de7": [615, 740], "2de7": [670, 805], "4de8": [700, 845], "Pde6": [765, 920], "3de8": [805, 970],
  "7de8": [905, 1090], "2de8f": [1005, 1210], "Pde7f": [1055, 1270], "5de8": [1150, 1385],
  "4de8a": [1310, 1455], "3de8a": [1375, 1530], "7de8a": [1475, 1635], "5de8a": [1555, 1730],
  "4de9f": [1510, 1820], "3de9f": [1585, 1910],
  "9de8": [1980, 2385], "3de8s": [2340, 2600], "2de9fm": [2265, 2730], "Pde8fm": [2380, 2870],
  "7de9f": [2500, 3010], "5de9f": [2595, 3125], "4de9fa": [2955, 3285], "3de9fa": [3100, 3445],
  "4de9sf": [3405, 4105], "2de8sf": [3575, 4310], "3de10fm": [3755, 4525], "4de10fm": [4095, 4930], "9de9f": [4295, 5180],
  "2de9sm": [4685, 5645], "Pde9fmp": [4920, 5925], "3de9sf": [5165, 6220], "Pde7sf": [5280, 6360],
  "2de10fmp": [5630, 6780], "4de10sm": [5910, 7120], "3de10sm": [6205, 7475],
};

const CASTELLS_2024 = {
  "2de6": [175, 200], "Pde5": [185, 210], "9de6": [230, 265], "4de7": [240, 275], "3de7": [250, 290],
  "4de7a": [345, 380], "3de7a": [330, 360], "7de7": [350, 400], "5de7": [365, 420], "7de7a": [415, 440], "5de7a": [425, 450],
  "3de7s": [435, 460], "9de7": [500, 575], "2de7": [525, 605], "4de8": [550, 635], "Pde6": [580, 665], "3de8": [610, 700],
  "7de8": [760, 875], "2de8f": [800, 920], "Pde7f": [835, 960], "5de8": [880, 1010],
  "4de8a": [965, 1060], "3de8a": [1005, 1110], "7de8a": [1025, 1125], "5de8a": [1055, 1165],
  "4de9f": [1270, 1460], "3de9f": [1335, 1530],
  "9de8": [1665, 1915], "3de8s": [1825, 2005], "2de9fm": [1835, 2110], "Pde8fm": [1925, 2210],
  "7de9f": [2020, 2320], "5de9f": [2090, 2400], "4de9fa": [2250, 2475], "3de9fa": [2315, 2555],
  "4de9sf": [2680, 3195], "2de8sf": [2765, 3300], "3de10fm": [2775, 3405], "4de10fm": [2870, 3510], "9de9f": [3190, 3670],
  "2de9sm": [3245, 3865], "Pde9fmp": [3410, 4060], "3de9sf": [3570, 4250],
  "2de10fmp": [3880, 4460], "4de10sm": [3935, 4685], "3de10sm": [4125, 4910],
};

// El Concurs de 2020 es va anul·lar (covid); el 2022 va reutilitzar la taula de 2018.
const CASTELLS_2018 = {
  "2de6": [175, 200], "Pde5": [185, 210], "9de6": [230, 265], "4de7": [240, 275], "3de7": [250, 290],
  "3de7a": [330, 360], "4de7a": [345, 380], "7de7": [350, 400], "5de7": [365, 420], "7de7a": [415, 440], "5de7a": [425, 450],
  "3de7s": [435, 465], "9de7": [500, 575], "2de7": [525, 605], "4de8": [550, 635], "Pde6": [580, 665], "3de8": [610, 700],
  "7de8": [760, 875], "2de8f": [800, 920], "Pde7f": [835, 960], "5de8": [880, 1010],
  "4de8a": [965, 1060], "3de8a": [1005, 1110], "7de8a": [1025, 1125], "5de8a": [1055, 1165],
  "4de9f": [1270, 1460], "3de9f": [1335, 1530],
  "9de8": [1665, 1915], "3de8s": [1825, 2010], "2de9fm": [1835, 2110], "Pde8fm": [1925, 2210],
  "7de9f": [2020, 2320], "5de9f": [2090, 2400], "4de9fa": [2250, 2475], "3de9fa": [2315, 2555],
  "4de9sf": [2680, 3195], "2de8sf": [2765, 3300], "3de10fm": [2775, 3405], "4de10fm": [2870, 3510], "9de9f": [3190, 3670],
  "2de9sm": [2915, 3705], "2de10fmp": [3370, 3870], "Pde9fmp": [3480, 4000], "3de9sf": [3250, 4130], "4de10sm": [3350, 4260],
};
const CASTELLS_2022 = CASTELLS_2018;

const CASTELLS_2016 = {
  "2de6": [120, 140], "Pde5": [135, 155], "9de6": [165, 190], "4de7": [175, 200], "3de7": [185, 210],
  "3de7a": [240, 265], "4de7a": [250, 275], "7de7": [250, 290], "5de7": [265, 305], "7de7a": [300, 320], "5de7a": [310, 330],
  "3de7s": [315, 335], "9de7": [365, 420], "2de7": [385, 440], "4de8": [400, 460], "Pde6": [425, 485], "3de8": [445, 510],
  "7de8": [550, 635], "2de8f": [580, 665], "Pde7f": [610, 695], "5de8": [640, 735],
  "4de8a": [700, 770], "3de8a": [730, 805], "7de8a": [740, 815], "5de8a": [765, 845],
  "4de9f": [920, 1055], "3de9f": [965, 1110],
  "9de8": [1210, 1390], "3de8s": [1325, 1460], "2de9fm": [1330, 1530], "Pde8fm": [1395, 1605],
  "7de9f": [1465, 1685], "5de9f": [1515, 1740], "4de9fa": [1630, 1800], "3de9fa": [1680, 1855],
  "4de9sf": [2015, 2315], "2de8sf": [2065, 2395], "3de10fm": [2105, 2420], "4de10fm": [2215, 2550], "2de9sm": [2330, 2675],
  "Pde9fmp": [2445, 2810], "3de9sf": [2565, 2950],
};

const CASTELLS_2014 = {
  "2de6": [135, 155], "Pde5": [140, 160], "4de7": [175, 200], "3de7": [185, 210],
  "3de7a": [245, 265], "4de7a": [255, 275], "5de7": [250, 290], "7de7": [270, 305], "5de7a": [295, 320], "3de7s": [310, 335],
  "9de7": [365, 420], "2de7": [385, 440], "4de8": [400, 460], "Pde6": [425, 485], "3de8": [445, 510],
  "7de8": [550, 635], "2de8f": [580, 665], "Pde7f": [610, 695], "5de8": [640, 735],
  "4de8a": [700, 770], "3de8a": [730, 805], "5de8a": [765, 845],
  "4de9f": [920, 1055], "3de9f": [965, 1110],
  "9de8": [1210, 1390], "3de8s": [1325, 1460], "2de9fm": [1330, 1530], "Pde8fm": [1395, 1605],
  "7de9f": [1465, 1685], "5de9f": [1515, 1740], "4de9fa": [1630, 1800], "3de9fa": [1680, 1855], "5de9fa": [1765, 1945],
  "4de9sf": [2015, 2315], "2de8sf": [2065, 2395], "3de10fm": [2105, 2420], "9de9f": [2130, 2450], "4de10fm": [2215, 2550],
  "2de9sm": [2330, 2675], "Pde9fmp": [2445, 2810], "3de9sf": [2565, 2950],
};

// VIII Concurs de castells Vila de Torredembarra (2011). Concurs diferent del de
// Tarragona; inclou castells de 6 que no surten a les taules del concurs gran.
// Font: valors [carregat, descarregat] (la taula original llista descarregat/carregat).
const CASTELLS_TORREDEMBARRA_2011 = {
  "4de6": [185, 220], "3de6": [200, 235], "3de6a": [245, 290], "4de6a": [255, 300], "5de6": [270, 320],
  "7de6": [280, 330], "5de6a": [325, 340], "3de6s": [310, 365], "2de6": [340, 405], "2de6s": [375, 445],
  "9de6": [390, 460], "Pde5": [395, 465], "Pde5s": [395, 465],
  "4de7": [500, 590], "3de7": [535, 630], "3de7a": [650, 770], "4de7a": [675, 795], "5de7": [725, 855],
  "7de7": [735, 870], "5de7a": [865, 910], "3de7s": [815, 965], "9de7": [1030, 1215], "2de7": [1090, 1290],
  "4de8": [1240, 1465], "Pde6": [1345, 1590], "3de8": [1505, 1775],
};

// XX Concurs de castells de Tarragona (2004). Valors [carregat, descarregat]
// (la taula original llista descarregat/carregat).
const CASTELLS_2004 = {
  "4de7": [790, 980], "3de7": [990, 1200], "4de7a": [1210, 1440], "5de7": [1450, 1700], "3de7s": [1710, 1980],
  "2de7": [1990, 2280], "9de7": [2290, 2600], "4de8": [2610, 2940], "Pde6": [2950, 3300], "3de8": [3310, 3680],
  "2de8f": [3690, 4080], "Pde7f": [4090, 4500], "5de8": [4510, 4940], "4de8a": [4950, 5400], "4de9f": [5410, 5880],
  "3de9f": [5890, 6380], "2de9fm": [6390, 6900], "3de8s": [6910, 7440], "9de8": [7450, 8000], "Pde8fm": [8010, 8580],
  "5de9f": [8590, 9180], "4de9fa": [9190, 9800], "4de9sf": [9810, 10440], "3de10fm": [10450, 11100], "2de8sf": [11110, 11780],
  "Pde9fmp": [11790, 12480], "Pde7sf": [12490, 13200], "3de9sf": [13210, 13940], "4de10fm": [13950, 14700], "2de9f": [14710, 15480],
  "5de9sf": [15490, 16280], "4de10f": [16290, 17100], "3de10f": [17110, 17940],
};

// XVIII Concurs de castells de Tarragona (2000). Valors [carregat, descarregat].
const CASTELLS_2000 = {
  "4de7": [800, 980], "3de7": [1000, 1200], "4de7a": [1220, 1440], "5de7": [1460, 1700], "3de7s": [1720, 1980],
  "2de7": [2000, 2280], "9de7": [2300, 2600], "4de8": [2620, 2940], "Pde6": [2960, 3680], "3de8": [3320, 3680],
  "2de8f": [3700, 4080], "Pde7f": [4100, 4500], "5de8": [4520, 4940], "4de8a": [4960, 5400], "4de9f": [5420, 5880],
  "3de9f": [5900, 6380], "3de8s": [6400, 6900], "9de8": [6920, 7440], "2de9fm": [7460, 8000], "Pde8fm": [8020, 8580],
  "5de9f": [8600, 9180], "4de9fa": [9200, 9800], "2de8sf": [9820, 10440], "Pde7sf": [10460, 11100], "4de9sf": [11120, 11780],
  "3de9sf": [11800, 12480], "4de10fm": [12500, 13200], "3de10fm": [13220, 13940], "5de9sf": [13960, 14700], "2de9f": [14720, 15480],
  "4de10f": [15500, 16280], "3de10f": [16300, 17100],
};

// Taula de Puntuacions Unificada 2010. Valors [carregat, descarregat]. Empra la
// nomenclatura "sm" (sense manilles) per als castells de 9/10 del capdamunt.
const CASTELLS_2010 = {
  "4de7": [100, 118], "3de7": [107, 126], "3de7a": [130, 154], "4de7a": [135, 159], "5de7": [145, 171],
  "3de7s": [163, 193], "9de7": [206, 243], "2de7": [218, 258], "4de8": [248, 293], "Pde6": [269, 318],
  "3de8": [301, 355], "2de8f": [340, 401], "Pde7f": [380, 448], "5de8": [480, 566], "4de8a": [513, 606],
  "3de8a": [540, 627], "4de9f": [648, 765], "3de9f": [694, 832], "9de8": [891, 1069], "3de8s": [935, 1122],
  "2de9fm": [980, 1176], "Pde8fm": [1149, 1379], "5de9f": [1470, 1764], "4de9fa": [1568, 1882], "3de9fa": [1622, 1914],
  "4de9sf": [2007, 2409], "2de8sf": [2108, 2529], "3de10fm": [2208, 2650], "2de9sm": [2826, 3391], "Pde7sf": [3014, 3617],
  "4de10fm": [3014, 3617], "3de9sf": [3014, 3617], "Pde9fmp": [3014, 3617], "5de9sf": [3858, 4629], "3de10sm": [3858, 4629],
  "4de10sm": [3858, 4629],
};

// XXII Concurs de castells de Tarragona (2008). Valors [carregat, descarregat].
const CASTELLS_2008 = {
  "4de7": [100, 118], "3de7": [107, 126], "3de7a": [130, 154], "4de7a": [135, 159], "5de7": [145, 171],
  "3de7s": [163, 193], "9de7": [206, 243], "2de7": [218, 258], "4de8": [248, 293], "Pde6": [269, 318],
  "3de8": [301, 355], "2de8f": [340, 401], "Pde7f": [380, 448], "5de8": [480, 566], "4de8a": [513, 606],
  "3de8a": [540, 627], "4de9f": [648, 765], "3de9f": [694, 832], "9de8": [891, 1069], "3de8s": [935, 1122],
  "2de9fm": [980, 1176], "Pde8fm": [1149, 1379], "5de9f": [1470, 1764], "4de9fa": [1568, 1882], "3de9fa": [1622, 1914],
  "4de9sf": [2007, 2409], "2de8sf": [2108, 2529], "3de10fm": [2208, 2650], "2de9f": [2826, 3391], "Pde7sf": [3014, 3617],
  "4de10fm": [3014, 3617], "3de9sf": [3014, 3617], "Pde9fmp": [3014, 3617], "5de9sf": [3858, 4629], "3de10f": [3858, 4629],
  "4de10f": [3858, 4629],
};

// Taula de Puntuacions Unificada 2006. Valors [carregat, descarregat].
const CASTELLS_2006 = {
  "4de7": [100, 118], "3de7": [107, 126], "4de7a": [135, 159], "5de7": [145, 171], "3de7s": [163, 193],
  "9de7": [206, 243], "2de7": [218, 258], "4de8": [248, 293], "Pde6": [269, 318], "3de8": [301, 355],
  "2de8f": [340, 401], "Pde7f": [380, 448], "5de8": [480, 566], "4de8a": [513, 606], "4de9f": [648, 765],
  "3de9f": [694, 832], "9de8": [891, 1069], "3de8s": [935, 1122], "2de9fm": [980, 1176], "Pde8fm": [1149, 1379],
  "5de9f": [1470, 1764], "4de9fa": [1568, 1882], "3de9fa": [1622, 1914], "4de9sf": [2007, 2409], "2de8sf": [2108, 2529],
  "3de10fm": [2208, 2650], "2de9f": [2826, 3391], "Pde7sf": [3014, 3617], "4de10fm": [3014, 3617], "3de9sf": [3014, 3617],
  "Pde9fmp": [3014, 3617], "5de9sf": [3858, 4629], "3de10f": [3858, 4629], "4de10f": [3858, 4629],
};

// Taula de Puntuació Castellera Desc.20 (2004). Valors [carregat, descarregat]
// (la taula original llista descarregat/carregat). S'ha omès la fila "9 de 8 (1
// enxaneta)", una variant no representable que xocaria amb el 9de8 normal.
const CASTELLS_DESC20_2004 = {
  "4de6": [10, 12], "3de6": [11, 13], "4de6a": [15, 17], "3de6a": [15, 17], "5de6": [16, 19],
  "3de6s": [18, 22], "2de6": [21, 25], "9de6": [23, 28], "Pde5": [23, 28], "4de7": [31, 37],
  "3de7": [34, 41], "4de7a": [45, 54], "3de7a": [45, 54], "5de7": [49, 59], "3de7s": [56, 68],
  "9de7": [74, 89], "2de7": [74, 89], "4de8": [82, 98], "Pde6": [94, 112], "3de8": [105, 126],
  "2de8f": [119, 143], "Pde7f": [131, 158], "5de8": [173, 208], "4de8a": [191, 229], "4de9f": [252, 302],
  "3de9f": [277, 332], "9de8": [365, 438], "3de8s": [390, 468], "2de9fm": [414, 497], "Pde8fm": [482, 579],
  "5de9f": [636, 764], "4de9fa": [700, 840], "4de9sf": [924, 1109], "2de8sf": [986, 1183], "3de10fm": [986, 1183],
  "Pde7sf": [1047, 1257], "4de10fm": [1047, 1257], "3de9sf": [1220, 1464], "2de9f": [1220, 1464], "Pde9fmp": [1220, 1464],
  "5de9sf": [1610, 1932], "3de10f": [1610, 1932], "4de10f": [1610, 1932],
};

// --- Taules històriques (segles XX) ---
// Aquests concursos només puntuaven el castell descarregat, així que es desa
// [0, punts]: el carregat val 0. Font: taula comparativa 1932-1980 de la
// Viquipèdia, validada (19 columnes/fila; la columna 1933 quadra amb la taula
// independent de 1933). La columna de 1970 del III Trofeu Anxaneta de Plata
// feia servir una escala pròpia molt petita (2-42 punts).
const CASTELLS_1933 = {
  "2de6": [0, 75], "3de6s": [0, 75], "4de7": [0, 75], "Pde5": [0, 100], "3de7": [0, 150],
  "4de7a": [0, 175], "5de7": [0, 200], "3de7s": [0, 250], "2de7": [0, 400], "Pde6": [0, 450],
  "4de8": [0, 450], "3de8": [0, 500],
};

const CASTELLS_1932 = {
  "3de6s": [0, 20], "Pde5": [0, 20], "2de6": [0, 20], "4de7": [0, 20], "3de7": [0, 20],
  "4de7a": [0, 25], "5de7": [0, 30], "3de7s": [0, 40], "2de7": [0, 40], "4de8": [0, 45],
  "Pde6": [0, 40], "3de8": [0, 50],
};

const CASTELLS_VALLS_1941 = {
  "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300], "5de7": [0, 400], "3de7s": [0, 500],
  "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 800], "3de8": [0, 800],
};

const CASTELLS_VENDRELL_1945 = {
  "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300], "5de7": [0, 400], "3de7s": [0, 500],
  "2de7": [0, 600], "4de8": [0, 700],
};

const CASTELLS_REUS_1948 = {
  "4de7": [0, 200], "3de7": [0, 300], "4de7a": [0, 400], "5de7": [0, 500], "3de7s": [0, 600],
  "2de7": [0, 700], "4de8": [0, 800], "Pde6": [0, 900], "3de8": [0, 900],
};

const CASTELLS_1952 = {
  "Pde5": [0, 100], "2de6": [0, 300], "3de7": [0, 300], "4de7a": [0, 500], "5de7": [0, 400],
  "3de7s": [0, 600], "2de7": [0, 700], "4de8": [0, 800], "Pde6": [0, 1200], "3de8": [0, 900],
};

const CASTELLS_1954 = {
  "Pde5": [0, 200], "2de6": [0, 400], "3de7": [0, 400], "4de7a": [0, 500], "5de7": [0, 500],
  "3de7s": [0, 700], "2de7": [0, 800], "4de8": [0, 900], "Pde6": [0, 1300], "3de8": [0, 1300],
};

const CASTELLS_1956 = {
  "Pde5": [0, 200], "2de6": [0, 400], "3de7": [0, 400], "4de7a": [0, 500], "5de7": [0, 500],
  "3de7s": [0, 700], "2de7": [0, 800], "4de8": [0, 900], "Pde6": [0, 1300], "3de8": [0, 1300],
};

const CASTELLS_JORBA_1964 = {
  "2de6": [0, 75], "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300], "5de7": [0, 400],
  "3de7s": [0, 500], "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 1000], "3de8": [0, 900],
};

const CASTELLS_JORBA_1965 = {
  "2de6": [0, 75], "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300], "5de7": [0, 400],
  "3de7s": [0, 500], "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 1000], "3de8": [0, 900],
};

const CASTELLS_JORBA_1966 = {
  "2de6": [0, 75], "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300], "5de7": [0, 400],
  "3de7s": [0, 500], "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 1000], "3de8": [0, 900],
};

const CASTELLS_ANXANETA_1968 = {
  "Pde5": [0, 75], "2de6": [0, 75], "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300],
  "5de7": [0, 400], "3de7s": [0, 500], "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 1100],
  "3de8": [0, 900], "2de8f": [0, 1700], "Pde7f": [0, 1900], "5de8": [0, 1500], "4de8a": [0, 1300],
};

const CASTELLS_ANXANETA_1969 = {
  "Pde5": [0, 75], "2de6": [0, 75], "4de7": [0, 100], "3de7": [0, 200], "4de7a": [0, 300],
  "5de7": [0, 400], "3de7s": [0, 500], "2de7": [0, 600], "4de8": [0, 700], "Pde6": [0, 1100],
  "3de8": [0, 900], "2de8f": [0, 1700], "Pde7f": [0, 1900], "5de8": [0, 1500], "4de8a": [0, 1300],
};

const CASTELLS_ANXANETA_1970 = {
  "Pde5": [0, 4], "2de6": [0, 2], "4de7": [0, 6], "3de7": [0, 8], "4de7a": [0, 10],
  "5de7": [0, 12], "3de7s": [0, 14], "2de7": [0, 16], "4de8": [0, 18], "Pde6": [0, 22],
  "3de8": [0, 20], "2de8f": [0, 28], "Pde7f": [0, 30], "5de8": [0, 24], "4de8a": [0, 26],
  "3de8s": [0, 36], "4de9f": [0, 32], "3de9f": [0, 34], "4de9sf": [0, 40], "2de8sf": [0, 38],
  "3de9sf": [0, 42],
};

const CASTELLS_1970 = {
  "Pde5": [0, 200], "2de6": [0, 200], "4de7": [0, 300], "3de7": [0, 400], "4de7a": [0, 500],
  "5de7": [0, 600], "3de7s": [0, 700], "2de7": [0, 800], "4de8": [0, 900], "Pde6": [0, 1100],
  "3de8": [0, 1000], "2de8f": [0, 1500], "Pde7f": [0, 1500], "5de8": [0, 1200], "4de8a": [0, 1500],
};

const CASTELLS_ANXANETA_1971 = {
  "Pde5": [0, 100], "2de6": [0, 100], "4de7": [0, 200], "3de7": [0, 300], "4de7a": [0, 400],
  "5de7": [0, 500], "3de7s": [0, 600], "2de7": [0, 700], "4de8": [0, 800], "Pde6": [0, 1000],
  "3de8": [0, 1100], "2de8f": [0, 1400], "Pde7f": [0, 1400], "5de8": [0, 1100], "4de8a": [0, 1400],
};

const CASTELLS_1972 = {
  "Pde5": [0, 200], "2de6": [0, 200], "4de7": [0, 400], "3de7": [0, 500], "4de7a": [0, 600],
  "5de7": [0, 700], "3de7s": [0, 800], "2de7": [0, 900], "4de8": [0, 1000], "Pde6": [0, 1200],
  "3de8": [0, 1200], "2de8f": [0, 1400], "Pde7f": [0, 1400], "5de8": [0, 1500], "4de8a": [0, 1700],
  "3de8s": [0, 1800],
};

const CASTELLS_QUER_1973 = {
  "Pde5": [0, 200], "2de6": [0, 200], "4de7": [0, 400], "3de7": [0, 500], "4de7a": [0, 600],
  "5de7": [0, 700], "3de7s": [0, 800], "2de7": [0, 900], "4de8": [0, 1000], "Pde6": [0, 1200],
  "3de8": [0, 1200], "2de8f": [0, 1400], "Pde7f": [0, 1400], "5de8": [0, 1500], "4de8a": [0, 1700],
  "3de8s": [0, 1800],
};

const CASTELLS_1980 = {
  "4de6": [0, 75], "3de6": [0, 100], "4de6a": [0, 125], "5de6": [0, 150], "3de6s": [0, 200],
  "Pde5": [0, 200], "2de6": [0, 200], "4de7": [0, 400], "3de7": [0, 500], "4de7a": [0, 600],
  "5de7": [0, 700], "3de7s": [0, 800], "2de7": [0, 900], "4de8": [0, 1000], "Pde6": [0, 1200],
  "3de8": [0, 1200], "2de8f": [0, 1300], "Pde7f": [0, 1400], "5de8": [0, 1500], "4de8a": [0, 1700],
  "3de8s": [0, 1850], "4de9f": [0, 2000], "3de9f": [0, 2200], "Pde8fm": [0, 2400], "5de9f": [0, 2600],
  "4de9sf": [0, 2800],
};

// Catàleg de taules disponibles. Ordre = ordre al selector; la primera és la per defecte.
// Per afegir una temporada, duplica una entrada amb el seu id, label i castells propis.
const TAULES = [
  { id: "2026", label: "Taula en vigor (2026)", castells: CASTELLS_ACTUAL },
  { id: "2024", label: "Taula 2024", castells: CASTELLS_2024 },
  { id: "2022", label: "Taula 2022", castells: CASTELLS_2022 },
  { id: "2018", label: "Taula 2018", castells: CASTELLS_2018 },
  { id: "2016", label: "Taula 2016", castells: CASTELLS_2016 },
  { id: "2014", label: "Taula 2014", castells: CASTELLS_2014 },
  { id: "torredembarra-2011", label: "Taula Concurset 2011", castells: CASTELLS_TORREDEMBARRA_2011 },
  { id: "2010", label: "Taula Unificada 2010", castells: CASTELLS_2010 },
  { id: "2008", label: "Taula 2008", castells: CASTELLS_2008 },
  { id: "2006", label: "Taula Unificada 2006", castells: CASTELLS_2006 },
  { id: "2004", label: "Taula 2004", castells: CASTELLS_2004 },
  { id: "desc20-2004", label: "Taula Desc.20 (2004)", castells: CASTELLS_DESC20_2004 },
  { id: "2000", label: "Taula 2000", castells: CASTELLS_2000 },
  { id: "1980", label: "Taula 1980", castells: CASTELLS_1980 },
  { id: "quer-1973", label: "Taula Mobles Quer 1973", castells: CASTELLS_QUER_1973 },
  { id: "1972", label: "Taula 1972", castells: CASTELLS_1972 },
  { id: "anxaneta-1971", label: "Taula Anxaneta 1971", castells: CASTELLS_ANXANETA_1971 },
  { id: "1970", label: "Taula 1970", castells: CASTELLS_1970 },
  { id: "anxaneta-1970", label: "Taula Anxaneta 1970", castells: CASTELLS_ANXANETA_1970 },
  { id: "anxaneta-1969", label: "Taula Anxaneta 1969", castells: CASTELLS_ANXANETA_1969 },
  { id: "anxaneta-1968", label: "Taula Anxaneta 1968", castells: CASTELLS_ANXANETA_1968 },
  { id: "jorba-1966", label: "Taula Jorba 1966", castells: CASTELLS_JORBA_1966 },
  { id: "jorba-1965", label: "Taula Jorba 1965", castells: CASTELLS_JORBA_1965 },
  { id: "jorba-1964", label: "Taula Jorba 1964", castells: CASTELLS_JORBA_1964 },
  { id: "1956", label: "Taula 1956", castells: CASTELLS_1956 },
  { id: "1954", label: "Taula 1954", castells: CASTELLS_1954 },
  { id: "1952", label: "Taula 1952", castells: CASTELLS_1952 },
  { id: "reus-1948", label: "Taula Reus 1948", castells: CASTELLS_REUS_1948 },
  { id: "vendrell-1945", label: "Taula Vendrell 1945", castells: CASTELLS_VENDRELL_1945 },
  { id: "valls-1941", label: "Taula Valls 1941", castells: CASTELLS_VALLS_1941 },
  { id: "1933", label: "Taula 1933", castells: CASTELLS_1933 },
  { id: "1932", label: "Taula 1932", castells: CASTELLS_1932 },
];

// Persones per pis (sempre disponibles)
const PERSONES = [
  { v: "P", l: "Pilar" },
  { v: "2", l: "2 (torre)" },
  { v: "3", l: "3" },
  { v: "4", l: "4" },
  { v: "5", l: "5" },
  { v: "7", l: "7" },
  { v: "9", l: "9" },
];

// Etiquetes de variant i ordre de presentacio
const VARIANT_LABELS = {
  "": "-",
  "a": "amb agulla",
  "s": "aixecat per sota",
  "f": "amb folre",
  "fa": "amb folre i agulla",
  "fm": "amb folre i manilles",
  "sf": "sense folre",
  "sm": "sense manilles",
  "mp": "amb manilles i puntals",
  "fmp": "amb folre, manilles i puntals",
};
const VAR_ORDER = ["", "a", "s", "f", "fa", "fm", "sf", "sm", "mp", "fmp"];

// Pisos que existeixen a la taula per a un nombre de persones
function pisosFor(castells, persones) {
  const prefix = persones + "de";
  const set = new Set();
  for (const k of Object.keys(castells)) {
    if (!k.startsWith(prefix)) continue;
    const m = k.slice(prefix.length).match(/^(\d+)/);
    if (m) set.add(m[1]);
  }
  return [...set].sort((a, b) => Number(a) - Number(b));
}

// Variants que existeixen a la taula per a un castell concret.
// Aixo elimina les categories redundants: per cada castell nomes
// surten les variants reals (p. ex. un 4de9 no ofereix "net", ofereix "sense folre").
function variantsFor(castells, persones, pisos) {
  const prefix = persones + "de" + pisos;
  const present = [];
  for (const k of Object.keys(castells)) {
    if (!k.startsWith(prefix)) continue;
    const suf = k.slice(prefix.length);
    if (/^\d/.test(suf)) continue; // evita que un pis sigui prefix d'un altre (p. ex. 1 vs 10)
    present.push(suf);
  }
  return VAR_ORDER.filter((v) => present.includes(v));
}

// Ajusta pisos i variant perque sempre siguin coherents amb persones i la taula activa
function normalitza(castells, c) {
  const pisosOpts = pisosFor(castells, c.persones);
  const pisos = pisosOpts.includes(c.pisos) ? c.pisos : pisosOpts[0];
  const varOpts = variantsFor(castells, c.persones, pisos);
  const variant = varOpts.includes(c.variant) ? c.variant : (varOpts[0] ?? "");
  return { ...c, pisos, variant };
}

const nomCastell = (c) => `${c.persones}de${c.pisos}${c.variant}`;

function puntsCastell(castells, c) {
  const fila = castells[nomCastell(c)];
  if (!fila) return null;
  return c.descarregat ? fila[1] : fila[0];
}

const fmt = (n) => (n == null ? "--" : n.toLocaleString("ca-ES"));

// Nom llegible a partir del codi canonic (p. ex. "3de9sf" -> "3 de 9 sense folre")
function nomLlegible(key) {
  const persones = key[0];
  const rest = key.slice(persones.length + 2); // treu persones + "de"
  const pisos = rest.match(/^(\d+)/)[1];
  const variant = rest.slice(pisos.length);
  const p = persones === "P" ? "Pilar" : persones;
  return `${p} de ${pisos}${variant ? " " + VARIANT_LABELS[variant] : ""}`;
}

// Ordena una taula per dificultat (punts de descarregat ascendents)
const ordenaTaula = (castells) =>
  Object.entries(castells).sort((a, b) => a[1][1] - b[1][1]);

// --- Compartir l'estat per URL ---
// Format del fragment (#...): "d=<payload>" en pla, o "z=<base64url>" amb
// deflate-raw; s'agafa sempre el més curt. El payload és:
//   versió | taulaId | actuació | actuació | ...
// on cada actuació és:  nom(encodeURIComponent) , color(hex) , castell.castell...
// i cada castell és la clau canònica amb "!" al final si va carregat.
const SHARE_VERSION = "1";
const DEFAULT_COLOR = "#7E1B2A";
const hasCompression =
  typeof CompressionStream !== "undefined" &&
  typeof DecompressionStream !== "undefined";

// "3de9sf" -> { persones:"3", pisos:"9", variant:"sf" }; null si no encaixa
function parseKey(key) {
  const m = key.match(/^(P|\d+)de(\d+)([a-z]*)$/);
  return m ? { persones: m[1], pisos: m[2], variant: m[3] } : null;
}

const b64urlFromBytes = (bytes) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const bytesFromB64url = (s) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};
async function deflateToB64url(str) {
  const cs = new CompressionStream("deflate-raw");
  const w = cs.writable.getWriter();
  w.write(new TextEncoder().encode(str));
  w.close();
  const buf = await new Response(cs.readable).arrayBuffer();
  return b64urlFromBytes(new Uint8Array(buf));
}
async function inflateFromB64url(b64) {
  const ds = new DecompressionStream("deflate-raw");
  const w = ds.writable.getWriter();
  w.write(bytesFromB64url(b64));
  w.close();
  const buf = await new Response(ds.readable).arrayBuffer();
  return new TextDecoder().decode(buf);
}

function buildPayload(taulaId, actuacions) {
  const acts = actuacions.map((a) => {
    const cast = a.castells
      .map((c) => nomCastell(c) + (c.descarregat ? "" : "!"))
      .join(".");
    const color = (a.color || "").replace(/^#/, "");
    return [encodeURIComponent(a.nom || ""), color, cast].join(",");
  });
  return [SHARE_VERSION, taulaId, ...acts].join("|");
}

// Retorna el contingut del fragment (sense el #): el més curt entre pla i deflate
async function encodeShare(taulaId, actuacions) {
  const payload = buildPayload(taulaId, actuacions);
  const plain = "d=" + payload;
  if (hasCompression) {
    try {
      const z = "z=" + (await deflateToB64url(payload));
      if (z.length < plain.length) return z;
    } catch (e) {
      /* si falla la compressió, fem servir el pla */
    }
  }
  return plain;
}

// Descodifica el fragment -> { taulaId, acts:[{nom,color,castellKeys}] } o null
async function decodeShare(frag) {
  if (!frag) return null;
  try {
    let payload;
    if (frag.startsWith("z=")) {
      if (!hasCompression) return null;
      payload = await inflateFromB64url(frag.slice(2));
    } else if (frag.startsWith("d=")) {
      payload = frag.slice(2);
    } else {
      return null;
    }
    const parts = payload.split("|");
    if (parts.shift() !== SHARE_VERSION) return null;
    const taulaId = parts.shift();
    const acts = parts.map((seg) => {
      const [name = "", color = "", cast = ""] = seg.split(",");
      return {
        nom: decodeURIComponent(name),
        color: /^[0-9a-fA-F]{6}$/.test(color) ? "#" + color : DEFAULT_COLOR,
        castellKeys: cast.split(".").filter(Boolean),
      };
    });
    return { taulaId, acts };
  } catch (e) {
    return null;
  }
}

// --- Persistencia local (localStorage) ---
// Desa l'ultim estat perque en tornar a obrir l'app (p. ex. instal·lada com a
// PWA) es recuperi tal com es va deixar. Mateix format { taulaId, acts } que
// decodeShare/EXEMPLES.
const STORAGE_KEY = "puntua:estat:v1";

function carregaStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && Array.isArray(data.acts) ? data : null;
  } catch (e) {
    return null;
  }
}

function desaStorage(taulaId, actuacions) {
  try {
    const acts = actuacions.map((a) => ({
      nom: a.nom,
      color: a.color,
      castellKeys: a.castells.map((c) => nomCastell(c) + (c.descarregat ? "" : "!")),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ taulaId, acts }));
  } catch (e) {
    /* localStorage no disponible (mode privat, quota exhaurida, etc.) */
  }
}

// Reconstrueix actuacions { id, nom, color, castells } a partir del format
// { nom, color, castellKeys } (enllaç, exemple o localStorage), normalitzant
// cada castell contra la taula donada.
function construeixActuacions(taula, acts, novaId) {
  return acts.map((a) => ({
    id: novaId(),
    nom: a.nom,
    color: a.color,
    castells: (a.castellKeys || [])
      .map((raw) => {
        const carregat = raw.endsWith("!");
        const p = parseKey(carregat ? raw.slice(0, -1) : raw);
        if (!p) return null;
        const c = normalitza(taula.castells, {
          id: novaId(),
          ...p,
          descarregat: !carregat,
        });
        return c.pisos ? c : null;
      })
      .filter(Boolean),
  }));
}

// Exemples precarregats. Mateix format que decodeShare: castellKeys amb "!"
// al final si el castell va carregat (per defecte, descarregat).
const EXEMPLES = [
  {
    id: "sant-felix-2025",
    label: "Sant Fèlix 2025",
    data: {
      taulaId: "2026",
      acts: [
        { nom: "Colla Joves Xiquets de Valls", color: "#d71418",
          castellKeys: ["2de9fm", "4de9sf", "2de8sf", "Pde8fm"] },
        { nom: "Castellers de Vilafranca", color: "#00CC99",
          castellKeys: ["5de9f", "9de9f!", "Pde8fm"] },
        { nom: "Colla Jove Xiquets de Tarragona", color: "#b588f2",
          castellKeys: ["2de9fm", "3de10fm!", "4de9f", "Pde8fm"] },
        { nom: "Colla Vella dels Xiquets de Valls", color: "#d77577",
          castellKeys: ["5de9f", "3de10fm!", "4de9sf", "Pde8fm"] },
      ],
    },
  },
  {
    id: "santa-ursula-2019",
    label: "Santa Úrsula 2019",
    data: {
      taulaId: "2018",
      acts: [
        { nom: "Colla Vella dels Xiquets de Valls", color: "#d77577",
          castellKeys: ["4de9sf", "3de9sf!", "2de8sf", "Pde8fm"] },
        { nom: "Colla Joves Xiquets de Valls", color: "#d71418",
          castellKeys: ["2de8sf", "4de9f", "3de9sf!", "Pde7f"] },
      ],
    },
  },
  {
    id: "minyons-terrassa-2016",
    label: "Diada dels Minyons 2016",
    data: {
      taulaId: "2016",
      acts: [
        { nom: "Minyons de Terrassa", color: "#ceaad4",
          castellKeys: ["3de10fm", "4de10fm", "3de9fa", "Pde8fm"] },
        { nom: "Castellers de Sants", color: "#7e7e7e",
          castellKeys: ["3de9f", "4de9f", "5de8"] },
        { nom: "Capgrossos de Mataró", color: "#20418b",
          castellKeys: ["3de9f", "5de9f!", "4de8", "Pde5", "Pde5"] },
      ],
    },
  },
  {
    id: "santa-ursula-1981",
    label: "Santa Úrsula 1981",
    data: {
      taulaId: "1980",
      acts: [
        { nom: "Colla Vella dels Xiquets de Valls", color: "#d77577",
          castellKeys: ["4de9f", "3de8", "2de8f"] },
        { nom: "Colla Joves Xiquets de Valls", color: "#d71418",
          castellKeys: ["5de8", "3de8"] },
      ],
    },
  },
];

function ExtIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",verticalAlign:"middle",marginLeft:"4px"}}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

function ComptadorCastells() {
  const idRef = useRef(1);
  const novaId = () => idRef.current++;

  // Si hi ha fragment a la URL, l'estat local es descarta a favor de l'enllaç
  // (l'hidrata l'efecte de sota, de manera asincrona).
  const teFragUrl = !!location.hash;

  const [taulaId, setTaulaId] = useState(() => {
    if (teFragUrl) return TAULES[0].id;
    const desat = carregaStorage();
    return desat && TAULES.some((t) => t.id === desat.taulaId) ? desat.taulaId : TAULES[0].id;
  });
  const taula = useMemo(
    () => TAULES.find((t) => t.id === taulaId) ?? TAULES[0],
    [taulaId]
  );
  const castells = taula.castells;
  const taulaOrdenada = useMemo(() => ordenaTaula(castells), [castells]);

  const nouCastell = () =>
    normalitza(castells, { id: novaId(), persones: "3", pisos: "8", variant: "", descarregat: true });

  const [actuacions, setActuacions] = useState(() => {
    const buit = [{ id: novaId(), nom: "Actuació 1", color: "#7E1B2A", castells: [] }];
    if (teFragUrl) return buit;
    const desat = carregaStorage();
    if (!desat) return buit;
    const t = TAULES.find((x) => x.id === desat.taulaId) ?? TAULES[0];
    return construeixActuacions(t, desat.acts, novaId);
  });

  const [mostraTaula, setMostraTaula] = useState(false);
  const [copiat, setCopiat] = useState(false);

  // Marca si l'ultim canvi d'estat prove d'una carrega externa (enllaç
  // compartit o exemple) en lloc d'una edicio de l'usuari; l'efecte de
  // desat local el consulta per no sobreescriure el que l'usuari tenia
  // desat nomes per haver obert/mirat un enllaç o exemple.
  const carregaExternaRef = useRef(teFragUrl);

  // Aplica un estat { taulaId, acts:[{nom,color,castellKeys}] } (enllaç o exemple):
  // fixa la taula i reconstrueix les actuacions, normalitzant cada castell.
  const aplicaEstat = (data) => {
    const t = TAULES.find((x) => x.id === data.taulaId) ?? TAULES[0];
    carregaExternaRef.current = true;
    setTaulaId(t.id);
    setActuacions(construeixActuacions(t, data.acts, novaId));
  };

  // Hidrata l'estat des del fragment de la URL (enllaç compartit): en muntar
  // i cada cop que canvia el hash (p. ex. s'obre un altre enllaç compartit
  // amb la pestanya ja carregada, on el navegador no recarrega la pagina).
  useEffect(() => {
    let cancelat = false;
    const hidrata = () => {
      const frag = location.hash.replace(/^#/, "");
      if (!frag) return;
      decodeShare(frag).then((data) => {
        if (!cancelat && data) aplicaEstat(data);
      });
    };
    hidrata();
    window.addEventListener("hashchange", hidrata);
    return () => {
      cancelat = true;
      window.removeEventListener("hashchange", hidrata);
    };
  }, []);

  // Desa l'estat actual a localStorage a cada canvi, tret que provingui
  // d'una carrega externa (enllaç o exemple) encara no editada per l'usuari.
  useEffect(() => {
    if (carregaExternaRef.current) {
      carregaExternaRef.current = false;
      return;
    }
    desaStorage(taulaId, actuacions);
  }, [taulaId, actuacions]);

  const carregaExemple = (id) => {
    const ex = EXEMPLES.find((e) => e.id === id);
    if (ex) aplicaEstat(ex.data);
  };

  // Construeix l'enllaç compartible, l'escriu a la barra d'adreces i el copia.
  const compartir = async () => {
    const frag = await encodeShare(taulaId, actuacions);
    const url =
      location.origin + location.pathname + location.search + "#" + frag;
    history.replaceState(null, "", "#" + frag);
    try {
      await navigator.clipboard.writeText(url);
      setCopiat(true);
      setTimeout(() => setCopiat(false), 1800);
    } catch (e) {
      /* sense permís de porta-retalls: l'URL ja és a la barra d'adreces */
    }
  };

  // Canvia de taula i renormalitza tots els castells perque segueixin sent
  // valids amb la nova taula (el conjunt de castells pot diferir per temporada).
  const canviarTaula = (id) => {
    const t = TAULES.find((x) => x.id === id) ?? TAULES[0];
    setTaulaId(id);
    setActuacions((a) =>
      a.map((x) => ({
        ...x,
        castells: x.castells.map((c) => normalitza(t.castells, c)),
      }))
    );
  };

  // --- mutacions ---
  const afegirActuacio = () =>
    setActuacions((a) => [
      ...a,
      { id: novaId(), nom: `Actuació ${a.length + 1}`, color: "#7E1B2A", castells: [] },
    ]);

  const esborrarActuacio = (id) =>
    setActuacions((a) => a.filter((x) => x.id !== id));

  const renombrar = (id, nom) =>
    setActuacions((a) => a.map((x) => (x.id === id ? { ...x, nom } : x)));

  const canviarColor = (id, color) =>
    setActuacions((a) => a.map((x) => (x.id === id ? { ...x, color } : x)));

  const afegirCastell = (actId) =>
    setActuacions((a) =>
      a.map((x) =>
        x.id === actId ? { ...x, castells: [...x.castells, nouCastell()] } : x
      )
    );

  const esborrarCastell = (actId, cId) =>
    setActuacions((a) =>
      a.map((x) =>
        x.id === actId
          ? { ...x, castells: x.castells.filter((c) => c.id !== cId) }
          : x
      )
    );

  // Aplica un canvi parcial i renormalitza el castell (cascada persones -> pisos -> variant)
  const canviarCastell = (actId, cId, patch) =>
    setActuacions((a) =>
      a.map((x) =>
        x.id === actId
          ? {
              ...x,
              castells: x.castells.map((c) =>
                c.id === cId ? normalitza(castells, { ...c, ...patch }) : c
              ),
            }
          : x
      )
    );

  const totalActuacio = (act) =>
    act.castells.reduce((s, c) => s + (puntsCastell(castells, c) || 0), 0);

  const classificacio = useMemo(
    () =>
      actuacions
        .map((a) => ({ id: a.id, nom: a.nom, total: totalActuacio(a) }))
        .sort((x, y) => y.total - x.total),
    [actuacions, castells]
  );

  return (
    <div className="cc-root">
      <style>{CSS}</style>
      {/*
      <header className="cc-head">
        <div className="cc-kicker">Concurs de Castells</div>
        <h1>Comptador de punts</h1>
        <p className="cc-sub">
          Suma els punts d'una actuació segons la taula oficial de puntuacions.
          Afegeix tantes colles com vulguis per comparar-les.
        </p>
      </header>
      */}

      {classificacio.length >= 2 && (
        <section className="cc-rank" aria-label="Classificació">
          <div className="cc-rank-title">Classificació</div>
          <ol className="cc-rank-list">
            {classificacio.map((r, i) => (
              <li key={r.id} className={i === 0 && r.total > 0 ? "lider" : ""}>
                <span className="pos">{i + 1}</span>
                <span className="nm">{r.nom || "Sense nom"}</span>
                <span className="pt">{fmt(r.total)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="cc-grid">
        {actuacions.map((act) => {
          const total = totalActuacio(act);
          return (
            <section className="cc-card" key={act.id}>
              <div className="cc-card-top">
                <input
                  type="color"
                  className="cc-color"
                  value={act.color}
                  title="Color de l'actuació"
                  onChange={(e) => canviarColor(act.id, e.target.value)}
                />
                <input
                  className="cc-nom"
                  value={act.nom}
                  placeholder="Nom de l'actuació"
                  onChange={(e) => renombrar(act.id, e.target.value)}
                />
                <button
                  className="cc-x cc-x-act"
                  title="Esborrar actuació"
                  onClick={() => esborrarActuacio(act.id)}
                >
                  Esborrar
                </button>
              </div>

              <div className="cc-total">
                <span className="cc-total-num" style={{ color: act.color }}>{fmt(total)}</span>
                <span className="cc-total-lab">
                  punts &middot; {act.castells.length}{" "}
                  {act.castells.length === 1 ? "castell" : "castells"}
                </span>
              </div>

              <div className="cc-castells">
                {act.castells.length === 0 && (
                  <p className="cc-buit">
                    Cap castell encara. Afegeix-ne un per començar a sumar.
                  </p>
                )}

                {act.castells.map((c) => {
                  const punts = puntsCastell(castells, c);
                  return (
                    <div className="cc-row" key={c.id}>
                      <div className="cc-selects">
                        <select
                          value={c.persones}
                          onChange={(e) =>
                            canviarCastell(act.id, c.id, { persones: e.target.value })
                          }
                        >
                          {PERSONES.map((p) => (
                            <option key={p.v} value={p.v}>
                              {p.l}
                            </option>
                          ))}
                        </select>
                        <span className="cc-de">de</span>
                        <select
                          value={c.pisos}
                          onChange={(e) =>
                            canviarCastell(act.id, c.id, { pisos: e.target.value })
                          }
                        >
                          {pisosFor(castells, c.persones).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <select
                          className="cc-variant"
                          value={c.variant}
                          onChange={(e) =>
                            canviarCastell(act.id, c.id, { variant: e.target.value })
                          }
                        >
                          {variantsFor(castells, c.persones, c.pisos).map((v) => (
                            <option key={v} value={v}>
                              {VARIANT_LABELS[v]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label
                        className="cc-toggle"
                        title="Marcat = descarregat. Desmarcat = carregat."
                      >
                        <input
                          type="checkbox"
                          checked={c.descarregat}
                          onChange={(e) =>
                            canviarCastell(act.id, c.id, {
                              descarregat: e.target.checked,
                            })
                          }
                        />
                        <span>{c.descarregat ? "Descarregat" : "Carregat"}</span>
                      </label>

                      <div className="cc-rowend">
                        <code className="cc-codi">{nomCastell(c)}</code>
                        <span className="cc-pts">{fmt(punts)}</span>
                        <button
                          className="cc-x"
                          title="Treure castell"
                          onClick={() => esborrarCastell(act.id, c.id)}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="cc-add cc-add-castell"
                onClick={() => afegirCastell(act.id)}
              >
                + Afegir castell
              </button>
            </section>
          );
        })}
      </div>

      <div className="cc-bottom-actions">
        <button className="cc-add cc-add-act" onClick={afegirActuacio}>
          + Afegir actuació
        </button>

        <button
          className="cc-link cc-link-taula"
          onClick={() => setMostraTaula((v) => !v)}
        >
          {mostraTaula ? "Amagar taula de punts" : "Taula de punts"}
        </button>

        <button className="cc-link cc-link-taula" onClick={compartir}>
          {copiat ? "Enllaç copiat!" : "Compartir"}
        </button>
      </div>

      <div className="cc-bottom-actions">
        <a className="cc-ext-link" href="https://www.concursdecastells.cat/ranking-concurs" target="_blank" rel="noopener noreferrer">
          Rànquing concurs <ExtIcon />
        </a>
        <a className="cc-ext-link" href="https://barometrecasteller.cat/bc%e2%ad%902025/" target="_blank" rel="noopener noreferrer">
          Baròmetre <ExtIcon />
        </a>
        <a className="cc-ext-link" href="https://castellscat.cat/ca/base-de-dades" target="_blank" rel="noopener noreferrer">
          Base de dades <ExtIcon />
        </a>
      </div>

      {(TAULES.length > 1 || EXEMPLES.length > 0) && (
        <div className="cc-season">
          {TAULES.length > 1 && (
            <div className="cc-season-group">
              <label htmlFor="cc-season-sel">Taula de puntuacions</label>
              <select
                id="cc-season-sel"
                value={taulaId}
                onChange={(e) => canviarTaula(e.target.value)}
              >
                {TAULES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {EXEMPLES.length > 0 && (
            <div className="cc-season-group">
              <label htmlFor="cc-exemple-sel">Carrega un exemple</label>
              <select
                id="cc-exemple-sel"
                value=""
                onChange={(e) => carregaExemple(e.target.value)}
              >
                <option value="" disabled>
                  Trieu…
                </option>
                {EXEMPLES.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {mostraTaula && (
        <section className="cc-taula" aria-label="Taula de puntuacions">
          <div className="cc-taula-head">
            <span className="cc-taula-title">Taula de puntuacions</span>
            <button className="cc-link" onClick={() => setMostraTaula(false)}>
              Amagar
            </button>
          </div>
          <div className="cc-taula-scroll">
            <table>
              <thead>
                <tr>
                  <th>Castell</th>
                  <th className="num">Descarregat</th>
                  <th className="num">Carregat</th>
                </tr>
              </thead>
              <tbody>
                {taulaOrdenada.map(([codi, [carr, desc]]) => (
                  <tr key={codi}>
                    <td>
                      <code className="cc-codi">{codi}</code>
                      <span className="cc-tname">{nomLlegible(codi)}</span>
                    </td>
                    <td className="num">{fmt(desc)}</td>
                    <td className="num">{fmt(carr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {/*
      <footer className="cc-foot">
        Puntuacions segons la taula del Concurs de Castells (Ajuntament de
        Tarragona). Cada castell només ofereix les variants que existeixen
        realment a la taula.
      </footer>
              */}
    </div>
  );
}

const CSS = `
.cc-root{
  --paper:#FAF8F4; --surface:#FFFFFF; --ink:#1C1A17; --muted:#6B645C;
  --line:#E2DACC; --granat:#7E1B2A; --granat-soft:#F3E4E1; --ochre:#B7791F;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  color:var(--ink); background:var(--paper);
  min-height:100%; padding:24px 16px 56px; box-sizing:border-box;
  -webkit-font-smoothing:antialiased;
}
.cc-root *{box-sizing:border-box;}
.cc-pts,.cc-codi,.cc-total-num,.cc-rank .pt,.cc-rank .pos{
  font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace; font-variant-numeric:tabular-nums;
}

.cc-head{max-width:880px; margin:0 auto 20px;}
.cc-kicker{
  font-size:12px; letter-spacing:.18em; text-transform:uppercase;
  color:var(--granat); font-weight:700; margin-bottom:6px;
}
.cc-head h1{font-size:30px; line-height:1.05; margin:0 0 8px; font-weight:800; letter-spacing:-.01em;}
.cc-sub{margin:0; color:var(--muted); font-size:15px; max-width:60ch;}

.cc-link{
  background:none; border:none; padding:0; color:var(--granat); font-weight:600;
  font-size:14px; cursor:pointer; text-decoration:underline; text-underline-offset:3px;
}
.cc-link:hover{opacity:.75;}
.cc-link-taula{
  display:inline-flex; align-items:center; gap:8px; flex-shrink:0;
  text-decoration:none; border:1.5px solid var(--granat); color:var(--granat);
  background:var(--granat-soft); padding:9px 16px; border-radius:11px;
}
.cc-link-taula:hover{background:var(--granat); color:#fff; opacity:1;}

.cc-bottom-actions{
  max-width:880px; margin:18px auto 0; display:flex; align-items:center; gap:12px;
}

.cc-taula{
  max-width:880px; margin:0 auto 22px; background:var(--surface);
  border:1px solid var(--line); border-radius:14px; padding:14px 16px;
}
.cc-taula-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
.cc-taula-title{font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.cc-taula-scroll{max-height:60vh; overflow:auto; border:1px solid var(--line); border-radius:10px;}
.cc-taula table{width:100%; border-collapse:collapse; font-size:13px;}
.cc-taula th,.cc-taula td{padding:7px 10px; text-align:left; border-bottom:1px solid var(--line);}
.cc-taula thead th{position:sticky; top:0; background:var(--paper); font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); z-index:1;}
.cc-taula th.num,.cc-taula td.num{text-align:right; font-family:ui-monospace,Menlo,Consolas,monospace; font-variant-numeric:tabular-nums;}
.cc-taula tbody tr:last-child td{border-bottom:none;}
.cc-tname{color:var(--muted); font-size:12px; margin-left:8px;}

.cc-rank{
  max-width:880px; margin:0 auto 22px; background:var(--surface);
  border:1px solid var(--line); border-radius:14px; padding:14px 16px;
}
.cc-rank-title{font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:700; margin-bottom:8px;}
.cc-rank-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px;}
.cc-rank-list li{display:flex; align-items:center; gap:12px; padding:7px 10px; border-radius:8px;}
.cc-rank-list li.lider{background:var(--granat-soft);}
.cc-rank .pos{width:22px; text-align:center; color:var(--muted); font-size:13px;}
.cc-rank-list li.lider .pos{color:var(--granat); font-weight:700;}
.cc-rank .nm{flex:1; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.cc-rank .pt{font-weight:700;}
.cc-rank-list li.lider .pt{color:var(--granat);}

.cc-season{
  max-width:880px; margin:18px auto 0; display:flex; flex-wrap:wrap; align-items:center; gap:12px 22px;
}
.cc-season-group{display:flex; align-items:center; gap:10px;}
.cc-season label{font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.cc-season select{
  font-size:14px; font-weight:600; padding:8px 12px; border:1px solid var(--line);
  border-radius:10px; background:var(--surface); color:var(--ink); cursor:pointer; outline:none;
}
.cc-season select:focus{border-color:var(--granat);}

.cc-grid{max-width:880px; margin:0 auto; display:flex; flex-direction:column; gap:18px;}

.cc-card{
  background:var(--surface); border:1px solid var(--line); border-radius:16px;
  padding:16px; box-shadow:0 1px 0 rgba(28,26,23,.03);
}
.cc-card-top{display:flex; align-items:center; gap:10px; margin-bottom:6px;}
.cc-color{
  flex-shrink:0; width:30px; height:30px; padding:0; cursor:pointer;
  border:1px solid var(--line); border-radius:8px; background:none;
}
.cc-color::-webkit-color-swatch-wrapper{padding:3px;}
.cc-color::-webkit-color-swatch{border:none; border-radius:5px;}
.cc-color::-moz-color-swatch{border:none; border-radius:5px;}
.cc-nom{
  flex:1; font-size:19px; font-weight:700; color:var(--ink);
  border:none; border-bottom:2px solid transparent; background:transparent;
  padding:4px 2px; outline:none; min-width:0;
}
.cc-nom:focus{border-bottom-color:var(--granat);}

.cc-total{display:flex; align-items:baseline; gap:10px; margin:2px 2px 14px;}
.cc-total-num{font-size:34px; font-weight:800; color:var(--granat); letter-spacing:-.02em;}
.cc-total-lab{color:var(--muted); font-size:13px;}

.cc-castells{display:flex; flex-direction:column; gap:8px;}
.cc-buit{color:var(--muted); font-size:14px; font-style:italic; margin:2px 0 10px;}

.cc-row{
  display:flex; flex-wrap:wrap; align-items:center; gap:8px 10px;
  padding:10px; border:1px solid var(--line); border-radius:11px; background:var(--paper);
}

.cc-selects{display:flex; align-items:center; gap:6px; flex-wrap:wrap;}
.cc-de{color:var(--muted); font-size:13px;}
.cc-row select{
  font-size:14px; padding:7px 8px; border:1px solid var(--line); border-radius:8px;
  background:var(--surface); color:var(--ink); outline:none; cursor:pointer; max-width:100%;
}
.cc-row select:focus{border-color:var(--granat);}
.cc-variant{min-width:120px;}

.cc-toggle{display:inline-flex; align-items:center; gap:7px; font-size:13px; color:var(--muted); cursor:pointer; user-select:none;}
.cc-toggle input{width:16px; height:16px; accent-color:var(--granat); cursor:pointer;}
.cc-toggle span{min-width:84px;}

.cc-rowend{display:flex; align-items:center; gap:10px; margin-left:auto;}
.cc-codi{
  font-size:12px; color:var(--muted); background:var(--surface);
  border:1px solid var(--line); border-radius:6px; padding:2px 7px;
}
.cc-pts{font-size:18px; font-weight:700; min-width:62px; text-align:right;}

.cc-x{
  border:none; background:transparent; color:var(--muted); cursor:pointer;
  font-size:20px; line-height:1; width:28px; height:28px; border-radius:7px;
}
.cc-x:hover{background:var(--granat-soft); color:var(--granat);}
.cc-x-act{font-size:13px; width:auto; padding:5px 10px; font-weight:600;}

.cc-add{
  border:1.5px dashed var(--line); background:transparent; color:var(--ink);
  font-size:14px; font-weight:600; padding:10px 14px; border-radius:11px; cursor:pointer;
}
.cc-add:hover{border-color:var(--granat); color:var(--granat);}
.cc-add-castell{margin-top:12px; width:100%;}
.cc-add-act{flex:1;
  border-style:solid; border-color:var(--granat); color:var(--granat); background:var(--granat-soft);
}
.cc-add-act:hover{background:var(--granat); color:#fff; border-color:var(--granat);}
.cc-ext-link{
  flex:1; display:inline-flex; align-items:center; justify-content:center;
  text-decoration:none; border:1.5px solid var(--granat); color:var(--granat);
  background:var(--granat-soft); padding:9px 16px; border-radius:11px;
  font-size:14px; font-weight:600;
}
.cc-ext-link:hover{background:var(--granat); color:#fff;}

.cc-foot{max-width:880px; margin:28px auto 0; color:var(--muted); font-size:12px; line-height:1.5;}

@media (max-width:560px){
  .cc-head h1{font-size:25px;}
  .cc-rowend{margin-left:0; width:100%; justify-content:flex-end;}
  .cc-variant{flex:1;}
  .cc-bottom-actions{flex-direction:column;}
  .cc-add-act{width:100%;}
}
`;
