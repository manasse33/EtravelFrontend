import fs from 'fs';
import path from 'path';

import process from 'process';


const structure = {
  src: {
    assets: {},
    components: {
      'Header.jsx': '',
      'Footer.jsx': '',
      'FiliereCard.jsx': '',
      'UniversityCard.jsx': '',
      'OrientationTest.jsx': '',
      'ResultsList.jsx': '',
      'Filters.jsx': '',
      'StatsChart.jsx': '',
    },
    pages: {
      'Home.jsx': '',
      'FiliereList.jsx': '',
      'FiliereDetail.jsx': '',
      'TestOrientation.jsx': '',
      'Results.jsx': '',
      'Dashboard.jsx': '',
      'UniversityProfile.jsx': '',
      'StudentProfile.jsx': '',
    },
    routes: {
      'AppRouter.jsx': '',
    },
    services: {
      'filieres.js': '',
      'universities.js': '',
      'test.js': '',
      'analytics.js': '',
    },
    utils: {
      'helpers.js': '',
    },
    'App.jsx': '',
    'index.jsx': '',
    'tailwind.css': '',
  },
};

function createStructure(basePath, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    const fullPath = path.join(basePath, key);
    if (typeof value === 'object') {
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
      createStructure(fullPath, value);
    } else {
      if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, value);
    }
  });
}

createStructure(process.cwd(), structure);
console.log('Structure générée avec succès !');
